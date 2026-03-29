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

  const activeCount = applications.filter((a) =>
      ['APPLIED', 'SCREENING', 'INTERVIEW'].includes(a.applicationStatus)
  ).length
  const offerCount = counts['OFFERED'] ?? 0

  return (
      <div className="space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Applications</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{applications.length} total · {activeCount} active</p>
          </div>
          <button
              onClick={() => { setEditTarget(null); setFormOpen(true) }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Application</span>
          </button>
        </motion.div>

        {/* Stats strip */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          {[
            { label: 'Total',  value: applications.length, color: 'text-white' },
            { label: 'Active', value: activeCount,          color: 'text-indigo-400' },
            { label: 'Offers', value: offerCount,           color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
          ))}
        </motion.div>

        {/* Unified toolbar — search + filters in one row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1 overflow-x-auto scrollbar-none"
        >
          {/* Search */}
          <div className="relative shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none w-36 focus:w-48 transition-all"
            />
          </div>

          <div className="w-px h-4 bg-zinc-800 shrink-0" />

          {/* All */}
          <button
              onClick={() => setStatusFilter('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  statusFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            All <span className={statusFilter === 'ALL' ? 'text-zinc-300' : 'text-zinc-600'}>{applications.length}</span>
          </button>

          <div className="w-px h-4 bg-zinc-800 shrink-0" />

          {/* Status filters */}
          {ALL_STATUSES.map((s) => {
            const dot = { APPLIED:'bg-blue-400', SCREENING:'bg-amber-400', INTERVIEW:'bg-violet-400', OFFERED:'bg-emerald-400', REJECTED:'bg-red-400', WITHDRAWN:'bg-zinc-400' }[s]
            return (
                <button
                    key={s}
                    onClick={() => setStatusFilter(s === statusFilter ? 'ALL' : s)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                        statusFilter === s ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                  <span className={statusFilter === s ? 'text-zinc-300' : 'text-zinc-600'}>{counts[s]}</span>
                </button>
            )
          })}

          {/* Clear — only visible when filters active */}
          {(search || statusFilter !== 'ALL') && (
              <>
                <div className="w-px h-4 bg-zinc-800 shrink-0 ml-auto" />
                <button
                    onClick={() => { setSearch(''); setStatusFilter('ALL') }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal size={12} /> Clear
                </button>
              </>
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
              <ApplicationTable applications={filtered} onEdit={handleEdit} onDelete={handleDelete} onAdd={() => { setEditTarget(null); setFormOpen(true) }} />
          )}
        </motion.div>

        <ApplicationForm
            open={formOpen || !!editTarget}
            onClose={() => { setFormOpen(false); setEditTarget(null) }}
            onSubmit={handleFormSubmit}
            defaultValues={editTarget}
            loading={isFormLoading}
            mode={editTarget ? 'edit' : 'create'}
            resumes={resumes}
        />

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
