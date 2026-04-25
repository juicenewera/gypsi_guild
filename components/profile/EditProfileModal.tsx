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
    title?: string | null
    tagline?: string | null
    email_public?: string | null
    phone_public?: string | null
    hobbies?: string[] | null
    wishlist?: string[] | null
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
  const [title,       setTitle]       = useState(initial.title || '')
  const [tagline,     setTagline]     = useState(initial.tagline || '')
  const [emailPublic, setEmailPublic] = useState(initial.email_public || '')
  const [phonePublic, setPhonePublic] = useState(initial.phone_public || '')
  const [hobbies,     setHobbies]     = useState<string[]>(initial.hobbies ?? [])
  const [wishlist,    setWishlist]    = useState<string[]>(initial.wishlist ?? [])

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
        title:        title.trim() || null,
        tagline:      tagline.trim() || null,
        email_public: emailPublic.trim() || null,
        phone_public: phonePublic.trim() || null,
        hobbies,
        wishlist,
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
            <Field label="Título" hint="Ex: Predador, Arquiteta de IA">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={40}
                placeholder="Seu título de guerra"
                className={inputCls}
              />
            </Field>
            <Field label="Tagline" hint="Uma frase sua">
              <input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                maxLength={100}
                placeholder="O cara que resolve o impossível"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Hobbies" hint="Enter ou vírgula separa">
            <ChipsInput value={hobbies} onChange={setHobbies} placeholder="Heavy metal, corrida, vinho..." />
          </Field>

          <Field label="Wishlist" hint="O que você busca / sonha">
            <ChipsInput value={wishlist} onChange={setWishlist} placeholder="Sócio técnico, mercado EUA, casa na serra..." />
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
            <Field label="Email público (opt-in)" hint="Mostrado no perfil">
              <input
                value={emailPublic}
                onChange={e => setEmailPublic(e.target.value)}
                maxLength={120}
                placeholder="voce@email.com"
                className={inputCls}
              />
            </Field>
            <Field label="Telefone público (opt-in)" hint="Separado do WhatsApp">
              <input
                value={phonePublic}
                onChange={e => setPhonePublic(e.target.value.replace(/[^\d+\s()-]/g, ''))}
                maxLength={30}
                placeholder="+55 11 99999-8888"
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

function ChipsInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('')

  function commit() {
    const parts = draft.split(',').map(s => s.trim()).filter(Boolean)
    if (parts.length === 0) return
    const next = Array.from(new Set([...value, ...parts])).slice(0, 12)
    onChange(next)
    setDraft('')
  }

  return (
    <div className="border border-gray-200 rounded-xl p-2 bg-gray-50 focus-within:border-black">
      <div className="flex flex-wrap gap-1.5 mb-1">
        {value.map((t, i) => (
          <span key={`${t}-${i}`} className="inline-flex items-center gap-1 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {t}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit() }
          else if (e.key === 'Backspace' && !draft && value.length) { onChange(value.slice(0, -1)) }
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ''}
        className="w-full bg-transparent outline-none text-sm text-black placeholder:text-gray-400 py-1"
      />
    </div>
  )
}
