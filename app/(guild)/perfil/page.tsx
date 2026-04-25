'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { getAvatarUrl, timeAgo } from '@/lib/utils'
import { getLevelForXP, getLevelTitle } from '@/lib/xp'
import { XPBar } from '@/components/ui/XPBar'
import {
  fetchProfileByUsername,
  fetchProfileReviews,
  fetchMyReviewOf,
  upsertReview,
  deleteMyReview,
  type PublicProfile,
  type ProfileReview,
  type ReviewTag,
} from '@/lib/supabase/queries'
import {
  LogOut, MessageCircle, AtSign, Sparkles, ArrowLeft, Loader2,
  Settings, MapPin, Star, Phone, Mail, Trophy, Flame, Swords, BookOpen,
  Edit3, Trash2, Check, X,
} from 'lucide-react'
import { EditProfileModal } from '@/components/profile/EditProfileModal'

const REVIEW_TAGS: ReviewTag[] = ['Ajudei', 'Indiquei', 'Colaborei', 'Contratei']

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto p-10 text-center text-gray-500">
        <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
        Carregando pergaminho...
      </div>
    }>
      <ProfilePage />
    </Suspense>
  )
}

function ProfilePage() {
  const search = useSearchParams()
  const { user, logout } = useAuthStore()
  const u = search.get('u')

  const [profile, setProfile]   = useState<PublicProfile | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [editing, setEditing]   = useState(false)

  const [reviews, setReviews]     = useState<ProfileReview[]>([])
  const [totalReviews, setTotal]  = useState(0)
  const [page, setPage]           = useState(0)
  const [myReview, setMyReview]   = useState<ProfileReview | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)

  const username = u ?? (user as any)?.username ?? null
  const isOwn = !u || (user as any)?.username === u

  async function reload() {
    if (!username) return
    setLoading(true); setError(null)
    const p = await fetchProfileByUsername(username)
    if (!p) { setError('Pergaminho não encontrado.'); setLoading(false); return }
    setProfile(p)
    const { rows, total } = await fetchProfileReviews(p.id, 0)
    setReviews(rows); setTotal(total); setPage(0)
    if (user && !isOwn) setMyReview(await fetchMyReviewOf(p.id))
    setLoading(false)
  }

  useEffect(() => { reload() /* eslint-disable-line react-hooks/exhaustive-deps */ }, [username, isOwn, user?.id])

  async function loadPage(p: number) {
    if (!profile) return
    const { rows } = await fetchProfileReviews(profile.id, p)
    setReviews(rows); setPage(p)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center text-gray-500">
        <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
        Desenrolando o pergaminho...
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-6">
        <Link href="/aventureiros" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black">
          <ArrowLeft className="w-4 h-4" /> Voltar para Aventureiros
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-500">{error || 'Perfil não encontrado.'}</p>
        </div>
      </div>
    )
  }

  const xp = profile.xp || 0
  const lvl = getLevelForXP(xp)
  const classTitle = getLevelTitle(lvl.level, profile.path || 'mago')
  const displayName = profile.display_name || profile.name || profile.username
  const initials = displayName.slice(0, 2).toUpperCase()
  const whatsapp  = (profile.whatsapp  || '').replace(/\D/g, '')
  const instagram = (profile.instagram || '').replace(/^@/, '')
  const showRating = profile.rating_count >= 3
  const hasContact = !!(whatsapp || instagram || profile.email_public || profile.phone_public)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!isOwn && (
        <Link href="/aventureiros" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black">
          <ArrowLeft className="w-4 h-4" /> Voltar para Aventureiros
        </Link>
      )}

      {/* ── HEADER CARD ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/50" />
          <span className="absolute top-4 left-5 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-serif">
            Pergaminho do Aventureiro
          </span>
          {isOwn && (
            <button
              onClick={() => setEditing(true)}
              className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-black text-[11px] font-bold hover:bg-white"
            >
              <Settings className="w-3 h-3" strokeWidth={2.2} />
              Editar
            </button>
          )}
        </div>

        <div className="px-6 pb-6 -mt-10 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-black text-white flex items-center justify-center text-2xl font-bold overflow-hidden shadow-lg">
              {profile.avatar_url
                ? <img src={getAvatarUrl(profile.avatar_url, profile.id)} alt={displayName} className="w-full h-full object-cover" />
                : initials}
            </div>
            <div className="flex-1 min-w-0 pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-black">{displayName}</h1>
                {profile.title && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    <Trophy className="w-3 h-3" /> {profile.title}
                  </span>
                )}
                {profile.is_pro && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">Pro</span>
                )}
                {profile.is_founder && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Fundador</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                <span>@{profile.username}</span>
                <span>·</span>
                <span className="capitalize">{profile.path || 'mago'}</span>
                <span>·</span>
                <span>Nível {lvl.level} {classTitle && `· ${classTitle}`}</span>
                {profile.location && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>
                  </>
                )}
              </div>
              {profile.tagline && (
                <p className="text-sm text-gray-600 mt-2 font-serif italic">"{profile.tagline}"</p>
              )}
            </div>

            <div className="flex flex-col items-stretch md:items-end gap-2 md:pt-3">
              {showRating ? (
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-lg font-bold">{Number(profile.rating_avg).toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {profile.rating_count} avaliações
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {profile.rating_count} / 3 avaliações pra exibir nota
                </p>
              )}
              {!isOwn && user && (
                <button
                  onClick={() => setReviewOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800"
                >
                  <Star className="w-3.5 h-3.5" />
                  {myReview ? 'Editar avaliação' : 'Deixar avaliação'}
                </button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <Stat Icon={Swords}   label="Aventuras" value={profile.adventures_count} />
            <Stat Icon={BookOpen} label="Missões"   value={profile.missions_count} />
            <Stat Icon={Flame}    label="Streak"    value={`${profile.streak_days}d`} />
            <Stat Icon={Sparkles} label="XP total"  value={xp.toLocaleString('pt-BR')} />
          </div>

          {/* XP Bar — progresso no nível atual */}
          <div className="mt-5">
            <div className="flex items-end justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Evolução · Nível {lvl.level}
              </span>
              <span className="text-[11px] font-bold text-gray-500">
                {lvl.xpCurrent.toLocaleString('pt-BR')} / {lvl.xpNext.toLocaleString('pt-BR')} XP
              </span>
            </div>
            <XPBar current={lvl.xpCurrent} max={lvl.xpNext || 1} size="sm" />
            {lvl.xpNext > 0 && lvl.xpCurrent < lvl.xpNext && (
              <p className="text-xs text-gray-500 mt-2">
                Faltam <span className="font-semibold text-black">{(lvl.xpNext - lvl.xpCurrent).toLocaleString('pt-BR')} XP</span> para o nível {lvl.level + 1}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY GRID ───────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[360px_1fr] gap-6">

        {/* LEFT: sobre + hobbies + wishlist + contatos */}
        <aside className="space-y-4">
          {profile.bio && (
            <Card title="Sobre">
              <p className="text-sm text-gray-700 font-serif leading-relaxed">{profile.bio}</p>
            </Card>
          )}

          {profile.hobbies.length > 0 && (
            <Card title="🎯 Hobbies">
              <ul className="text-sm text-gray-700 space-y-1">
                {profile.hobbies.map((h, i) => <li key={i}>• {h}</li>)}
              </ul>
            </Card>
          )}

          {profile.wishlist.length > 0 && (
            <Card title="🌍 Wishlist">
              <ul className="text-sm text-gray-700 space-y-1">
                {profile.wishlist.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </Card>
          )}

          {hasContact && (
            <Card title="Contato">
              <div className="flex flex-wrap gap-2">
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                )}
                {instagram && (
                  <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-pink-200 text-pink-700 hover:bg-pink-50">
                    <AtSign className="w-3.5 h-3.5" /> @{instagram}
                  </a>
                )}
                {profile.email_public && (
                  <a href={`mailto:${profile.email_public}`}
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                )}
                {profile.phone_public && (
                  <a href={`tel:${profile.phone_public.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Phone className="w-3.5 h-3.5" /> Telefone
                  </a>
                )}
              </div>
            </Card>
          )}

          {isOwn && (
            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair da Guilda
            </button>
          )}
        </aside>

        {/* RIGHT: reviews */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-serif text-black">Avaliações do bando</h2>
              <p className="text-xs text-gray-500">O que outros aventureiros falam desse membro.</p>
            </div>
            {totalReviews > 0 && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{totalReviews} total</p>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-sm text-gray-500">Nenhuma avaliação ainda.</p>
              <p className="text-xs text-gray-400 mt-1">
                {isOwn ? 'Ajude um colega e peça que ele retribua.' : 'Seja o primeiro a deixar uma.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => <ReviewRow key={r.id} r={r} />)}
              {totalReviews > 10 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => loadPage(Math.max(page - 1, 0))}
                    disabled={page === 0}
                    className="px-3 py-1.5 text-xs font-bold rounded-full border border-gray-200 text-gray-500 hover:text-black disabled:opacity-40"
                  >← Anterior</button>
                  <span className="text-xs text-gray-500">
                    Página {page + 1} / {Math.ceil(totalReviews / 10)}
                  </span>
                  <button
                    onClick={() => loadPage(page + 1)}
                    disabled={(page + 1) * 10 >= totalReviews}
                    className="px-3 py-1.5 text-xs font-bold rounded-full border border-gray-200 text-gray-500 hover:text-black disabled:opacity-40"
                  >Próxima →</button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {isOwn && (
        <EditProfileModal
          open={editing}
          onClose={() => { setEditing(false); reload() }}
          initial={{
            id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            name: profile.name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            whatsapp: profile.whatsapp,
            instagram: profile.instagram,
            location: profile.location,
            title: profile.title,
            tagline: profile.tagline,
            email_public: profile.email_public,
            phone_public: profile.phone_public,
            hobbies: profile.hobbies,
            wishlist: profile.wishlist,
          }}
        />
      )}

      {!isOwn && profile && user && reviewOpen && (
        <ReviewModal
          profile={profile}
          existing={myReview}
          onClose={(changed) => { setReviewOpen(false); if (changed) reload() }}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

function Stat({ Icon, label, value }: { Icon: React.ComponentType<any>; label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
      <Icon className="w-4 h-4 mx-auto text-gray-400 mb-1" />
      <p className="text-base font-bold text-black">{value}</p>
      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{title}</h3>
      {children}
    </div>
  )
}

function ReviewRow({ r }: { r: ProfileReview }) {
  const name = r.reviewer?.display_name || r.reviewer?.username || 'Aventureiro'
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <article className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Link href={`/perfil?u=${r.reviewer?.username ?? ''}`}>
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold overflow-hidden">
            {r.reviewer?.avatar_url
              ? <img src={r.reviewer.avatar_url} alt={name} className="w-full h-full object-cover" />
              : initials}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/perfil?u=${r.reviewer?.username ?? ''}`} className="text-sm font-bold text-black hover:underline truncate">
              {name}
            </Link>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {r.tag}
            </span>
            <div className="inline-flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'opacity-30'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-auto">{timeAgo(r.created_at)}</span>
          </div>
          {r.company && <p className="text-[10px] text-gray-500 mt-0.5">via {r.company}</p>}
          {r.body && <p className="text-sm text-gray-700 mt-2 font-serif leading-relaxed whitespace-pre-wrap">{r.body}</p>}
        </div>
      </div>
    </article>
  )
}

function ReviewModal({ profile, existing, onClose }: { profile: PublicProfile; existing: ProfileReview | null; onClose: (changed: boolean) => void }) {
  const [rating,  setRating]  = useState(existing?.rating ?? 5)
  const [tag,     setTag]     = useState<ReviewTag>(existing?.tag ?? 'Ajudei')
  const [body,    setBody]    = useState(existing?.body ?? '')
  const [company, setCompany] = useState(existing?.company ?? '')
  const [saving,  setSaving]  = useState(false)
  const [err,     setErr]     = useState<string | null>(null)

  async function submit() {
    setSaving(true); setErr(null)
    try {
      await upsertReview({ target_id: profile.id, rating, tag, body: body.trim(), company: company.trim() || null })
      onClose(true)
    } catch (e: any) {
      setErr(e.message || 'Falha ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm('Remover sua avaliação?')) return
    setSaving(true)
    try { await deleteMyReview(profile.id); onClose(true) }
    catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => onClose(false)}>
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-serif font-bold text-black">
              {existing ? 'Editar avaliação' : `Avaliar ${profile.display_name || profile.username}`}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Sua honestidade ajuda o bando.</p>
          </div>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-black p-1 -mr-1 -mt-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Estrelas</p>
            <div className="inline-flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setRating(i)} className="text-amber-500">
                  <Star className={`w-7 h-7 ${i <= rating ? 'fill-current' : 'opacity-30'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Relação</p>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                    tag === t ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:text-black'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Empresa ou contexto (opcional)</p>
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              maxLength={80}
              placeholder="Onde vocês trabalharam juntos"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Comentário (opcional)</p>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={4}
              maxLength={400}
              placeholder="Conta pro bando o que aconteceu"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-black"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{body.length}/400</p>
          </div>

          {err && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</div>}
        </div>

        <div className="px-5 py-4 flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50">
          {existing ? (
            <button onClick={remove} disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full">
              <Trash2 className="w-3.5 h-3.5" /> Remover
            </button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <button onClick={() => onClose(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black rounded-full">
              Cancelar
            </button>
            <button onClick={submit} disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 disabled:opacity-60">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {existing ? 'Atualizar' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
