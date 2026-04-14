import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, session, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      navigate('/admin/products', { replace: true });
    }
  }, [navigate, session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin/products', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <main className="container login-screen">
      <section className="login-box">
        <h1>Admin Portal Login</h1>
        <p>Sign in to manage products, users, centers, pickups, and order tracking.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          {error && <p className="error-message">{error}</p>} <br />
          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}
