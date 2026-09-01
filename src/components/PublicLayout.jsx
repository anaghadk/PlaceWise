import { NavLink, Outlet, Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import './PublicLayout.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore Opportunities' },
  { to: '/insights', label: 'Senior Insights' },
  { to: '/about', label: 'About' },
];

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <header className="public-nav">
        <div className="container public-nav-inner">
          <Link to="/" className="wordmark">
            <span className="wordmark-mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="var(--ink)" />
                <path d="M8 21L16 9L24 21" stroke="var(--bg)" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx="16" cy="16" r="2" fill="var(--gold)" />
              </svg>
            </span>
            PlaceWise
          </Link>
          <nav className="public-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="public-nav-cta">
            <span className="public-nav-theme"><ThemeSwitcher align="end" placement="down" /></span>
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/signup" className="btn btn-primary">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="container public-footer-inner">
          <div>
            <div className="wordmark small">PlaceWise</div>
            <p>Personalized placement intelligence, built from your campus's own data.</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Product</h4>
              <Link to="/explore">Explore Opportunities</Link>
              <Link to="/insights">Senior Insights</Link>
              <Link to="/login">Student Login</Link>
            </div>
            <div>
              <h4>Project</h4>
              <a href="#about">About CampusIQ</a>
              <a href="#team">Team</a>
            </div>
          </div>
        </div>
        <div className="container">
          <hr className="rule" />
          <p className="eyebrow footer-meta">CampusIQ · a student placement intelligence project</p>
        </div>
      </footer>
    </div>
  );
}
