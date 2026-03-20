import { motion } from 'framer-motion'
import { FileText, Plus, Upload, Star, Clock, Construction } from 'lucide-react'

const MOCK_RESUMES = [
  { id: 1, name: 'Resume v1 — General SWE', uses: 12, lastUsed: '3 days ago', isDefault: true },
  { id: 2, name: 'Resume v2 — Backend Focus', uses: 7, lastUsed: '1 week ago', isDefault: false },
  { id: 3, name: 'Resume v3 — Internship', uses: 4, lastUsed: '2 weeks ago', isDefault: false },
]

export default function Resumes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resumes</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your resume versions and track which performs best</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-zinc-500 text-sm font-semibold rounded-xl cursor-not-allowed"
          title="Coming soon"
        >
          <Plus size={16} /> Add Resume
        </button>
      </motion.div>

      {/* Coming soon banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-amber-950/30 border border-amber-800/40 rounded-2xl px-5 py-4 flex items-center gap-3"
      >
        <Construction size={18} className="text-amber-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-300">Backend endpoint in development</p>
          <p className="text-xs text-amber-600 mt-0.5">Resume upload & management (UC6/UC7) is coming next. UI is ready.</p>
        </div>
      </motion.div>

      {/* Preview cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-3"
      >
        {MOCK_RESUMES.map((resume, i) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={18} className="text-zinc-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-zinc-100">{resume.name}</p>
                  {resume.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-md text-xs font-medium">
                      <Star size={10} /> Most used
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-zinc-600 flex items-center gap-1">
                    <Upload size={11} /> {resume.uses} applications
                  </span>
                  <span className="text-xs text-zinc-600 flex items-center gap-1">
                    <Clock size={11} /> {resume.lastUsed}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                disabled
                className="px-3 py-1.5 text-xs text-zinc-500 bg-zinc-800 rounded-lg cursor-not-allowed"
              >
                View
              </button>
              <button
                disabled
                className="px-3 py-1.5 text-xs text-red-500/50 bg-zinc-800 rounded-lg cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add new placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-not-allowed"
      >
        <div className="w-12 h-12 bg-zinc-800/60 rounded-2xl flex items-center justify-center mb-3">
          <Upload size={20} className="text-zinc-600" />
        </div>
        <p className="text-sm font-medium text-zinc-500">Upload a new resume version</p>
        <p className="text-xs text-zinc-700 mt-1">PDF or link — coming with UC6</p>
      </motion.div>
    </div>
  )
}
