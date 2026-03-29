import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, FileText, BarChart2, ArrowRight, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { getApplications } from '../api/applications'
import { StatusBadge } from '../components/ui/Badge'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatFullDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const STATUS_ORDER = { OFFERED: 0, INTERVIEW: 1, SCREENING: 2, APPLIED: 3, REJECTED: 4, WITHDRAWN: 5 }

export default function Home() {
  const navigate = useNavigate()
  const { firstName, username } = useAuthStore()
  const displayName = firstName || username || 'there'

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    retry: false,
  })

  const total = applications.length
  const activeCount = applications.filter((a) =>
    ['APPLIED', 'SCREENING', 'INTERVIEW'].includes(a.applicationStatus)
  ).length
  const offersCount = applications.filter((a) => a.applicationStatus === 'OFFERED').length

  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5)

  const QUICK_ACTIONS = [
    {
      label: 'Applications',
      description: 'View and manage all your job applications',
      icon: Briefcase,
      color: 'from-indigo-600/20 to-indigo-600/5 border-indigo-500/20',
      iconColor: 'text-indigo-400',
      to: '/applications',
    },
    {
      label: 'Resumes',
      description: 'Manage your resume versions',
      icon: FileText,
      color: 'from-violet-600/20 to-violet-600/5 border-violet-500/20',
      iconColor: 'text-violet-400',
      to: '/resumes',
    },
    {
      label: 'Analytics',
      description: 'View your personal job search insights',
      icon: BarChart2,
      color: 'from-cyan-600/20 to-cyan-600/5 border-cyan-500/20',
      iconColor: 'text-cyan-400',
      to: '/analytics',
    },
  ]

  const STATS = [
    { label: 'Total Applications', value: total, icon: Briefcase, color: 'text-indigo-400' },
    { label: 'Active', value: activeCount, icon: Clock, color: 'text-amber-400' },
    { label: 'Offers', value: offersCount, icon: CheckCircle, color: 'text-emerald-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest mb-1">{formatFullDate()}</p>
        <h1 className="text-3xl font-bold text-white">
          {getGreeting()},{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            {displayName}
          </span>{' '}
          👋
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">Here&apos;s a summary of your job search activity.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-zinc-800/80 flex items-center justify-center shrink-0">
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-1 space-y-3"
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Navigate</h2>
          {QUICK_ACTIONS.map(({ label, description, icon: Icon, color, iconColor, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`w-full bg-gradient-to-br ${color} border rounded-2xl p-4 text-left hover:scale-[1.02] active:scale-[0.99] transition-transform group`}
            >
              <div className="flex items-start justify-between">
                <Icon size={20} className={iconColor} />
                <ArrowRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-white mt-3">{label}</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{description}</p>
            </button>
          ))}
        </motion.div>

        {/* Recent activity (last 3 days) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Recent Activity
              <span className="ml-2 text-xs text-zinc-600 normal-case tracking-normal font-normal">5 most recent</span>
            </h2>
            <button
              onClick={() => navigate('/applications')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={11} />
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp size={28} className="text-zinc-700 mb-3" />
                <p className="text-zinc-400 text-sm font-medium">No applications yet</p>
                <p className="text-zinc-600 text-xs mt-1">Your most recent applications will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {recent.map((app) => (
                  <div key={app.applicationId} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-100 truncate">{app.company}</p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{app.role}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <StatusBadge status={app.applicationStatus} />
                      <span className="text-xs text-zinc-600">{formatDate(app.appliedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
