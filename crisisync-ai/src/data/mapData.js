export const PROPERTY_ZONES = [
  { id: 'L1-Lobby',      label: 'Lobby',         x: 30, y: 75, w: 40, h: 15, floor: 1,   color: 'rgba(0,245,255,0.08)' },
  { id: 'L1-Reception',  label: 'Reception',      x: 72, y: 75, w: 20, h: 15, floor: 1,   color: 'rgba(0,245,255,0.05)' },
  { id: 'B1-Kitchen',    label: 'Kitchen',        x: 10, y: 75, w: 18, h: 15, floor: -1,  color: 'rgba(255,26,26,0.2)' },
  { id: 'EW-Entrance',   label: 'East Entrance',  x: 75, y: 50, w: 22, h: 18, floor: 1,   color: 'rgba(255,26,26,0.15)' },
  { id: 'L5-Pool',       label: 'Pool Deck',      x: 55, y: 20, w: 35, h: 18, floor: 5,   color: 'rgba(255,107,26,0.15)' },
  { id: 'L12-Rooftop',   label: 'Rooftop Bar',    x: 30, y: 5,  w: 40, h: 10, floor: 12,  color: 'rgba(255,215,0,0.1)' },
  { id: 'P2-Parking',    label: 'Parking P2',     x: 10, y: 88, w: 80, h: 10, floor: -2,  color: 'rgba(0,255,136,0.05)' },
  { id: 'L2-Restaurant', label: 'Restaurant',     x: 10, y: 57, w: 40, h: 15, floor: 2,   color: 'rgba(0,245,255,0.05)' },
  { id: 'B2-IT Room',    label: 'IT / Server',    x: 55, y: 88, w: 20, h: 10, floor: -2,  color: 'rgba(0,245,255,0.08)' },
];

export const EVAC_ROUTES = [
  { from: { x: 19, y: 74 }, to: { x: 19, y: 98 }, label: 'Route A', active: true },
  { from: { x: 50, y: 74 }, to: { x: 50, y: 98 }, label: 'Route B', active: true },
  { from: { x: 78, y: 60 }, to: { x: 95, y: 60 }, label: 'Route C (blocked)', active: false },
];
