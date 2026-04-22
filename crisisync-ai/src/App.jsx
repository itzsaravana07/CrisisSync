import { Routes, Route, Navigate } from 'react-router-dom';
import { CrisisProvider } from './context/CrisisContext';
import { Header }        from './components/layout/Header';
import { Login }         from './pages/Login';
import { Dashboard }     from './pages/Dashboard';
import { IncidentLog }   from './pages/IncidentLog';
import { DigitalTwin }   from './pages/DigitalTwin';
import { VoiceAssistant } from './pages/VoiceAssistant';
import { Reports }       from './pages/Reports';
import { useState }      from 'react';

function ProtectedLayout({ user, children }) {
  return (
    <CrisisProvider>
      <div className="flex flex-col h-screen overflow-hidden crt-overlay">
        <Header user={user} />
        <div className="flex flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </CrisisProvider>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <ProtectedLayout user={user}>
      <Routes>
        <Route path="/"             element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/incidents"    element={<IncidentLog />} />
        <Route path="/digital-twin" element={<DigitalTwin />} />
        <Route path="/voice"        element={<VoiceAssistant />} />
        <Route path="/reports"      element={<Reports />} />
        <Route path="*"             element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ProtectedLayout>
  );
}
