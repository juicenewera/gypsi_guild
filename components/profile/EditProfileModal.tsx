'use client'

import { useRef, useState } from 'react'
import { Camera, Check, Loader2, X } from 'lucide-react'
import { updateMyProfile, uploadAvatar } from '@/lib/supabase/queries'
import { useAuthStore } from '@/store/auth'
import { getAvatarUrl, cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  initial: {
    id: string
    username: string
    display_name?: string | null
    name?: string | null
    bio?: string | null
    avatar_url?: string | null
    avatar?: string | null
    whatsapp?: string | null
    instagram?: string | null
    location?: string | null
  }
}

export function EditProfileModal({ open, onClose, initial }: Props) {
  const { refreshUser } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(initial.display_name || initial.name || '')
  const [bio,         setBio]         = useState(initial.bio || '')
  const [whatsapp,    setWhatsapp]    = useState(initial.whatsapp || '')
  const [instagram,   setInstagram]   = useState(initial.instagram || '')
  const [location,    setLocation]    = useState(initial.location || '')
  const [avatarUrl,   setAvatarUrl]   = useState(initial.avatar_url || initial.avatar || null)

  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [done,      setDone]      = useState(false)

  if (!open) return null

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null); setUploading(true)
    try {
      const url = await uploadAvatar(file)
      setAvatarUrl(url)
    } catch (err: any) {
      setError(err?.message || 'Falha no upload.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function save() {
    setError(null); setSaving(true)
    try {
      await updateMyProfile({
        display_name: displayName.trim() || null,
        bio:          bio.trim() || null,
        whatsapp:     whatsapp.trim() || null,
        instagram:    instagram.trim().replace(/^@/, '') || null,
        location:     location.trim() || null,
        avatar_url:   avatarUrl,
      })
      await refreshUser()
      setDone(true)
      setTimeout(onClose, 900)
    } catch (err: any) {
      setError(err?.message || 'Falha ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-serif font-bold text-black">Configurações da conta</h3>
            <p className="text-xs text-gray-500 mt-0.5">Atualize suas informações públicas e foto.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black p-1 -mr-1 -mt-1"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={getAvatarUrl(avatarUrl, initial.id)}
                alt="avatar"
                className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                <Camera className="w-3.5 h-3.5" strokeWidth={2.2} />
                {avatarUrl ? 'Trocar foto' : 'Enviar foto'}
              </button>
              <p className="text-[10px] text-gray-400 mt-1.5">JPG, PNG ou WEBP • até 5 MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>

          <Field label="Nome de exibição">
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              maxLength={60}
              placeholder="Como você quer ser chamado"
              className={inputCls}
            />
          </Field>

          <Field label="Username" hint="Não pode ser alterado">
            <input value={`@${initial.username}`} disabled className={cn(inputCls, 'bg-gray-100 text-gray-500 cursor-not-allowed')} />
          </Field>

          <Field label="Bio">
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Conte um pouco sobre você"
              className={cn(inputCls, 'resize-none')}
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{bio.length}/280</p>
          </Field>

          <Field label="Localização">
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              maxLength={80}
              placeholder="Cidade, Estado"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WhatsApp" hint="Apenas números com DDD">
              <input
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value.replace(/[^\d+]/g, ''))}
                maxLength={20}
                placeholder="5511999998888"
                className={inputCls}
              />
            </Field>
            <Field label="Instagram" hint="Sem o @">
              <input
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                maxLength={40}
                placeholder="seuusuario"
                className={inputCls}
              />
            </Field>
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black rounded-full"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving || uploading || done}
            className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...</>
            ) : done ? (
              <><Check className="w-3.5 h-3.5" strokeWidth={2.4} /> Salvo!</>
            ) : (
              'Salvar alterações'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
        {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      </div>
      {children}
    </div>
  )
}
