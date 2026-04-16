'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuthStore } from '@/store/auth'
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRegistered = searchParams.get('registered') === 'true'
  const { login, isAuthenticated, isLoading, error: authError, clearError, initialized } = useAuthStore()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [initialized, isAuthenticated, router])

  const onSubmit = async (data: any) => {
    setError('')
    clearError()
    try {
      await login(data.email, data.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Email ou senha incorretos. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-2">Entrar na Guilda</h1>
            <p className="text-sm font-medium text-gray-500">
              Acesse a comunidade dos builders de elite.
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error || authError}</span>
            </div>
          )}

          {isRegistered && !error && !authError && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Sua conta foi forjada! Verifique a sua caixa de entrada e spam para confirmar seu e-mail antes de acessar.</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  {...register('email')}
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 rounded-xl px-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  {...register('password')}
                  type="password"
                  className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 rounded-xl px-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{errors.password.message as string}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-xl py-4 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-900 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none transition-all mt-8"
            >
              {isLoading ? 'Entrando...' : 'Acessar Guilda'} 
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Ainda não faz parte?{' '}
            <Link href="/register" className="text-black font-bold hover:underline">
              Crie seu acesso
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FAFB]" />}>
      <LoginForm />
    </Suspense>
  )
}
