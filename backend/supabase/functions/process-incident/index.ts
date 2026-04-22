// ============================================================
// CrisisSync AI — Edge Function: process-incident
// ============================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MIDDLEWARE_VERSION = "1.1";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: any;
  old_record: any | null;
}

const SYSTEM_PROMPT = `
You are the intelligent middleware layer for a Rapid Crisis Response system.
Role: The Nervous System — detects, scores, routes, and broadcasts crisis events in real-time.

## AI Classification Layer
Classify incoming events using this severity schema:
- SEV-1 (Critical): immediate life threat — fire, active violence, cardiac arrest, structural collapse
- SEV-2 (High): significant risk — medical emergency, suspected intruder, large crowd panic
- SEV-3 (Medium): operational disruption — minor injury, power outage, guest altercation
- SEV-4 (Low): informational — unusual behaviour, noise complaint, maintenance alert

## LLM Decision Support Engine (Crisis Brain)
1. Parse the full incident context.
2. Generate a ranked action plan with explicit reasoning.
3. Recommend evacuation routes.
4. Identify resource gaps.
5. Predict next likely escalation within 10 minutes.

## Output Contract
You MUST respond ONLY with a valid JSON object following this structure:
{
  "severity": "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4",
  "type": "string",
  "confidence": number,
  "recommended_response": "string",
  "escalate_to_emergency_services": boolean,
  "action_plan": ["string"],
  "evacuation_routes": ["string"],
  "resource_gaps": ["string"],
  "predicted_escalation": "string"
}
`;

async function analyzeWithClaude(incident: any, sensorType: string, location: string) {
  const userMessage = `
Incident ID: ${incident.id}
Sensor Type: ${sensorType}
Location: ${location}
Payload: ${JSON.stringify(incident.raw_payload, null, 2)}
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      temperature: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${await response.text()}`);
  }

  const data = await response.json();
  const rawText = data.content[0].text;
  return JSON.parse(rawText.replace(/```json|```/g, "").trim());
}

serve(async (req) => {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== Deno.env.get("EDGE_FUNCTION_SECRET")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const payload: WebhookPayload = await req.json();
    if (payload.type !== "INSERT" || payload.table !== "incidents") {
      return new Response(JSON.stringify({ status: "skipped" }), { status: 200 });
    }

    const incident = payload.record;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: sensor } = await supabase
      .from("sensors")
      .select("type, locations(zone_name)")
      .eq("id", incident.sensor_id)
      .single();

    const analysis = await analyzeWithClaude(
      incident,
      sensor?.type ?? "unknown",
      sensor?.locations?.zone_name ?? "unknown"
    );

    // Map SEV to score for existing schema compatibility
    const severityMap: Record<string, number> = { "SEV-1": 10, "SEV-2": 7, "SEV-3": 4, "SEV-4": 2 };
    const score = severityMap[analysis.severity] ?? 5;

    const { error: updateError } = await supabase
      .from("incidents")
      .update({
        ai_severity_score: score,
        ai_suggested_action: analysis.recommended_response,
        ai_raw_response: analysis,
        status: score >= 7 ? "active" : "detecting"
      })
      .eq("id", incident.id);

    if (updateError) throw updateError;

    // Output Contract response
    return new Response(JSON.stringify({
      middleware_version: MIDDLEWARE_VERSION,
      incident_id: incident.id,
      layer: "classification",
      status: "ok",
      payload: analysis,
      next_action: analysis.escalate_to_emergency_services ? "ESCALATE_TO_911" : "MONITOR",
      timestamp: new Date().toISOString()
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({
      middleware_version: MIDDLEWARE_VERSION,
      incident_id: null,
      layer: "classification",
      status: "error",
      payload: { error: err.message },
      next_action: "RETRY",
      timestamp: new Date().toISOString()
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
