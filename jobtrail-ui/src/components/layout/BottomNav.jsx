import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Briefcase, FileText, BarChart2 } from 'lucide-react'

const NAV = [
  { to: '/home',         icon: LayoutDashboard, label: 'Home' },
  { to: '/applications', icon: Briefcase,        label: 'Apps' },
  { to: '/resumes',      icon: FileText,         label: 'Resumes' },
  { to: '/analytics',    icon: BarChart2,        label: 'Analytics' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-zinc-800 flex md:hidden safe-area-inset-bottom">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-indigo-400' : 'text-zinc-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-zinc-600'} />
              <span className={isActive ? 'text-indigo-400' : 'text-zinc-600'}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
