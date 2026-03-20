import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { Zap, ArrowRight, Eye, EyeOff, TrendingUp, Shield, BarChart2 } from 'lucide-react'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const FEATURES = [
  { icon: TrendingUp, text: 'Track all your job applications' },
  { icon: BarChart2, text: '6 personal analytics metrics' },
  { icon: Shield, text: 'Secure JWT authentication' },
]

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPwd, setShowPwd] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('jt_token', data.token)
      setAuth(data.token, null, null)
      navigate('/home')
    },
  })

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Left brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden p-12 border-r border-zinc-800/60"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-zinc-950 to-zinc-950" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">JobTrail</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
              Track your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                career path.
              </span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
              Manage every application, understand your analytics, and stay on top of your job search.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-zinc-800/80 border border-zinc-700/60 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-indigo-400" />
                </div>
                <span className="text-sm text-zinc-400">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {[
            { label: 'Applications', value: '∞' },
            { label: 'Analytics', value: '6' },
            { label: 'Resume versions', value: 'N' },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-4">
              <div className="text-2xl font-bold text-indigo-400 mb-1">{item.value}</div>
              <div className="text-xs text-zinc-600">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right form panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">JobTrail</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>
            <p className="text-zinc-500 text-sm">Sign in to continue tracking your applications</p>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Username</label>
              <input
                {...register('username')}
                placeholder="your_username"
                autoComplete="username"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1.5">{errors.username.message}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {mutation.isError && (
              <div className="bg-red-950/50 border border-red-800/60 rounded-xl px-4 py-3 text-red-400 text-sm">
                Invalid username or password. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-600/20"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign in <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-600 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
