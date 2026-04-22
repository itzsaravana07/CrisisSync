-- Seed data for CrisisSync AI

-- 1. Locations
INSERT INTO public.locations (id, zone_name, floor_level) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Main Kitchen', -1),
  ('22222222-2222-2222-2222-222222222222', 'Lobby Level 1', 1),
  ('33333333-3333-3333-3333-333333333333', 'Pool Deck', 5),
  ('44444444-4444-4444-4444-444444444444', 'East Wing Entrance', 1),
  ('55555555-5555-5555-5555-555555555555', 'Rooftop Bar', 12);

-- 2. Sensors
INSERT INTO public.sensors (id, location_id, type, status) VALUES
  ('a1111111-a111-a111-a111-a11111111111', '11111111-1111-1111-1111-111111111111', 'smoke', 'online'),
  ('a2222222-a222-a222-a222-a22222222222', '22222222-2222-2222-2222-222222222222', 'cctv', 'online'),
  ('a3333333-a333-a333-a333-a33333333333', '33333333-3333-3333-3333-333333333333', 'audio', 'online'),
  ('a4444444-a444-a444-a444-a44444444444', '44444444-4444-4444-4444-444444444444', 'manual', 'online'),
  ('a5555555-a555-a555-a555-a55555555555', '55555555-5555-5555-5555-555555555555', 'seismic', 'online');

-- 3. Initial Staff (Static for now as per schema)
-- Staff table wasn't in schema, but we can add a table if needed.
-- For now, let's keep staff in frontend mock but allow fetching if we add it.
