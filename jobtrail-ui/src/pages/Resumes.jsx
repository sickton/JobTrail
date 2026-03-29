import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Upload, Star, Trash2, X, Download } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getResumes, addResume, deleteResume } from '../api/resumes'

export default function Resumes() {
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [versionName, setVersionName] = useState('')
    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null)
    const [selectedResume, setSelectedResume] = useState(null)

    const getResumePreview = (fileUrl) => {
        if (!fileUrl) return null
        return fileUrl.replace('/upload/', '/upload/w_900,h_1273,c_fill,pg_1,f_jpg/')
    }

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

    const mostUsedId = resumes.length > 0 ? resumes[resumes.length - 1].resumeId : null

    const getResumeThumbnail = (fileUrl) => {
        if (!fileUrl) return null
        return fileUrl.replace('/upload/', '/upload/w_600,h_848,c_fill,pg_1,f_jpg/')
    }

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

            {/* Resume Cards Grid */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {resumes.map((resume, i) => (
                            <motion.div
                                key={resume.resumeId}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * i }}
                                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-colors"
                            >
                                {/* Document preview */}
                                <div
                                    className="relative w-full bg-zinc-800 cursor-pointer overflow-hidden"
                                    style={{ aspectRatio: '1 / 1.414' }}
                                    onClick={() => setSelectedResume(resume)}
                                >
                                    {resume.fileUrl ? (
                                        <img
                                            src={getResumeThumbnail(resume.fileUrl)}
                                            alt={resume.versionName}
                                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText size={36} className="text-zinc-600" />
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); window.open(resume.fileUrl, '_blank') }}
                                            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-colors"
                                            title="Open"
                                        >
                                            <Download size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteMut.mutate(resume.resumeId) }}
                                            disabled={deleteMut.isPending}
                                            className="p-2.5 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm rounded-xl text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Card footer */}
                                <div className="p-3">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <p className="text-sm font-semibold text-zinc-100 truncate">{resume.versionName}</p>
                                        {resume.resumeId === mostUsedId && resumes.length > 1 && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-md text-xs font-medium shrink-0">
                                                <Star size={9} /> Latest
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-600 mt-0.5">
                                        {new Date(resume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add new card */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * resumes.length }}
                            onClick={() => setShowModal(true)}
                            className="border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group"
                            style={{ aspectRatio: '1 / 1.414' }}
                        >
                            <div className="w-10 h-10 bg-zinc-800/60 group-hover:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-2 transition-colors">
                                <Plus size={18} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <p className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">Add Resume</p>
                        </motion.div>
                    </div>
                )}
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
            {/* Resume Preview Modal */}
            {selectedResume && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setSelectedResume(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative flex flex-col items-center gap-4 max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Toolbar */}
                        <div className="flex items-center justify-between w-full px-1">
                            <div>
                                <p className="text-white font-semibold text-sm">{selectedResume.versionName}</p>
                                <p className="text-zinc-500 text-xs">
                                    {new Date(selectedResume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(selectedResume.fileUrl, '_blank')}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                                >
                                    <Download size={13} /> Download
                                </button>
                                <button
                                    onClick={() => {
                                        deleteMut.mutate(selectedResume.resumeId)
                                        setSelectedResume(null)
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold rounded-lg transition-colors"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                                <button
                                    onClick={() => setSelectedResume(null)}
                                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Preview image */}
                        <div className="overflow-auto rounded-xl shadow-2xl" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                            {selectedResume.fileUrl ? (
                                <img
                                    src={getResumePreview(selectedResume.fileUrl)}
                                    alt={selectedResume.versionName}
                                    className="w-auto rounded-xl"
                                    style={{ maxHeight: 'calc(100vh - 120px)' }}
                                />
                            ) : (
                                <div className="w-64 h-96 bg-zinc-800 rounded-xl flex items-center justify-center">
                                    <FileText size={40} className="text-zinc-600" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
