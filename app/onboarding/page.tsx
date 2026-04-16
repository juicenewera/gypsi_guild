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
      const { getClient } = await import('@/lib/pocketbase/client')
      const pb = getClient()

      await pb.collection('users').update(user.id, {
        path,
        revenue_range: revenueRange,
        bio,
        onboarding_completed_at: new Date().toISOString(),
      })

      await refreshUser()
      router.push('/')
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
    { value: 'ladino', icon: Zap, label: 'Ladino', description: 'Focus on sales, closing, and high-velocity revenue.' },
    { value: 'mago', icon: Rocket, label: 'Mago', description: 'Technical expertise, automations, and AI architecture.' },
    { value: 'mercador', icon: Briefcase, label: 'Mercador', description: 'Product scale, business management, and long-term assets.' },
  ]

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-xl animate-fade-in">
        {/* Progress */}
        <div className="flex gap-1 mb-12">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-500",
                step > i ? "bg-text-primary" : "bg-border-default"
              )}
            />
          ))}
        </div>

        <div className="space-y-10">
          {/* Step 1: Path */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">Define your path.</h1>
                <p className="text-text-secondary text-lg">Choose the lineage that represents your current focus in the Guild.</p>
              </div>
              
              <div className="grid gap-4">
                {pathOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPath(opt.value)}
                    className={cn(
                      "flex items-center gap-6 p-6 text-left card-donos border-2 transition-all",
                      path === opt.value ? "border-text-primary ring-4 ring-black/5" : "border-transparent"
                    )}
                  >
                    <div className="p-3 bg-bg-elevated rounded-lg">
                      <opt.icon className="w-6 h-6 text-text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{opt.label}</p>
                      <p className="text-sm text-text-secondary mt-1">{opt.description}</p>
                    </div>
                    {path === opt.value && <Check className="w-5 h-5 ml-auto text-text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Revenue */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">Current Status.</h1>
                <p className="text-text-secondary text-lg">What is your monthly recurring revenue with AI services?</p>
              </div>
              
              <div className="grid gap-3">
                {REVENUE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setRevenueRange(opt)}
                    className={cn(
                      "p-5 text-left card-donos border-2 transition-all font-bold",
                      revenueRange === opt ? "border-text-primary bg-bg-elevated" : "border-transparent"
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
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">Manifesto.</h1>
                <p className="text-text-secondary text-lg">A brief description of your expertise for the community.</p>
              </div>
              
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: Building automation systems for high-ticket law firms..."
                className="input-donos min-h-[200px] text-lg p-6 resize-none"
              />
            </div>
          )}

          {/* Step 4: Final */}
          {step === 4 && (
            <div className="space-y-8 text-center py-10">
              <div className="w-20 h-20 bg-text-primary rounded-3xl mx-auto flex items-center justify-center text-white mb-6">
                <Check size={40} />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">Welcome to the Elite.</h1>
                <p className="text-text-secondary text-lg max-w-sm mx-auto">Your access to the Guild resources is now being synchronized.</p>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-10 border-t border-border-subtle">
            <button 
              onClick={() => step > 1 && setStep(step - 1)}
              className={cn("text-sm font-bold text-text-muted hover:text-text-primary transition-colors", step === 1 && "invisible")}
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={step === 1 && !path || step === 2 && !revenueRange || isSubmitting}
              className="btn-donos btn-donos-primary h-14 px-10 text-base"
            >
              {isSubmitting ? 'Syncing...' : step === TOTAL_STEPS ? 'Enter the Guild' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
