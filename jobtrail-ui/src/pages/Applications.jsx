import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { getApplications, createApplication, updateApplication, deleteApplication } from '../api/applications'
import ApplicationTable from '../components/applications/ApplicationTable'
import ApplicationForm from '../components/applications/ApplicationForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { StatusBadge } from '../components/ui/Badge'
import { getResumes } from '../api/resumes'

const ALL_STATUSES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN']

export default function Applications() {
  const qc = useQueryClient()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    retry: false,
  })

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  })

  const createMut = useMutation({
    mutationFn: createApplication,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['applications'] }); setFormOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateApplication(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['applications'] }); setEditTarget(null) },
  })

  const deleteMut = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['applications'] }); setDeleteTarget(null) },
  })

  const filtered = useMemo(() => {
    let list = applications
    if (statusFilter !== 'ALL') list = list.filter((a) => a.applicationStatus === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) => a.company?.toLowerCase().includes(q) || a.role?.toLowerCase().includes(q)
      )
    }
    return list
  }, [applications, statusFilter, search])

  const counts = useMemo(() => {
    const c = {}
    ALL_STATUSES.forEach((s) => { c[s] = applications.filter((a) => a.applicationStatus === s).length })
    return c
  }, [applications])

  const handleEdit = (app) => setEditTarget(app)
  const handleDelete = (app) => setDeleteTarget(app)

  const handleFormSubmit = (data) => {
    if (editTarget) {
      updateMut.mutate({ id: editTarget.applicationId, data })
    } else {
      createMut.mutate(data)
    }
  }

  const isFormLoading = createMut.isPending || updateMut.isPending

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {applications.length} total · {applications.filter((a) => ['APPLIED','SCREENING','INTERVIEW'].includes(a.applicationStatus)).length} active
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setFormOpen(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} /> Add Application
        </button>
      </motion.div>

      {/* Status filter pills */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            statusFilter === 'ALL'
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
              : 'text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          All ({applications.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s === statusFilter ? 'ALL' : s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              statusFilter === s
                ? 'bg-zinc-800 text-zinc-200 border-zinc-600'
                : 'text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <StatusBadge status={s} /> {counts[s]}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
          />
        </div>
        {(search || statusFilter !== 'ALL') && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('ALL') }}
            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal size={13} /> Clear filters
          </button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <span className="w-6 h-6 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}
        {isError && !isLoading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <p className="text-zinc-400 text-sm font-medium">Could not load applications</p>
            <p className="text-zinc-600 text-xs mt-1">Make sure the backend is running on port 8080</p>
          </div>
        )}
        {!isLoading && !isError && (
          <ApplicationTable applications={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </motion.div>

      {/* Create/Edit form modal */}
      <ApplicationForm
          open={formOpen || !!editTarget}
          onClose={() => { setFormOpen(false); setEditTarget(null) }}
          onSubmit={handleFormSubmit}
          defaultValues={editTarget}
          loading={isFormLoading}
          mode={editTarget ? 'edit' : 'create'}
          resumes={resumes}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMut.mutate(deleteTarget?.applicationId)}
        loading={deleteMut.isPending}
        title="Delete Application"
        description={`Are you sure you want to delete the application for ${deleteTarget?.role} at ${deleteTarget?.company}? This cannot be undone.`}
      />
    </div>
  )
}
