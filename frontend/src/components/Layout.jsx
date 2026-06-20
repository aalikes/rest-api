import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { lang, setLanguage, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('provn-dark') === '1');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('provn-dark', dark ? '1' : '0');
  }, [dark]);

  function isActive(path) {
    return location.pathname === path;
  }

  const publicNav = [
    { to: '/', label: t.nav.services },
    { to: '/apostille', label: 'Apostille Services' },
    { to: '/book-appointment', label: 'Book Appointment' },
    { to: '/faq', label: t.nav.faq },
  ];

  const staffMenuItems = [
    { to: '/dashboard', label: t.menu.dashboard },
    { to: '/pipeline', label: t.menu.apostilleServices },
    { to: '/book', label: t.menu.clientIntake },
    { to: '/ori-codes', label: t.menu.oriCodes },
    { to: '/book?service=fingerprint', label: t.menu.walkIn },
    { to: '/sop-training', label: 'SOP Training' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-teal-600 dark:text-teal-400">Provn</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Fingerprints &amp; Apostilles</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Phone */}
              <a href="tel:+13476355418" className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                (347) 635-5418
              </a>

              <nav className="hidden lg:flex items-center gap-1">
                {publicNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive(item.to)
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
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
                className="text-xs border border-gray-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="ht">HT</option>
                <option value="pt">PT</option>
              </select>

              {/* Dark mode toggle */}
              <button onClick={() => setDark(!dark)} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition" aria-label="Toggle dark mode">
                {dark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                )}
              </button>

              {/* Hamburger Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition"
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
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 py-2">
                    {/* Mobile nav links */}
                    <div className="lg:hidden border-b border-gray-100 dark:border-slate-700 pb-2 mb-2">
                      {publicNav.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700">
                          {user?.email}
                        </div>
                        {staffMenuItems.map((item) => (
                          <Link
                            key={item.to + item.label}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 ${
                              isActive(item.to) ? 'text-teal-700 dark:text-teal-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
                          <button
                            onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {t.menu.signOut}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/manage-appointment"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          Manage My Appointment
                        </Link>
                        <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
                          <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                          >
                            {t.menu.staffLogin}
                          </Link>
                        </div>
                      </>
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

      {/* Anchored Book Now */}
      {!isAuthenticated && location.pathname !== '/book' && location.pathname !== '/book-appointment' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => navigate('/book-appointment')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Book Now
          </button>
        </div>
      )}

      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Provn &mdash; {t.footer.address}</p>
          <p className="mt-1">{t.footer.tagline}</p>
          <p className="mt-1">
            <a href="tel:+13476355418" className="hover:text-teal-600">(347) 635-5418</a>
            {' · '}
            <a href="mailto:info@getproven.us" className="hover:text-teal-600">info@getproven.us</a>
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-4">
            <Link to="/manage-appointment" className="hover:text-teal-600">Manage Appointment</Link>
            <Link to="/privacy" className="hover:text-teal-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-teal-600">Terms of Service</Link>
            <Link to="/apostille" className="hover:text-teal-600">Apostille Services</Link>
            <Link to="/consulates" className="hover:text-teal-600">Consulate Directory</Link>
            <Link to="/apostille-process" className="hover:text-teal-600">Apostille Process Guide</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
