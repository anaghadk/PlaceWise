import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, status, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      const dest = location.state?.from?.pathname ?? '/portal';
      navigate(dest, { replace: true });
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="wordmark auth-wordmark">PlaceWise</Link>
        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to see your readiness score and today's next step.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">College email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@bmsce.ac.in" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary auth-submit" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">New here? <Link to="/signup">Create a student account</Link></p>
      </div>
    </div>
  );
}
