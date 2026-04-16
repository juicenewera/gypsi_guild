'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth'
import { AlertCircle } from 'lucide-react'

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
      setError('Email ou senha incorretos. Tente novamente.')
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
      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-3 tracking-tight">Guild</h1>
          <p className="text-gray-300 text-lg">Bem-vindo de volta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm animate-fade-in">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-200 font-medium">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 bg-white text-black rounded-xl outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-gray-400"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-200 font-medium">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 bg-white text-black rounded-xl outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-gray-400"
              placeholder="••••••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-xl font-bold text-base hover:bg-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors mt-8"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 space-y-3 text-center text-sm">
          <p className="text-gray-300">
            Não tem conta?{' '}
            <Link href="/register" className="text-white hover:underline font-medium">
              Criar conta
            </Link>
          </p>
          <p>
            <Link href="/" className="text-gray-300 hover:text-white text-xs flex items-center justify-center gap-1">
              ← Voltar ao início
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
