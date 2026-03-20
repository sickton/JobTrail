const STATUS_STYLES = {
  APPLIED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  SCREENING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  INTERVIEW: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  OFFERED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/15 text-red-400 border-red-500/30',
  WITHDRAWN: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
}

const ROLE_STYLES = {
  INTERNSHIP: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  FULLTIME: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  COOP: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  CONTRACT: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  TEMPORARY: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
}

const STATUS_LABELS = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFERED: 'Offered',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}

const ROLE_LABELS = {
  INTERNSHIP: 'Internship',
  FULLTIME: 'Full-time',
  COOP: 'Co-op',
  CONTRACT: 'Contract',
  TEMPORARY: 'Temporary',
}

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function RoleBadge({ roleType }) {
  const style = ROLE_STYLES[roleType] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      {ROLE_LABELS[roleType] ?? roleType}
    </span>
  )
}
