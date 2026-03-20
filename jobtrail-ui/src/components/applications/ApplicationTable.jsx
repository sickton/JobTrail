import { useState } from 'react'
import { ExternalLink, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { StatusBadge, RoleBadge } from '../ui/Badge'

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const SORT_FIELDS = ['company', 'role', 'applicationStatus', 'roleType', 'appliedAt']

export default function ApplicationTable({ applications, onEdit, onDelete }) {
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-zinc-300 font-medium mb-1">No applications yet</p>
        <p className="text-zinc-600 text-sm">Add your first application to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
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
          {sorted.map((app) => (
            <tr key={app.applicationId} className="hover:bg-zinc-800/30 transition-colors group">
              <td className="px-4 py-3.5">
                <span className="text-sm font-medium text-zinc-100">{app.company}</span>
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
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 text-sm"
                  >
                    <ExternalLink size={13} />
                    View
                  </a>
                ) : (
                  <span className="text-zinc-700 text-sm">—</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(app)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(app)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
