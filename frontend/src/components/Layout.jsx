import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on Escape key
  useEffect(() => {
    if (!sidebarOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar — always visible md and up */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar with hamburger */}
        <div className="md:hidden flex items-center gap-3 bg-green-950 border-b border-green-900 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
            className="text-green-300 hover:text-white transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded"
          >
            <Menu size={22} />
          </button>
          <span className="text-white font-semibold text-sm">Jones County XC</span>
        </div>

        <main className="flex-1 flex flex-col items-center">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
