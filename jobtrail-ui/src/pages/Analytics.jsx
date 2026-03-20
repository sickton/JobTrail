import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, Clock, Target, Zap, AlertCircle, Award } from 'lucide-react'
import { getApplications } from '../api/applications'

const PIE_COLORS = ['#6366f1', '#22d3ee', '#a78bfa', '#34d399', '#f59e0b', '#f87171']
const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000

function StatCard({ icon: Icon, label, value, sub, color, delay = 0, chart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={17} className="text-white" />
        </div>
        <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      </div>
      {chart && <div className="mt-1">{chart}</div>}
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

    // a) App to Interview rate
    const withInterview = applications.filter((a) => a.interviewAt || a.applicationStatus === 'INTERVIEW' || a.applicationStatus === 'OFFERED').length
    const appToInterviewRate = total ? Math.round((withInterview / total) * 100) : 0

    // b) Interview to Offer rate
    const withOffer = applications.filter((a) => a.applicationStatus === 'OFFERED').length
    const interviewToOfferRate = withInterview ? Math.round((withOffer / withInterview) * 100) : 0

    // c) Average response time (applied → first status update beyond APPLIED)
    const responseTimes = applications
      .filter((a) => a.appliedAt && a.updatedAt && a.applicationStatus !== 'APPLIED')
      .map((a) => (new Date(a.updatedAt) - new Date(a.appliedAt)) / (1000 * 60 * 60 * 24))
    const avgResponseDays = responseTimes.length
      ? Math.round(responseTimes.reduce((s, v) => s + v, 0) / responseTimes.length)
      : null

    // d) Average application rate — group by ISO week
    const weekCounts = {}
    applications.forEach((a) => {
      if (!a.appliedAt) return
      const d = new Date(a.appliedAt)
      const year = d.getFullYear()
      const startOfYear = new Date(year, 0, 1)
      const weekNum = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
      const key = `W${weekNum}`
      weekCounts[key] = (weekCounts[key] || 0) + 1
    })
    const weekData = Object.entries(weekCounts)
      .sort()
      .slice(-8)
      .map(([week, count]) => ({ week, count }))
    const avgPerWeek = weekData.length
      ? (weekData.reduce((s, w) => s + w.count, 0) / weekData.length).toFixed(1)
      : 0

    // e) Success by platform — not tracked yet (no source field), use status breakdown
    const statusData = ['APPLIED','SCREENING','INTERVIEW','OFFERED','REJECTED','WITHDRAWN']
      .map((s) => ({ name: s.charAt(0) + s.slice(1).toLowerCase(), value: applications.filter((a) => a.applicationStatus === s).length }))
      .filter((d) => d.value > 0)

    // f) Follow-up requests — no response in 3 weeks (APPLIED status, applied >3 weeks ago)
    const followUp = applications.filter((a) =>
      a.applicationStatus === 'APPLIED' &&
      a.appliedAt &&
      Date.now() - new Date(a.appliedAt).getTime() > THREE_WEEKS_MS
    )

    return { appToInterviewRate, interviewToOfferRate, avgResponseDays, weekData, avgPerWeek, statusData, followUp }
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
            <BarChart className="text-zinc-600" size={28} />
          </div>
          <p className="text-zinc-300 font-semibold mb-1">No data yet</p>
          <p className="text-zinc-600 text-sm max-w-xs">
            Start adding applications and your 6 personal analytics metrics will appear here automatically.
          </p>
        </motion.div>
      </div>
    )
  }

  const { appToInterviewRate, interviewToOfferRate, avgResponseDays, weekData, avgPerWeek, statusData, followUp } = metrics

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          Personal insights based on {applications.length} application{applications.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Top row — 4 metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp} label="App → Interview" color="bg-indigo-600"
          value={`${appToInterviewRate}%`}
          sub="of applications reached interview stage"
          delay={0.05}
        />
        <StatCard
          icon={Award} label="Interview → Offer" color="bg-emerald-600"
          value={`${interviewToOfferRate}%`}
          sub="of interviews converted to offer"
          delay={0.1}
        />
        <StatCard
          icon={Clock} label="Avg Response Time" color="bg-amber-600"
          value={avgResponseDays !== null ? `${avgResponseDays}d` : 'N/A'}
          sub="days from apply to first update"
          delay={0.15}
        />
        <StatCard
          icon={Zap} label="Avg Weekly Rate" color="bg-violet-600"
          value={avgPerWeek}
          sub="applications per week (avg)"
          delay={0.2}
        />
      </div>

      {/* Bottom row — charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weekly application rate bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Application Rate</h3>
            <span className="text-xs text-zinc-600 ml-auto">Last 8 weeks</span>
          </div>
          {weekData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekData} barSize={20}>
                <XAxis dataKey="week" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                <Bar dataKey="count" name="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-zinc-700 text-sm">No weekly data yet</div>
          )}
        </motion.div>

        {/* Status distribution pie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-violet-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
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
        </motion.div>
      </div>

      {/* Follow-up requests */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Follow-up Requests</h3>
          <span className="text-xs text-zinc-600 ml-auto">No response in 3+ weeks</span>
          {followUp.length > 0 && (
            <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-md text-xs font-semibold">
              {followUp.length}
            </span>
          )}
        </div>
        {followUp.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-4">
            No follow-up needed — you're all caught up.
          </p>
        ) : (
          <div className="space-y-2">
            {followUp.map((app) => {
              const daysAgo = Math.floor((Date.now() - new Date(app.appliedAt)) / (1000 * 60 * 60 * 24))
              return (
                <div key={app.applicationId} className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{app.company}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{app.role}</p>
                  </div>
                  <span className="text-xs text-amber-500 font-medium">{daysAgo}d ago</span>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
