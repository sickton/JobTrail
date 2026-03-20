import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart2,
  LogOut,
  Zap,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { to: '/home', icon: LayoutDashboard, label: 'Home' },
  { to: '/applications', icon: Briefcase, label: 'Applications' },
  { to: '/resumes', icon: FileText, label: 'Resumes' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { username, firstName, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = firstName || username || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-zinc-950 border-r border-zinc-800 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">JobTrail</span>
            <p className="text-xs text-zinc-600 leading-none mt-0.5">Track your path</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider px-2 mb-2">Menu</p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-indigo-400' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 bg-indigo-600/30 border border-indigo-500/30 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-indigo-400">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{displayName}</p>
            <p className="text-xs text-zinc-600 truncate">@{username || 'user'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
