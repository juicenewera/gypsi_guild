'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getSupabaseClient } from '@/lib/supabase/client'
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Email inválido')
})

export default function EsqueciSenhaPage() {
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
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw new Error(error.message)
      }

      setSuccess(true)
    } catch (err: any) {
      if (err.message.includes('rate limit')) {
        setError('Muitas tentativas. Aguarde 1 hora antes de tentar novamente.')
      } else {
        setError('Ocorreu um erro ao reiniciar sua senha. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-2">Esqueceu a senha?</h1>
            <p className="text-sm font-medium text-gray-500">
              Digite o e-mail atrelado a sua conta. Enviaremos um link mágico para você forjar uma nova senha.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-serif font-bold text-xl text-black mb-2">E-mail de resgate enviado!</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Verifique sua caixa de entrada e também o filtro de spam.<br />
                O link expira em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email Cadastrado</label>
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

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-xl py-4 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-900 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none transition-all mt-8"
              >
                {isLoading ? 'Enviando Ordem...' : 'Receber Link Mágico'} 
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  )
}
