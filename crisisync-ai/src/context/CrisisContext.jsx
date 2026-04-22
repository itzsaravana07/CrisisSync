import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration - Ensure these are in your .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CrisisContext = createContext(null);

export function CrisisProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activeIncident, setActiveIncident] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showEscalate, setShowEscalate] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState(null);
  const [alarmActive, setAlarmActive] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ─── Initial Data Fetch ────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      const { data: incidentData } = await supabase
        .from('incidents')
        .select('*, sensors(type, locations(zone_name))')
        .order('created_at', { ascending: false });

      const { data: sensorData } = await supabase
        .from('sensors')
        .select('*, locations(zone_name)');

      if (incidentData) setIncidents(incidentData.map(mapIncident));
      if (sensorData) setSensors(sensorData);
    }
    fetchData();
  }, []);

  // ─── Realtime Subscriptions ───────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('crisis-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' }, payload => {
        fetchSingleIncident(payload.new.id);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'incidents' }, payload => {
        fetchSingleIncident(payload.new.id, true);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchSingleIncident(id, isUpdate = false) {
    const { data } = await supabase
      .from('incidents')
      .select('*, sensors(type, locations(zone_name))')
      .eq('id', id)
      .single();

    if (data) {
      const mapped = mapIncident(data);
      if (isUpdate) {
        setIncidents(prev => prev.map(inc => inc.id === id ? mapped : inc));
        if (data.ai_suggested_action) {
           pushNotification(`🤖 AI Decision Support Received for ${mapped.type}`, 'success');
        }
      } else {
        setIncidents(prev => [mapped, ...prev]);
        pushNotification(`🚨 NEW ALERT: ${mapped.type} at ${mapped.location}`, 'critical');
        if (mapped.severity_level === 'Critical') setAlarmActive(true);
      }
    }
  }

  // ─── Mapping Helper ────────────────────────────────────────
  function mapIncident(raw) {
    const ai = raw.ai_raw_response || {};
    return {
      id: raw.id,
      type: ai.type || (raw.sensors?.type === 'smoke' ? 'Fire' : raw.sensors?.type === 'audio' ? 'Medical' : 'Alert'),
      location: raw.sensors?.locations?.zone_name || 'Processing...',
      sensor_id: raw.sensor_id,
      timestamp: raw.created_at,
      severity_level: raw.ai_severity_score >= 9 ? 'Critical' : raw.ai_severity_score >= 7 ? 'High' : raw.ai_severity_score >= 4 ? 'Medium' : 'Low',
      status: raw.status.charAt(0).toUpperCase() + raw.status.slice(1),
      detected_by: `Sensor ${raw.sensor_id.slice(0, 4)}`,
      raw_value: JSON.stringify(raw.raw_payload),
      ai_suggested_action: raw.ai_suggested_action || 'AI Middleware analyzing scenario...',
      action_plan: ai.action_plan || [],
      evacuation_routes: ai.evacuation_routes || [],
      resource_gaps: ai.resource_gaps || [],
      payload: raw.raw_payload,
      coordinates: { x: 50, y: 50 }
    };
  }

  const pushNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, type, time: new Date() }, ...prev.slice(0, 9)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  const acknowledgeIncident = async (id) => {
    await supabase.from('incidents').update({ status: 'active' }).eq('id', id);
    pushNotification(`✓ Incident acknowledged`, 'success');
  };

  const resolveIncident = async (id) => {
    await supabase.from('incidents').update({
      status: 'resolved',
      is_resolved: true,
      resolved_at: new Date().toISOString()
    }).eq('id', id);
    pushNotification(`✅ Incident resolved`, 'success');
  };

  const triggerSOS = useCallback(async () => {
    setAlarmActive(true);
    await supabase.from('incidents').insert([{
      sensor_id: 'a4444444-a444-a444-a444-a44444444444', // Manual SOS UUID
      raw_payload: { source: 'Admin SOS Button', event: 'PANIC' },
      status: 'active'
    }]);
    pushNotification('🚨 SOS TRIGGERED — Dispatched to AI Middleware', 'critical');
    setTimeout(() => setAlarmActive(false), 5000);
  }, [pushNotification]);

  return (
    <CrisisContext.Provider value={{
      incidents, sensors, staff,
      activeIncident, setActiveIncident,
      showBroadcast, setShowBroadcast,
      showEscalate,  setShowEscalate,
      broadcastTarget, setBroadcastTarget,
      alarmActive, triggerSOS,
      notifications,
      criticalCount: incidents.filter(i => i.severity_level === 'Critical' && i.status !== 'Resolved').length,
      activeCount: incidents.filter(i => i.status !== 'Resolved').length,
      acknowledgeIncident, resolveIncident,
      pushNotification,
    }}>
      {children}
    </CrisisContext.Provider>
  );
}

export const useCrisis = () => useContext(CrisisContext);
