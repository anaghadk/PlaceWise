import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import PublicLayout from './components/PublicLayout';
import Home from './pages/public/Home';
import Explore from './pages/public/Explore';
import Insights from './pages/public/Insights';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';

import Onboarding from './pages/student/Onboarding';
import StudentLayout from './components/StudentLayout';
import Dashboard from './pages/student/Dashboard';
import GenieChat from './pages/student/GenieChat';
import Opportunities from './pages/student/Opportunities';
import SkillGaps from './pages/student/SkillGaps';
import SeniorInsights from './pages/student/SeniorInsights';
import Profile from './pages/student/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarded={false}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="genie" element={<GenieChat />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="skill-gaps" element={<SkillGaps />} />
          <Route path="senior-insights" element={<SeniorInsights />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <p className="eyebrow">404</p>
      <h1>This page doesn't exist.</h1>
      <a href="/">Back home</a>
    </div>
  );
}
