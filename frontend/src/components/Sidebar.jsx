import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/',        label: 'Home',     end: true },
  { to: '/athletes', label: 'Athletes' },
  { to: '/meets',    label: 'Meets' },
  { to: '/results',  label: 'Results' },
]

function Sidebar({ onClose }) {
  const activeClass = 'bg-yellow-400 text-blue-900 font-semibold'
  const inactiveClass = 'text-blue-200 hover:bg-blue-800'

  return (
    <div className="flex flex-col h-full w-56 bg-blue-950 border-r border-blue-800">
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
            <span className="text-blue-800 text-xs font-bold">JC</span>
          </div>
          <span className="text-white font-semibold text-sm leading-tight">
            Jones County<br />
            <span className="text-yellow-400 font-normal">Cross Country</span>
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-1 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1 px-2 py-4">
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition-colors ${isActive ? activeClass : inactiveClass}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
