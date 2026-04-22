export const SENSORS = [
  { id: 'SN-101', name: 'Lobby Smoke Detector',    zone: 'L1-Lobby',    type: 'smoke',       status: 'Normal',  value: '12ppm',   lastPing: '2s ago' },
  { id: 'SN-402', name: 'Kitchen Smoke Detector',  zone: 'B1-Kitchen',  type: 'smoke',       status: 'Alert',   value: '850ppm',  lastPing: '1s ago' },
  { id: 'CAM-211', name: 'Pool Deck Camera',        zone: 'L5-Pool',     type: 'camera',      status: 'Alert',   value: 'Anomaly', lastPing: '3s ago' },
  { id: 'ACC-105', name: 'East Wing Access',        zone: 'EW-Entrance', type: 'access',      status: 'Breach',  value: 'LOCKED',  lastPing: '0s ago' },
  { id: 'VIB-301', name: 'Rooftop Vibration',       zone: 'L12-Roof',    type: 'vibration',   status: 'Warning', value: '4.2g',    lastPing: '5s ago' },
  { id: 'WTR-089', name: 'Basement Water Level',    zone: 'P2-Parking',  type: 'water',       status: 'Normal',  value: '2cm',     lastPing: '4s ago' },
  { id: 'TEMP-55', name: 'Server Room Temp',        zone: 'B2-IT Room',  type: 'temperature', status: 'Normal',  value: '22°C',    lastPing: '6s ago' },
  { id: 'GAS-30',  name: 'Kitchen Gas Sensor',      zone: 'B1-Kitchen',  type: 'gas',         status: 'Warning', value: '18%LEL',  lastPing: '2s ago' },
  { id: 'MOT-77',  name: 'Corridor Motion (East)',  zone: 'EW-Corridor', type: 'motion',      status: 'Active',  value: 'Moving',  lastPing: '1s ago' },
  { id: 'PWR-01',  name: 'Main Power Grid',         zone: 'B2-Utility',  type: 'power',       status: 'Normal',  value: '230V',    lastPing: '7s ago' },
];

export const SENSOR_TYPE_ICONS = {
  smoke:       '💨',
  camera:      '📷',
  access:      '🔒',
  vibration:   '📳',
  water:       '💧',
  temperature: '🌡️',
  gas:         '⚗️',
  motion:      '👁️',
  power:       '⚡',
};
