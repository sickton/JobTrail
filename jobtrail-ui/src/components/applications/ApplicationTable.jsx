import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Pencil, Trash2, ChevronUp, ChevronDown, Plus, Briefcase, TrendingUp, BarChart2 } from 'lucide-react'
import { StatusBadge, RoleBadge } from '../ui/Badge'

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const avatarStyle = (name) => {
  const styles = [
    'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    'bg-violet-500/15 text-violet-400 border border-violet-500/20',
    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    'bg-rose-500/15 text-rose-400 border border-rose-500/20',
    'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
  ]
  return styles[(name?.charCodeAt(0) ?? 0) % styles.length]
}


const SORT_FIELDS = ['company', 'role', 'applicationStatus', 'roleType', 'appliedAt']

export default function ApplicationTable({ applications, onEdit, onDelete, onAdd }) {
  const [sortField, setSortField] = useState('appliedAt')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...(applications ?? [])].sort((a, b) => {
    const av = a[sortField] ?? ''
    const bv = b[sortField] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={13} className="opacity-20" />
    return sortDir === 'asc' ? (
      <ChevronUp size={13} className="text-indigo-400" />
    ) : (
      <ChevronDown size={13} className="text-indigo-400" />
    )
  }

  const ColHeader = ({ field, label }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  )

  if (!applications?.length) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center justify-center py-24 text-center overflow-hidden"
        >

          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
              <Briefcase size={32} className="text-indigo-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Plus size={11} className="text-white" />
            </div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-bold text-white mb-2">Your job search starts here</h3>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed mb-8">
            Track every application, monitor your progress, and get insights on your job search — all in one place.
          </p>

          {/* CTA */}
          <button
              onClick={onAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/25 mb-12"
          >
            <Plus size={15} /> Add your first application
          </button>

          {/* 3-step guide */}
          <div className="relative flex items-center gap-0 max-w-lg w-full px-4">
            {[
              { icon: Plus,       label: 'Add application', sub: 'Manual or via job posting' },
              { icon: TrendingUp, label: 'Track status',    sub: 'Applied → Offer' },
              { icon: BarChart2,  label: 'View analytics',  sub: 'Insights on your search' },
            ].map(({ icon: Icon, step, label, sub }, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                  {/* Connector line */}
                  {i < 2 && (
                      <div className="absolute top-4 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px bg-zinc-800 z-0" />
                  )}
                  <div className="relative z-10 w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2.5">
                    <Icon size={14} className="text-zinc-500" />
                  </div>
                  <span className="text-xs font-bold text-zinc-300 block">{label}</span>
                  <span className="text-xs text-zinc-600 mt-0.5">{sub}</span>
                </div>
            ))}
          </div>
        </motion.div>
    )
  }

  return (
    <>
      {/* Mobile card list — visible on small screens only */}
      <div className="md:hidden space-y-2">
        {sorted.map((app, i) => (
          <motion.div
            key={app.applicationId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${avatarStyle(app.company)}`}>
                  {app.company?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-100 truncate">{app.company}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{app.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => onEdit(app)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(app)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <StatusBadge status={app.applicationStatus} />
              <RoleBadge roleType={app.roleType} />
              <span className="text-xs text-zinc-600 ml-auto">{formatDate(app.appliedAt)}</span>
              {app.link && (
                <a href={app.link} target="_blank" rel="noopener noreferrer"
                   className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 text-xs">
                  <ExternalLink size={12} /> Link
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop table — hidden on small screens */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full">
          <thead className="bg-zinc-900/60 border-b border-zinc-800">
            <tr>
              <ColHeader field="company" label="Company" />
              <ColHeader field="role" label="Role" />
              <ColHeader field="roleType" label="Type" />
              <ColHeader field="applicationStatus" label="Status" />
              <ColHeader field="appliedAt" label="Applied" />
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Link</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
          {sorted.map((app, i) => (
              <motion.tr
                  key={app.applicationId}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-zinc-800/30 transition-colors group"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${avatarStyle(app.company)}`}>
                      {app.company?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm font-medium text-zinc-100">{app.company}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-zinc-300">{app.role}</span>
                </td>
                <td className="px-4 py-3.5">
                  <RoleBadge roleType={app.roleType} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={app.applicationStatus} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-zinc-500">{formatDate(app.appliedAt)}</span>
                </td>
                <td className="px-4 py-3.5">
                  {app.link ? (
                      <a href={app.link} target="_blank" rel="noopener noreferrer"
                         className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 text-sm"
                      >
                        <ExternalLink size={13} /> View
                      </a>
                  ) : (
                      <span className="text-zinc-700 text-sm">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(app)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(app)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
