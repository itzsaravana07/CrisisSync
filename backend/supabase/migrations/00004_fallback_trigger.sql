-- ============================================================
-- CrisisSync AI — Hardcoded Fallback Severity Trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_fallback_severity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_sensor_type sensor_type;
BEGIN
  SELECT type INTO v_sensor_type
  FROM public.sensors
  WHERE id = NEW.sensor_id;

  NEW.fallback_severity := CASE v_sensor_type
    WHEN 'smoke'    THEN 9
    WHEN 'audio'    THEN 7
    WHEN 'seismic'  THEN 8
    WHEN 'cctv'     THEN 5
    WHEN 'manual'   THEN 6
    ELSE                 4
  END;

  IF NEW.fallback_severity >= 7 THEN
    NEW.status := 'active';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_fallback_severity ON public.incidents;
CREATE TRIGGER trg_set_fallback_severity
  BEFORE INSERT ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.set_fallback_severity();
