import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { lang, setLanguage, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(path) {
    return location.pathname === path;
  }

  const publicNav = [
    { to: '/', label: t.nav.services },
    { to: '/faq', label: t.nav.faq },
    { to: '/blog', label: t.nav.blog },
  ];

  const staffMenuItems = [
    { to: '/dashboard', label: t.menu.dashboard },
    { to: '/pipeline', label: t.menu.apostilleServices },
    { to: '/book', label: t.menu.clientIntake },
    { to: '/ori-codes', label: t.menu.oriCodes },
    { to: '/book?service=fingerprint', label: t.menu.walkIn },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">Provn</span>
              <span className="text-sm text-gray-500 hidden sm:block">Fingerprints &amp; Apostilles</span>
            </Link>

            <div className="flex items-center gap-2">
              <nav className="hidden sm:flex items-center gap-1">
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
              </nav>

              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="ht">HT</option>
                <option value="pt">PT</option>
              </select>

              {/* Hamburger Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                  aria-label="Menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {menuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                    {/* Mobile nav links */}
                    <div className="sm:hidden border-b border-gray-100 pb-2 mb-2">
                      {publicNav.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                          {user?.email}
                        </div>
                        {staffMenuItems.map((item) => (
                          <Link
                            key={item.to + item.label}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                              isActive(item.to) ? 'text-indigo-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            {t.menu.signOut}
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t.menu.staffLogin}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>Provn &mdash; {t.footer.address}</p>
          <p className="mt-1">{t.footer.tagline}</p>
        </div>
      </footer>
    </div>
  );
}
