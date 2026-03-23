import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Modal from '../ui/Modal'
import { parseApplication } from '../../api/applications'

const schema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  roleType: z.string().min(1, 'Role type is required'),
  applicationStatus: z.string().min(1, 'Status is required'),
  link: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  description: z.string().optional(),
})

const ROLE_TYPES = [
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FULLTIME', label: 'Full-time' },
  { value: 'COOP', label: 'Co-op' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' },
]

const STATUSES = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SCREENING', label: 'Screening' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFERED', label: 'Offered' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
]

const inputClass =
    'w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors'

const labelClass = 'block text-xs font-medium text-zinc-400 mb-1.5'
const errorClass = 'text-red-400 text-xs mt-1'

export default function ApplicationForm({ open, onClose, onSubmit, defaultValues, loading, mode }) {
  const [pasteMode, setPasteMode] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      company: '',
      role: '',
      roleType: 'FULLTIME',
      applicationStatus: 'APPLIED',
      link: '',
      description: '',
    },
  })

  const parseMut = useMutation({
    mutationFn: parseApplication,
    onSuccess: (data) => {
      setValue('company', data.company ?? '')
      setValue('role', data.role ?? '')
      setValue('roleType', data.roleType ?? 'FULLTIME')
      setValue('link', data.link ?? '')
      setValue('description', data.description ?? '')
      setPasteMode(false)
      setPasteText('')
    },
  })

  useEffect(() => {
    if (open) {
      setPasteMode(false)
      setPasteText('')
      reset(
          defaultValues
              ? { ...defaultValues, link: defaultValues.link ?? '', description: defaultValues.description ?? '' }
              : { company: '', role: '', roleType: 'FULLTIME', applicationStatus: 'APPLIED', link: '', description: '' }
      )
    }
  }, [open, defaultValues, reset])

  const handleFormSubmit = (data) => {
    const payload = { ...data }
    if (!payload.link) delete payload.link
    if (!payload.description) delete payload.description
    onSubmit(payload)
  }

  return (
      <Modal
          open={open}
          onClose={onClose}
          title={mode === 'edit' ? 'Edit Application' : 'Add Application'}
          width="max-w-xl"
      >
        {mode !== 'edit' && (
            <div className="flex gap-2 mb-4">
              <button
                  type="button"
                  onClick={() => setPasteMode(false)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      !pasteMode
                          ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                          : 'text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-800'
                  }`}
              >
                Manual Entry
              </button>
              <button
                  type="button"
                  onClick={() => setPasteMode(true)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      pasteMode
                          ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                          : 'text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-800'
                  }`}
              >
                Paste Job Posting
              </button>
            </div>
        )}

        {pasteMode ? (
            <div className="space-y-4">
          <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={10}
              className={`${inputClass} resize-none`}
          />
              {parseMut.isError && (
                  <p className={errorClass}>Failed to parse. Try again.</p>
              )}
              <div className="flex gap-3 justify-end pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                    type="button"
                    disabled={!pasteText.trim() || parseMut.isPending}
                    onClick={() => parseMut.mutate(pasteText)}
                    className="px-5 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 rounded-lg transition-colors font-medium"
                >
                  {parseMut.isPending ? 'Parsing...' : 'Parse with AI'}
                </button>
              </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company *</label>
                  <input {...register('company')} placeholder="Google" className={inputClass} />
                  {errors.company && <p className={errorClass}>{errors.company.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Role *</label>
                  <input {...register('role')} placeholder="Software Engineer" className={inputClass} />
                  {errors.role && <p className={errorClass}>{errors.role.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Role Type *</label>
                  <select {...register('roleType')} className={inputClass}>
                    {ROLE_TYPES.map((rt) => (
                        <option key={rt.value} value={rt.value} className="bg-zinc-800">
                          {rt.label}
                        </option>
                    ))}
                  </select>
                  {errors.roleType && <p className={errorClass}>{errors.roleType.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Status *</label>
                  <select {...register('applicationStatus')} className={inputClass}>
                    {STATUSES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-zinc-800">
                          {s.label}
                        </option>
                    ))}
                  </select>
                  {errors.applicationStatus && <p className={errorClass}>{errors.applicationStatus.message}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Job Posting Link</label>
                <input {...register('link')} placeholder="https://careers.company.com/job/..." className={inputClass} />
                {errors.link && <p className={errorClass}>{errors.link.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Description / Notes</label>
                <textarea
                    {...register('description')}
                    placeholder="Any notes about this application..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 rounded-lg transition-colors font-medium"
                >
                  {loading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
        )}
      </Modal>
  )
}