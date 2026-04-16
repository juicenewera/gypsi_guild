'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth'
import { Mail, Lock, User, AlertCircle, Zap, Shield, Globe, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  path: z.enum(['ladino', 'mago', 'mercador']),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, isLoading, isAuthenticated, initialize, initialized } = useAuthStore()
  const router = useRouter()
  const [error, setError] = useState('')
  const [selectedPath, setSelectedPath] = useState<'ladino' | 'mago' | 'mercador' | null>(null)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.push('/feed')
    }
  }, [initialized, isAuthenticated, router])

  function selectPath(path: 'ladino' | 'mago' | 'mercador') {
    setSelectedPath(path)
    setValue('path', path)
  }

  async function onSubmit(data: RegisterForm) {
    setError('')
    try {
      await registerUser(data.email, data.password, data.username, data.path)
      router.push('/')
    } catch (err: any) {
      setError('System rejection. Credentials may be already active.')
    }
  }

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-12 h-12 bg-black mx-auto mb-6 flex items-center justify-center text-white text-pixel text-2xl">G</div>
          <h1 className="text-5xl font-normal text-black uppercase tracking-tighter leading-none mb-4">
            Initialize <br/> Protocol
          </h1>
          <p className="text-text-secondary text-lg font-medium italic">Selecione sua linhagem para começar.</p>
        </div>

        <div className="card-donos p-10 bg-bg-primary">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-black text-white text-xs font-black uppercase tracking-widest animate-fade-in">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Path Selection */}
            <div className="space-y-6">
              <label className="text-[11px] font-black text-black uppercase tracking-[0.2em]">Lineage Selection</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'ladino' as const, icon: Zap, label: 'LADINO' },
                  { value: 'mago' as const, icon: Shield, label: 'MAGO' },
                  { value: 'mercador' as const, icon: Globe, label: 'MERCADOR' },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => selectPath(p.value)}
                    className={cn(
                      'p-6 border-2 flex flex-col items-center gap-4 transition-all duration-200',
                      selectedPath === p.value
                        ? 'border-black bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]'
                        : 'border-black/5 bg-bg-surface text-text-muted hover:border-black/20'
                    )}
                  >
                    <p.icon size={24} />
                    <span className="text-[11px] font-black tracking-widest">{p.label}</span>
                  </button>
                ))}
              </div>
              {errors.path && <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Protocol error: Lineage required.</p>}
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-black uppercase tracking-[0.2em] ml-1">Identity Handle</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    {...register('username')}
                    className="input-donos w-full pl-12 h-14 font-bold uppercase tracking-tight"
                    placeholder="BUILDER_01"
                  />
                </div>
              </div>

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
              </div>
            </div>

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
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !selectedPath}
                className="btn-donos btn-donos-primary w-full h-16 text-xl"
              >
                {isLoading ? 'SYNCING...' : 'INITIALIZE SYSTEM'}
                <ChevronRight />
              </button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-black/5 text-center">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Already integrated?{' '}
              <Link href="/login" className="text-black hover:underline decoration-2 underline-offset-4 font-black">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
