-- ============================================================
-- CrisisSync AI — Core Schema
-- Strategic note: ENUMs enforce valid states at the DB layer,
-- preventing garbage data from sensors/edge clients.
-- ============================================================

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- TABLE: locations
-- Represents physical zones in the venue (floors, wings, lobbies)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.locations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name    TEXT    NOT NULL,                   -- e.g. "Main Kitchen", "Lobby Floor 1"
  floor_level  INTEGER NOT NULL DEFAULT 1,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ENUM: sensor_type
-- Closed set of sensor categories — new types require a schema change (intentional)
-- ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE sensor_type AS ENUM ('smoke', 'audio', 'cctv', 'manual', 'seismic');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────
-- ENUM: sensor_status
-- ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE sensor_status AS ENUM ('online', 'offline', 'fault', 'maintenance');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────
-- TABLE: sensors
-- Physical/virtual sensors attached to locations
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sensors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  type        sensor_type   NOT NULL,
  status      sensor_status NOT NULL DEFAULT 'online',
  last_ping   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sensors_location ON public.sensors(location_id);

-- ─────────────────────────────────────────────
-- ENUM: incident_status
-- Lifecycle states for each crisis event
-- ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE incident_status AS ENUM ('detecting', 'active', 'escalated', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────
-- TABLE: incidents
-- Core table. Every crisis event lives here.
-- ai_severity_score and ai_suggested_action start NULL;
-- the Edge Function populates them asynchronously within ~10s.
-- The fallback trigger sets a default severity instantly on INSERT.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.incidents (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id            UUID NOT NULL REFERENCES public.sensors(id) ON DELETE SET NULL,

  -- Raw sensor payload from the edge device (JSON blob)
  raw_payload          JSONB NOT NULL DEFAULT '{}',

  -- Optimistic fallback score set immediately by DB trigger (1–10)
  fallback_severity    INTEGER CHECK (fallback_severity BETWEEN 1 AND 10),

  -- AI-enriched fields (populated ~8–10s later by Edge Function)
  ai_severity_score    INTEGER CHECK (ai_severity_score BETWEEN 1 AND 10),
  ai_suggested_action  TEXT,                          -- e.g. "Evacuate Floor 3 via Stairwell B"
  ai_raw_response      JSONB,                         -- Full Claude response for audit

  status               incident_status NOT NULL DEFAULT 'detecting',
  is_resolved          BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_status     ON public.incidents(status);
CREATE INDEX idx_incidents_created_at ON public.incidents(created_at DESC);
CREATE INDEX idx_incidents_sensor_id  ON public.incidents(sensor_id);

-- ─────────────────────────────────────────────
-- Auto-update updated_at on incidents
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_incidents_updated_at ON public.incidents;
CREATE TRIGGER trg_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
