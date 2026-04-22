-- ============================================================
-- CrisisSync AI — Realtime + Audit Trigger
-- ============================================================

-- ─── ENABLE SUPABASE REALTIME ───────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.action_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensors;

-- ─── AUDIT TRIGGER ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_incident_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.action_logs (incident_id, actor, action, metadata)
  VALUES (
    NEW.id,
    'system',
    'System Alert Triggered',
    jsonb_build_object(
      'sensor_id',      NEW.sensor_id,
      'raw_payload',    NEW.raw_payload,
      'initial_status', NEW.status,
      'triggered_at',   NOW()
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_incident_created ON public.incidents;
CREATE TRIGGER trg_log_incident_created
  AFTER INSERT ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.log_incident_created();


-- ─── AI ENRICHMENT LOG TRIGGER ──────────────────────────────
CREATE OR REPLACE FUNCTION public.log_ai_enrichment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.ai_suggested_action IS NULL AND NEW.ai_suggested_action IS NOT NULL THEN
    INSERT INTO public.action_logs (incident_id, actor, action, metadata)
    VALUES (
      NEW.id,
      'edge-function',
      'AI Decision Support Received',
      jsonb_build_object(
        'ai_severity_score',   NEW.ai_severity_score,
        'ai_suggested_action', NEW.ai_suggested_action,
        'latency_ms',          EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) * 1000
      )
    );
  END IF;

  IF OLD.status <> NEW.status THEN
    INSERT INTO public.action_logs (incident_id, actor, action, metadata)
    VALUES (
      NEW.id,
      'system',
      'Status Changed: ' || OLD.status || ' → ' || NEW.status,
      jsonb_build_object('changed_at', NOW())
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_ai_enrichment ON public.incidents;
CREATE TRIGGER trg_log_ai_enrichment
  AFTER UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.log_ai_enrichment();
