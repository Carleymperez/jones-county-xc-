import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/',         label: 'Home',     end: true },
  { to: '/athletes', label: 'Athletes' },
  { to: '/meets',    label: 'Meets' },
  { to: '/results',  label: 'Results' },
]

function Sidebar({ onClose }) {
  const activeClass = 'bg-green-600 text-white font-semibold'
  const inactiveClass = 'text-green-300 hover:bg-green-800 hover:text-white'
  const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-1 focus-visible:ring-offset-green-950'

  return (
    <aside aria-label="Main navigation" className="flex flex-col h-full w-56 bg-green-950 border-r border-green-900">
      <div className="flex items-center justify-between px-4 py-4 border-b border-green-900">
        <div className="flex items-center gap-2">
          {/* Decorative logo badge — hidden from screen readers */}
          <div aria-hidden="true" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">JC</span>
          </div>
          <span className="text-white font-semibold text-sm leading-tight">
            Jones County<br />
            <span className="text-green-400 font-normal">Cross Country</span>
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className={`text-green-400 hover:text-white p-1 rounded transition-colors ${focusClass}`}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav aria-label="Site navigation" className="flex flex-col gap-1 px-2 py-4 flex-1">
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition-colors ${focusClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin link — bottom of sidebar */}
      <div className="px-2 py-3 border-t border-green-900">
        <NavLink
          to="/admin"
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-xs transition-colors ${focusClass} ${isActive ? activeClass : 'text-green-600 hover:bg-green-800 hover:text-white'}`
          }
        >
          Admin
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
