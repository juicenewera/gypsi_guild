'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Lock, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: "As senhas não coincidem",
  path: ["confirm"]
});

export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: any) => {
    setError('')
    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        throw new Error(error.message)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (err: any) {
      setError('Sessão expirada ou erro ao atualizar. Solicite outro link de redefinição.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-2">Forjar Nova Senha</h1>
            <p className="text-sm font-medium text-gray-500">
              Digite sua nova senha de acesso à Guilda.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-2xl mb-2 text-black">Senha Restaurada!</h2>
              <p className="text-gray-500 text-sm font-medium font-mono tracking-widest uppercase">Redirecionando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Nova Senha</label>
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    {...register('confirm')}
                    type="password"
                    className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 rounded-xl px-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirm && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{errors.confirm.message as string}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-xl py-4 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-900 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none transition-all mt-8"
              >
                {isLoading ? 'Forjando...' : 'Atualizar Acesso'} 
                {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            {error && (
              <Link href="/esqueci-senha" className="text-sm font-bold text-blue-600 hover:text-blue-800">
                Tentar solicitar outro link
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
