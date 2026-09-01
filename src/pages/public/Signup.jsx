import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', usn: '', branch: '', password: '' });
  const { signup, status, error } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await signup(form);
    if (ok) navigate('/onboarding', { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card card auth-card-wide">
        <Link to="/" className="wordmark auth-wordmark">PlaceWise</Link>
        <h1>Create your student account</h1>
        <p className="auth-sub">Takes two minutes — we'll build your readiness score right after.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-grid">
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={update('name')} placeholder="Anagha Deshpande" required />
            </div>
            <div className="form-field">
              <label htmlFor="usn">USN</label>
              <input id="usn" value={form.usn} onChange={update('usn')} placeholder="1BM23CS042" required />
            </div>
            <div className="form-field">
              <label htmlFor="email">College email</label>
              <input id="email" type="email" value={form.email} onChange={update('email')} placeholder="you@bmsce.ac.in" required />
            </div>
            <div className="form-field">
              <label htmlFor="branch">Branch</label>
              <select id="branch" value={form.branch} onChange={update('branch')} required>
                <option value="" disabled>Select branch</option>
                <option>Computer Science & Engineering</option>
                <option>Information Science & Engineering</option>
                <option>Electronics & Communication</option>
                <option>Mechanical Engineering</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={update('password')} placeholder="At least 8 characters" required />
          </div>
          <button className="btn btn-primary auth-submit" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
