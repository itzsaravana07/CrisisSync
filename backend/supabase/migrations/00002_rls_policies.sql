-- ============================================================
-- CrisisSync AI — Row Level Security
-- Strategy:
--   • Edge devices (sensors) use the anon key → INSERT only
--   • Admin users (authenticated + role claim) → SELECT + UPDATE
--   • action_logs are INSERT-only for everyone; no one can delete
-- ============================================================

-- ─── INCIDENTS TABLE ────────────────────────────────────────
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Policy: Anonymous edge devices / sensor middleware can INSERT new incidents
CREATE POLICY "anon_can_insert_incidents"
  ON public.incidents
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Policy: Only authenticated users with the 'admin' app_metadata role can SELECT
CREATE POLICY "admin_can_select_incidents"
  ON public.incidents
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Policy: Only admins can UPDATE incidents (e.g., resolve, escalate)
CREATE POLICY "admin_can_update_incidents"
  ON public.incidents
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ─── SENSORS TABLE ──────────────────────────────────────────
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;

-- Edge devices can read their own sensor record to validate themselves
CREATE POLICY "anon_can_select_sensors"
  ON public.sensors
  FOR SELECT
  TO anon
  USING (TRUE);

-- Only admins can modify sensor configuration
CREATE POLICY "admin_can_manage_sensors"
  ON public.sensors
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ─── LOCATIONS TABLE ────────────────────────────────────────
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Public read for all (floor maps shown to guests on evacuation screens)
CREATE POLICY "public_can_select_locations"
  ON public.locations
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

CREATE POLICY "admin_can_manage_locations"
  ON public.locations
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ─── ACTION_LOGS TABLE ──────────────────────────────────────
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;

-- System and edge functions can INSERT via service role (bypasses RLS)
-- Authenticated admins can SELECT for the audit dashboard
CREATE POLICY "admin_can_select_action_logs"
  ON public.action_logs
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
