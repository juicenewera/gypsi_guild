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
      if (err?.message === 'CONFIRM_EMAIL') {
        setError('Conta criada! Confirme seu email antes de entrar.')
      } else {
        setError(err?.message || 'Erro ao criar conta. Tente novamente.')
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      {/* Background Image */}
      <img
        src="/images/heroes/hero-guild.jpg"
        alt="Guild"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-3 tracking-tight">Guild</h1>
          <p className="text-gray-300 text-lg">Crie sua conta e entre na aventura</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm animate-fade-in">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Path Selection */}
          <div className="space-y-4">
            <label className="block text-sm text-gray-200 font-medium">Escolha sua Linhagem</label>
            <div className="grid grid-cols-3 gap-3">
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
                    'p-6 rounded-xl flex flex-col items-center gap-3 transition-all duration-200 border-2',
                    selectedPath === p.value
                      ? 'border-white bg-white/15 text-white shadow-lg'
                      : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                  )}
                >
                  <p.icon size={28} />
                  <span className="text-xs font-bold tracking-wide">{p.label}</span>
                </button>
              ))}
            </div>
            {errors.path && <p className="text-xs text-red-400 font-medium">Linhagem é obrigatória</p>}
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-200 font-medium">Nome de Usuário</label>
              <input
                type="text"
                {...register('username')}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-white/30 transition-all border border-white/20 placeholder:text-gray-500"
                placeholder="BuilderX"
              />
              {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-200 font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-white/30 transition-all border border-white/20 placeholder:text-gray-500"
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-200 font-medium">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-white/30 transition-all border border-white/20 placeholder:text-gray-500"
              placeholder="••••••••••••"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedPath}
            className="w-full py-3 bg-white text-black rounded-xl font-bold text-base hover:bg-gray-100 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors mt-8"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-300 text-sm">
            Já tem conta?{' '}
            <Link href="/login" className="text-white hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
