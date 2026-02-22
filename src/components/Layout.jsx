import { Link, NavLink } from 'react-router-dom'

const navItems = [
  ['/', 'Dashboard'],
  ['/tracker', 'Tracker'],
  ['/quiz', 'Quiz'],
  ['/pdf', 'PDF Import']
]

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            NEET 2026 Ultimate Tracker
          </Link>
          <nav className="flex gap-2">
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
