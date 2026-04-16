'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth'
import { Mail, Lock, AlertCircle, ChevronRight } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isLoading, isAuthenticated, initialize, initialized } = useAuthStore()
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.push('/')
    }
  }, [initialized, isAuthenticated, router])

  async function onSubmit(data: LoginForm) {
    setError('')
    try {
      await login(data.email, data.password)
      router.push('/')
    } catch {
      setError('AUTH_FAILURE: Credentials not recognized by the Guild.')
    }
  }

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-12 h-12 bg-black mx-auto mb-6 flex items-center justify-center text-white text-pixel text-2xl">G</div>
          <h1 className="text-5xl font-normal text-black uppercase tracking-tighter leading-none mb-4">
            System <br/> Access
          </h1>
          <p className="text-text-secondary text-lg font-medium italic">Synchronize your credentials.</p>
        </div>

        <div className="card-donos p-10 bg-bg-primary">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-black text-white text-xs font-black uppercase tracking-widest animate-fade-in">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-black uppercase tracking-[0.2em] ml-1">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  {...register('email')}
                  className="input-donos w-full pl-12 h-14 font-bold"
                  placeholder="admin@elite.com"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-black uppercase tracking-[0.2em] ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  {...register('password')}
                  className="input-donos w-full pl-12 h-14 font-bold"
                  placeholder="••••••••••••"
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{errors.password.message}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-donos btn-donos-primary w-full h-16 text-xl"
              >
                {isLoading ? 'SINCING...' : 'ESTABLISH LINK'}
                <ChevronRight />
              </button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-black/5 text-center">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
              New identity?{' '}
              <Link href="/register" className="text-black hover:underline decoration-2 underline-offset-4 font-black">
                Join the Guild
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
