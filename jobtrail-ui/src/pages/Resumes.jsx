import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Upload, Star, Clock, Trash2, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getResumes, addResume, deleteResume } from '../api/resumes'

export default function Resumes() {
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [versionName, setVersionName] = useState('')
    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null)

    const { data: resumes = [], isLoading } = useQuery({
        queryKey: ['resumes'],
        queryFn: getResumes,
    })

    const addMut = useMutation({
        mutationFn: (formData) => addResume(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] })
            setShowModal(false)
            setVersionName('')
            setFile(null)
        },
    })

    const deleteMut = useMutation({
        mutationFn: deleteResume,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
    })

    const handleAdd = () => {
        if (!versionName.trim() || !file) return
        const formData = new FormData()
        formData.append('versionName', versionName.trim())
        formData.append('file', file)
        addMut.mutate(formData)
    }

    const mostUsedId = resumes.length > 0 ? resumes[0].resumeId : null

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Resumes</h1>
                    <p className="text-zinc-500 text-sm mt-0.5">Manage your resume versions and track which performs best</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    <Plus size={16} /> Add Resume
                </button>
            </motion.div>

            {/* Resume list */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-3"
            >
                {isLoading ? (
                    <p className="text-zinc-500 text-sm">Loading...</p>
                ) : resumes.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                        <FileText size={28} className="text-zinc-700 mb-3" />
                        <p className="text-zinc-400 text-sm font-medium">No resumes yet</p>
                        <p className="text-zinc-600 text-xs mt-1">Upload your first resume to get started</p>
                    </div>
                ) : (
                    resumes.map((resume, i) => (
                        <motion.div
                            key={resume.resumeId}
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
                                        <p className="text-sm font-semibold text-zinc-100">{resume.versionName}</p>
                                        {resume.resumeId === mostUsedId && resumes.length > 1 && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-md text-xs font-medium">
                        <Star size={10} /> Latest
                      </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-600 flex items-center gap-1">
                      <Clock size={11} /> {new Date(resume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                                        {resume.fileUrl && (
                                            <span className="text-xs text-zinc-600 flex items-center gap-1">
                        <Upload size={11} /> {resume.fileUrl}
                      </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => deleteMut.mutate(resume.resumeId)}
                                    disabled={deleteMut.isPending}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Upload dashed area */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                onClick={() => setShowModal(true)}
                className="border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
            >
                <div className="w-12 h-12 bg-zinc-800/60 rounded-2xl flex items-center justify-center mb-3">
                    <Upload size={20} className="text-zinc-600" />
                </div>
                <p className="text-sm font-medium text-zinc-500">Upload a new resume version</p>
                <p className="text-xs text-zinc-700 mt-1">PDF files only</p>
            </motion.div>

            {/* Add Resume Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-white">Upload Resume</h2>
                            <button onClick={() => { setShowModal(false); setVersionName(''); setFile(null) }} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Version Name *</label>
                                <input
                                    value={versionName}
                                    onChange={(e) => setVersionName(e.target.value)}
                                    placeholder="e.g. Resume v1 — Backend Focus"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5">PDF File *</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border border-dashed border-zinc-700 hover:border-indigo-500/50 rounded-lg px-4 py-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
                                >
                                    <Upload size={20} className="text-zinc-600 mb-2" />
                                    {file ? (
                                        <p className="text-sm text-indigo-400 font-medium">{file.name}</p>
                                    ) : (
                                        <p className="text-sm text-zinc-500">Click to select a PDF</p>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                />
                            </div>

                            {addMut.isError && (
                                <p className="text-red-400 text-xs">Failed to upload resume. Please try again.</p>
                            )}

                            <div className="flex gap-3 justify-end pt-1">
                                <button
                                    onClick={() => { setShowModal(false); setVersionName(''); setFile(null) }}
                                    className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!versionName.trim() || !file || addMut.isPending}
                                    className="px-5 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 rounded-lg transition-colors font-medium"
                                >
                                    {addMut.isPending ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
