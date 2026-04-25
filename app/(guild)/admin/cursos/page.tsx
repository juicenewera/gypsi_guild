'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit3, Trash2, ExternalLink } from 'lucide-react'
import {
  fetchAllCoursesAdmin,
  upsertCourse,
  deleteCourse,
  type Course,
} from '@/lib/supabase/queries'
import { cn } from '@/lib/utils'

const BLANK_COURSE: Partial<Course> = {
  slug: '',
  title: '',
  description: '',
  emoji: '📚',
  cover_color: 'bg-gradient-to-br from-gray-700 to-gray-900',
  tag: 'IA Aplicada',
  duration: '',
  xp_reward: 40,
  price: 0,
  old_price: null,
  is_featured: false,
  is_affiliate: false,
  affiliate_url: null,
  status: 'available',
  sort_order: 100,
  type: 'course',
}

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Course> | null>(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    const cs = await fetchAllCoursesAdmin()
    setCourses(cs)
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  async function save() {
    if (!editing?.slug || !editing.title) {
      setErr('Slug e título são obrigatórios.')
      return
    }
    setSaving(true)
    setErr(null)
    try {
      await upsertCourse(editing as any)
      setEditing(null)
      reload()
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(c: Course) {
    if (!confirm(`Deletar curso "${c.title}"? As aulas dentro também serão apagadas.`)) return
    try {
      await deleteCourse(c.id)
      reload()
    } catch (e: any) { alert(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-serif text-black">Tomos & Conselhos</h2>
          <p className="text-xs text-gray-500">Cursos (type=course) e lives gravadas (type=live).</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK_COURSE })}
          className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo curso
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-black mb-3">
            {editing.id ? `Editando: ${editing.title}` : 'Novo curso'}
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            <TextField label="Slug *" value={editing.slug ?? ''} onChange={v => setEditing(p => ({ ...p!, slug: v }))} />
            <TextField label="Título *" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p!, title: v }))} />
            <TextField label="Tag" value={editing.tag ?? ''} onChange={v => setEditing(p => ({ ...p!, tag: v }))} />
            <TextField label="Duração (ex: 4h)" value={editing.duration ?? ''} onChange={v => setEditing(p => ({ ...p!, duration: v }))} />
            <TextField label="Emoji" value={editing.emoji ?? ''} onChange={v => setEditing(p => ({ ...p!, emoji: v }))} />
            <TextField label="Cover color (classe Tailwind)" value={editing.cover_color ?? ''} onChange={v => setEditing(p => ({ ...p!, cover_color: v }))} />
            <NumField  label="XP reward"  value={editing.xp_reward ?? 0}  onChange={v => setEditing(p => ({ ...p!, xp_reward: v }))} />
            <NumField  label="Sort order" value={editing.sort_order ?? 100} onChange={v => setEditing(p => ({ ...p!, sort_order: v }))} />
            <NumField  label="Preço R$"   value={Number(editing.price ?? 0)} onChange={v => setEditing(p => ({ ...p!, price: v }))} />
            <NumField  label="Preço antigo R$" value={Number(editing.old_price ?? 0)} onChange={v => setEditing(p => ({ ...p!, old_price: v || null }))} />
            <SelectField label="Tipo" value={editing.type ?? 'course'} options={[['course', 'Curso'], ['live', 'Live gravada']]} onChange={v => setEditing(p => ({ ...p!, type: v as any }))} />
            <SelectField label="Status" value={editing.status ?? 'available'} options={[['available', 'Disponível'], ['coming_soon', 'Em breve'], ['pending_validation', 'Pendente'], ['rejected', 'Rejeitado']]} onChange={v => setEditing(p => ({ ...p!, status: v as any }))} />
            <BoolField label="Em destaque" value={!!editing.is_featured} onChange={v => setEditing(p => ({ ...p!, is_featured: v }))} />
            <BoolField label="Afiliado" value={!!editing.is_affiliate} onChange={v => setEditing(p => ({ ...p!, is_affiliate: v }))} />
            {editing.is_affiliate && (
              <TextField label="URL de afiliado" value={editing.affiliate_url ?? ''} onChange={v => setEditing(p => ({ ...p!, affiliate_url: v }))} />
            )}
          </div>

          <div className="mt-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Descrição</label>
            <textarea
              value={editing.description ?? ''}
              onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:border-black"
            />
          </div>

          {err && <p className="text-xs text-red-600 mt-3">{err}</p>}
          <div className="flex gap-2 mt-4">
            <button
              onClick={save}
              disabled={saving}
              className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800 disabled:opacity-40"
            >{saving ? 'Salvando...' : 'Salvar'}</button>
            <button
              onClick={() => setEditing(null)}
              className="text-xs font-semibold text-gray-500 hover:text-black px-4 py-2"
            >Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white border border-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-gray-400 bg-gray-50">
              <tr>
                <th className="text-left p-3">Curso</th>
                <th className="text-left p-3 hidden md:table-cell">Tipo</th>
                <th className="text-left p-3 hidden md:table-cell">Status</th>
                <th className="text-left p-3 hidden md:table-cell">XP</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-black truncate">{c.title}</p>
                        <p className="text-xs text-gray-400 truncate">{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={cn(
                      'text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border',
                      c.type === 'live' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100',
                    )}>
                      {c.type}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-gray-500">{c.status}</td>
                  <td className="p-3 hidden md:table-cell text-xs font-bold">{c.xp_reward}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/cursos/${c.slug}`}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black"
                        title="Aulas"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setEditing({ ...c })}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(c)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-red-500"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:outline-none focus:border-black"
      />
    </label>
  )
}
function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:outline-none focus:border-black"
      />
    </label>
  )
}
function BoolField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 mt-4">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span className="text-xs font-semibold text-black">{label}</span>
    </label>
  )
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 bg-white focus:outline-none focus:border-black"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
}
