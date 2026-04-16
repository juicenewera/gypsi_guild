'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { Briefcase, Zap, Rocket, ChevronRight, Check } from 'lucide-react'

type Path = 'ladino' | 'mago' | 'mercador'

const TOTAL_STEPS = 4

const REVENUE_OPTIONS = [
  'Starting out (R$ 0)',
  'Scaling (Up to R$ 5k)',
  'Growth (R$ 5k - R$ 15k)',
  'Elite (R$ 15k+)'
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuthStore()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [path, setPath] = useState<Path | null>(null)
  const [revenueRange, setRevenueRange] = useState('')
  const [bio, setBio] = useState('')

  async function handleFinish() {
    if (!user) return
    setIsSubmitting(true)
    setError('')

    try {
      const { getSupabaseClient } = await import('@/lib/supabase/client')
      const supabase = getSupabaseClient()

      const { error } = await supabase
        .from('profiles')
        .update({
          path,
          revenue_range: revenueRange,
          bio,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshUser()
      router.push('/dashboard')
    } catch (e: any) {
      setError('System error. Please try again.')
      setIsSubmitting(false)
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS) setStep(step + 1)
    else handleFinish()
  }

  const pathOptions: { value: Path; icon: any; label: string; description: string }[] = [
    { value: 'ladino', icon: Zap, label: 'Ladino', description: 'Foco em vendas agressivas, growth e prospecção de alto volume.' },
    { value: 'mago', icon: Rocket, label: 'Mago', description: 'Desenvolvimento técnico profundo, arquitetura de sistemas e agentes.' },
    { value: 'mercador', icon: Briefcase, label: 'Mercador', description: 'Visão de negócio, branding, posicionamento e escala.' },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center pt-20 pb-10 p-6">
      
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-sm p-10 md:p-16">
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-16">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                step >= i + 1 ? "bg-black" : "bg-gray-100"
              )}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="space-y-12">
          
          {/* Step 1: Path */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif font-black text-black">Meu Caminho</h1>
                <p className="text-gray-500 font-medium">Qual especialidade você quer dominar primeiro?</p>
              </div>
              
              <div className="grid gap-4">
                {pathOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPath(opt.value)}
                    className={cn(
                      "flex items-center gap-6 p-6 text-left rounded-2xl border-2 transition-all group",
                      path === opt.value 
                        ? "border-black bg-gray-50 shadow-sm" 
                        : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-xl transition-colors",
                      path === opt.value ? "bg-white shadow-sm" : "bg-gray-50 group-hover:bg-white"
                    )}>
                      <opt.icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-black">{opt.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{opt.description}</p>
                    </div>
                    {path === opt.value && <Check className="w-6 h-6 ml-auto text-black" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Revenue */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif font-black text-black">Maturidade.</h1>
                <p className="text-gray-500 font-medium">Qual a sua média de faturamento mensal hoje?</p>
              </div>
              
              <div className="grid gap-4">
                {REVENUE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setRevenueRange(opt)}
                    className={cn(
                      "p-6 text-center rounded-2xl border-2 transition-all font-bold text-lg",
                      revenueRange === opt 
                        ? "border-black bg-gray-50 text-black shadow-sm" 
                        : "border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif font-black text-black">Seu Manifesto.</h1>
                <p className="text-gray-500 font-medium">Como você se descreve e o que está buscando na guilda?</p>
              </div>
              
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Exemplo: Sou um desenvolvedor focado em automatizar advocacias..."
                className="w-full min-h-[200px] p-6 text-lg bg-gray-50 border border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none transition-all"
              />
            </div>
          )}

          {/* Step 4: Final */}
          {step === 4 && (
            <div className="space-y-8 text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-black rounded-full mx-auto flex items-center justify-center text-white mb-8 shadow-xl">
                <Check size={48} />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-serif font-black text-black">Tudo pronto.</h1>
                <p className="text-gray-500 font-medium max-w-sm mx-auto text-lg">
                  Seu perfil foi cunhado. Você agora faz parte da guilda.
                </p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-12 mt-12 border-t border-gray-100">
            <button 
              onClick={() => step > 1 && setStep(step - 1)}
              className={cn("text-sm font-bold text-gray-400 hover:text-black transition-colors px-4 py-2", step === 1 && "invisible")}
            >
              ← Voltar
            </button>
            
            <button
              onClick={handleNext}
              disabled={step === 1 && !path || step === 2 && !revenueRange || isSubmitting}
              className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isSubmitting ? 'Salvando...' : step === TOTAL_STEPS ? 'Adentrar a Guilda' : 'Avançar'}
              {!isSubmitting && <ChevronRight className="w-4 h-4 ml-1" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
