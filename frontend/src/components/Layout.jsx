import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const publicNav = [
  { to: '/', label: 'Services' },
  { to: '/quote', label: 'Get a Quote' },
];

const staffNav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/pipeline', label: 'Pipeline' },
];

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">MetroPrints</span>
              <span className="text-sm text-gray-500 hidden sm:block">Fingerprints &amp; Apostilles</span>
            </Link>

            <nav className="flex items-center gap-1">
              {publicNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive(item.to)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && staffNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive(item.to)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-gray-500">{user?.email}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
                >
                  Staff Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>MetroPrints &mdash; 2125 Biscayne Blvd Suite 303, Miami, FL 33137</p>
          <p className="mt-1">Fingerprints &bull; Apostilles &bull; FBI Background Checks</p>
        </div>
      </footer>
    </div>
  );
}
