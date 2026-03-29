import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, Zap, Award, Briefcase, BarChart2, Rocket, Target, Lock } from 'lucide-react'
import { getApplications } from '../api/applications'

const FUNNEL_STAGES = [
  { key: 'APPLIED',   label: 'Applied',   hex: '#6366f1' },
  { key: 'SCREENING', label: 'Screening', hex: '#22d3ee' },
  { key: 'INTERVIEW', label: 'Interview', hex: '#a78bfa' },
  { key: 'OFFERED',   label: 'Offered',   hex: '#34d399' },
]

const ROLE_COLORS = ['#6366f1', '#22d3ee', '#a78bfa', '#f59e0b', '#f87171']

const ROLE_LABELS = {
  FULLTIME:   'Full-time',
  INTERNSHIP: 'Internship',
  COOP:       'Co-op',
  CONTRACT:   'Contract',
  TEMPORARY:  'Temporary',
}

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={17} className="text-white" />
        </div>
        <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-zinc-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold text-white">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    retry: false,
  })

  const metrics = useMemo(() => {
    const total = applications.length
    if (total === 0) return null

    // Active pipeline — apps still being considered
    const active = applications.filter((a) =>
      ['APPLIED', 'SCREENING', 'INTERVIEW'].includes(a.applicationStatus)
    ).length

    // Interview rate — % that reached interview or beyond
    const interviewed = applications.filter((a) =>
      ['INTERVIEW', 'OFFERED'].includes(a.applicationStatus)
    ).length
    const interviewRate = total ? Math.round((interviewed / total) * 100) : 0

    // Offers
    const offers = applications.filter((a) => a.applicationStatus === 'OFFERED').length

    // Pipeline funnel — current status counts (positive stages only)
    const funnelCounts = {}
    FUNNEL_STAGES.forEach(({ key }) => {
      funnelCounts[key] = applications.filter((a) => a.applicationStatus === key).length
    })
    const funnelTotal = Object.values(funnelCounts).reduce((s, v) => s + v, 0)

    // Weekly activity — group by ISO week number
    const weekCounts = {}
    applications.forEach((a) => {
      if (!a.appliedAt) return
      const d = new Date(a.appliedAt)
      const startOfYear = new Date(d.getFullYear(), 0, 1)
      const weekNum = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
      const key = `W${weekNum}`
      weekCounts[key] = (weekCounts[key] || 0) + 1
    })
    const weekData = Object.entries(weekCounts)
      .sort()
      .slice(-8)
      .map(([week, count]) => ({ week, count }))

    // Role type breakdown
    const roleMap = applications.reduce((acc, a) => {
      if (a.roleType) acc[a.roleType] = (acc[a.roleType] || 0) + 1
      return acc
    }, {})
    const roleData = Object.entries(roleMap)
      .map(([type, count]) => ({ name: ROLE_LABELS[type] ?? type, value: count }))
      .sort((a, b) => b.value - a.value)

    return { total, active, interviewRate, offers, funnelCounts, funnelTotal, weekData, roleData }
  }, [applications])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="w-6 h-6 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Personal insights based on your job search activity</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 bg-zinc-800/60 border border-zinc-700 rounded-2xl flex items-center justify-center mb-4">
            <BarChart2 size={28} className="text-zinc-600" />
          </div>
          <p className="text-zinc-300 font-semibold mb-1">No data yet</p>
          <p className="text-zinc-600 text-sm max-w-xs leading-relaxed">
            Start adding applications and your analytics will appear here automatically.
          </p>
        </motion.div>
      </div>
    )
  }

  const { total, active, interviewRate, offers, funnelCounts, funnelTotal, weekData, roleData } = metrics

  const interviewUnlocked = interviewRate > 0
  const offerUnlocked = offers > 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          Your job search at a glance — {total} application{total !== 1 ? 's' : ''} tracked
        </p>
      </motion.div>

      {/* Row 1 — Applications Sent + In Play */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Rocket} label="Applications Sent" color="bg-indigo-600"
          value={total}
          sub="total applications sent"
          delay={0.05}
        />
        <StatCard
          icon={Zap} label="In Play" color="bg-amber-600"
          value={active}
          sub="actively being considered"
          delay={0.1}
        />
      </div>

      {/* Row 2 — Role Type Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={16} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Role Type Breakdown</h3>
          <span className="text-xs text-zinc-600 ml-auto">{total} applications</span>
        </div>

        {roleData.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Animated progress bars */}
            <div className="space-y-3.5">
              {roleData.map(({ name, value }, i) => (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">{name}</span>
                    <span className="text-xs font-semibold text-zinc-300">{value}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / total) * 100}%` }}
                      transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: ROLE_COLORS[i % ROLE_COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Donut chart */}
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#71717a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-zinc-600 text-sm text-center py-4">No role type data yet</p>
        )}
      </motion.div>

      {/* Row 3 — Pipeline + Weekly Activity */}
      <div className="grid grid-cols-2 gap-4">

        {/* Pipeline Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <Target size={16} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Application Pipeline</h3>
          </div>

          <div className="space-y-4">
            {FUNNEL_STAGES.map(({ key, label, hex }, i) => {
              const count = funnelCounts[key] ?? 0
              const pct = funnelTotal > 0 ? (count / funnelTotal) * 100 : 0
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600">{Math.round(pct)}%</span>
                      <span className="text-sm font-bold text-zinc-200 w-5 text-right">{count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: hex }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-600">
            <span>{funnelTotal} in active pipeline</span>
            {funnelCounts['OFFERED'] > 0 && (
              <span className="text-emerald-500 font-semibold">
                🎉 {funnelCounts['OFFERED']} offer{funnelCounts['OFFERED'] > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Weekly Activity</h3>
            <span className="text-xs text-zinc-600 ml-auto">Last 8 weeks</span>
          </div>
          {weekData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekData} barSize={20}>
                <XAxis dataKey="week" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                <Bar dataKey="count" name="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-zinc-700 text-sm">
              No weekly data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Row 4 — Milestones (Interview Rate + Offers) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award size={15} className="text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-400">Milestones</h3>
          <span className="text-xs text-zinc-600 ml-auto">Unlocked as your search progresses</span>
        </div>

        <div className="grid grid-cols-2 gap-4">

          {/* Interview Rate milestone */}
          <div className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors ${
            interviewUnlocked
              ? 'bg-violet-500/8 border-violet-500/20'
              : 'bg-zinc-800/30 border-zinc-800'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              interviewUnlocked ? 'bg-violet-600' : 'bg-zinc-800'
            }`}>
              {interviewUnlocked
                ? <TrendingUp size={16} className="text-white" />
                : <Lock size={14} className="text-zinc-600" />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-lg font-bold ${interviewUnlocked ? 'text-white' : 'text-zinc-600'}`}>
                  {interviewUnlocked ? `${interviewRate}%` : '—'}
                </p>
                {interviewUnlocked && (
                  <span className="text-xs px-1.5 py-0.5 bg-violet-500/15 text-violet-400 border border-violet-500/20 rounded-md font-medium">
                    Unlocked
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${interviewUnlocked ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Interview Rate
              </p>
              {!interviewUnlocked && (
                <p className="text-xs text-zinc-700 mt-0.5">Unlocks when you reach interview stage</p>
              )}
            </div>
          </div>

          {/* Offers milestone */}
          <div className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors ${
            offerUnlocked
              ? 'bg-emerald-500/8 border-emerald-500/20'
              : 'bg-zinc-800/30 border-zinc-800'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              offerUnlocked ? 'bg-emerald-600' : 'bg-zinc-800'
            }`}>
              {offerUnlocked
                ? <Award size={16} className="text-white" />
                : <Lock size={14} className="text-zinc-600" />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-lg font-bold ${offerUnlocked ? 'text-white' : 'text-zinc-600'}`}>
                  {offerUnlocked ? offers : '—'}
                </p>
                {offerUnlocked && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-md font-medium">
                    🎉 Unlocked
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${offerUnlocked ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Offer{offers !== 1 ? 's' : ''} Received
              </p>
              {!offerUnlocked && (
                <p className="text-xs text-zinc-700 mt-0.5">Unlocks when you receive your first offer</p>
              )}
            </div>
          </div>

        </div>
      </motion.div>

    </div>
  )
}
