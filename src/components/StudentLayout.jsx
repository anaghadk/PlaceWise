import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Compass, TrendingUp, Users, User, LogOut, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import './StudentLayout.css';

const links = [
  { to: '/portal', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/portal/genie', label: 'Ask Genie', icon: Bot, badge: 'AI' },
  { to: '/portal/opportunities', label: 'Opportunities', icon: Compass },
  { to: '/portal/skill-gaps', label: 'Skill Gaps', icon: TrendingUp },
  { to: '/portal/senior-insights', label: 'Senior Insights', icon: Users },
  { to: '/portal/profile', label: 'Profile', icon: User },
];

export default function StudentLayout() {
  const { studentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isFullBleed = location.pathname.startsWith('/portal/genie');

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="student-shell">
      <aside className="student-sidebar">
        <Link to="/portal" className="wordmark">
          <span className="wordmark-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="var(--ink)" />
              <path d="M8 21L16 9L24 21" stroke="var(--bg)" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="16" cy="16" r="2" fill="var(--gold)" />
            </svg>
          </span>
          PlaceWise
        </Link>

        <nav className="student-nav">
          {links.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => 'student-nav-link' + (isActive ? ' active' : '')}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="student-sidebar-footer">
          <hr className="rule" />
          <div className="theme-switcher-slot">
            <ThemeSwitcher />
          </div>
          <div className="student-id-card">
            <div className="student-id-name">{studentUser?.name ?? 'Student'}</div>
            <div className="student-id-meta mono">{studentUser?.id ?? '—'}</div>
          </div>
          <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
            <LogOut size={15} strokeWidth={1.8} />
            Log out
          </button>
        </div>
      </aside>

      <div className={'student-main' + (isFullBleed ? ' student-main-flush' : '')}>
        <Outlet />
      </div>
    </div>
  );
}
