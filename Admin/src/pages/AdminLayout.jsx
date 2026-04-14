import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function AdminLayout() {
  const { logout, session } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container admin-app">
      <header className="topbar">
        <div>
          <h1>Admin Portal</h1>
          <p>Administrator: {session?.user?.name || session?.user?.email}</p>
        </div>
        <button className="button secondary" onClick={handleSignOut}>
          Log out
        </button>
      </header>
      <nav className="nav-panel">
        <NavLink to="products" className={({ isActive }) => (isActive ? 'active' : '')}>
          Products
        </NavLink>
        <NavLink to="users" className={({ isActive }) => (isActive ? 'active' : '')}>
          Users
        </NavLink>
        <NavLink to="providers" className={({ isActive }) => (isActive ? 'active' : '')}>
          Provider
        </NavLink>
        <NavLink to="pickups" className={({ isActive }) => (isActive ? 'active' : '')}>
          Pickups
        </NavLink>
        <NavLink to="orders" className={({ isActive }) => (isActive ? 'active' : '')}>
          Orders
        </NavLink>
      </nav>
      <section className="panel">
        <Outlet />
      </section>
    </div>
  );
}
