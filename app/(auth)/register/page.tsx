'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuthStore } from '@/store/auth'
import { ArrowRight, User, Lock, Mail, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  username: z.string().min(3, 'Mínimo 3 caracteres').max(20, 'Máximo 20 caracteres').regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e underlines'),
  path: z.enum(['ladino', 'mago', 'mercador']),
})

const PATHS = [
  { id: 'mago', title: 'Mago', desc: 'Code & Sistemas', color: 'border-purple-200 bg-purple-50 text-purple-700' },
  { id: 'ladino', title: 'Ladino', desc: 'Vendas & Growth', color: 'border-red-200 bg-red-50 text-red-700' },
  { id: 'mercador', title: 'Mercador', desc: 'Copy & Ofertas', color: 'border-amber-200 bg-amber-50 text-amber-700' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register: registerUser, isLoading } = useAuthStore()
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      path: 'mago' as 'ladino' | 'mago' | 'mercador'
    }
  })

  const selectedPath = watch('path')

  const onSubmit = async (data: any) => {
    setError('')
    try {
      await registerUser(data.email, data.password, data.username, data.path)
      router.push('/dashboard')
    } catch (err: any) {
      if (err?.message === 'CONFIRM_EMAIL') {
        router.push('/login?registered=true')
      } else {
        setError(err?.message || 'Erro ao criar conta. Tente novamente.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      
      <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 relative overflow-hidden">
        
        {/* Subtle decorative glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-2">Junte-se à Guilda</h1>
            <p className="text-sm font-medium text-gray-500">
              Inicie sua jornada validando seus projetos na vida real.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    {...register('email')}
                    type="email"
                    className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 rounded-xl px-11 py-3 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{errors.email.message as string}</p>}
              </div>

              {/* Senha */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Senha secreta</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    {...register('password')}
                    type="password"
                    className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 rounded-xl px-11 py-3 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{errors.password.message as string}</p>}
              </div>
              
              {/* Username */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Nome de Identificação (Opcional)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    {...register('username')}
                    className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 rounded-xl px-11 py-3 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm"
                    placeholder="ex: lucas_dev"
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{errors.username.message as string}</p>}
              </div>
            </div>

            {/* Path Selection */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider ml-1 mb-3">Escolha sua Classe Inicial</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PATHS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setValue('path', p.id as any)}
                    className={cn(
                      "flex flex-col text-left p-4 rounded-xl border-2 transition-all group",
                      selectedPath === p.id 
                        ? p.color + ' border-current shadow-md' 
                        : "bg-white border-gray-100 hover:border-gray-300 text-gray-500 hover:text-black"
                    )}
                  >
                    <span className="font-bold text-sm mb-1">{p.title}</span>
                    <span className={cn("text-xs font-medium", selectedPath === p.id ? 'opacity-80' : 'text-gray-400')}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-xl py-4 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-900 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none transition-all mt-6"
            >
              {isLoading ? 'Registrando...' : 'Forjar Acesso'} 
              {!isLoading && <ArrowRight className="w-4 h-4 items-center mt-0.5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Já possui acesso?{' '}
            <Link href="/login" className="text-black font-bold hover:underline">
              Entre no Grimório
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
