'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit3, Trash2, Save } from 'lucide-react'
import {
  fetchCourseBySlug,
  fetchCourseLessons,
  upsertLesson,
  deleteLesson,
  type Course,
  type CourseLesson,
} from '@/lib/supabase/queries'
import { detectVideoProvider } from '@/components/video/VideoEmbed'

const BLANK: Partial<CourseLesson> = {
  slug: '',
  title: '',
  description: '',
  external_url: '',
  duration_sec: 0,
  instructor: '',
  order_index: 1,
  xp_reward: 20,
  is_pro_only: false,
}

export default function AdminCourseLessonsPage() {
  const params = useParams<{ slug: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<CourseLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<CourseLesson> | null>(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    if (!params.slug) return
    const c = await fetchCourseBySlug(params.slug)
    setCourse(c)
    if (c) {
      const ls = await fetchCourseLessons(c.id)
      setLessons(ls)
    }
    setLoading(false)
  }

  useEffect(() => { reload() }, [params.slug])

  async function save() {
    if (!course || !editing?.slug || !editing.title || !editing.external_url) {
      setErr('Slug, título e URL do vídeo são obrigatórios.')
      return
    }
    setSaving(true)
    setErr(null)
    try {
      await upsertLesson({ ...editing, course_id: course.id } as any)
      setEditing(null)
      reload()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  async function remove(l: CourseLesson) {
    if (!confirm(`Remover aula "${l.title}"?`)) return
    try { await deleteLesson(l.id); reload() } catch (e: any) { alert(e.message) }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Carregando...</div>
  }
  if (!course) {
    return <div className="p-6 text-sm text-red-500">Curso não encontrado.</div>
  }

  return (
    <div>
      <Link href="/admin/cursos" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black mb-4">
        <ArrowLeft className="w-3 h-3" />
        Voltar para Cursos
      </Link>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-serif text-black">{course.emoji} {course.title}</h2>
          <p className="text-xs text-gray-500">Aulas ({course.type === 'live' ? 'Conselho gravado' : 'Pergaminhos do Tomo'})</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK, order_index: lessons.length + 1 })}
          className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800"
        >
          <Plus className="w-3.5 h-3.5" />
          Nova aula
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-black mb-3">
            {editing.id ? `Editando: ${editing.title}` : 'Nova aula'}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Slug *"                   value={editing.slug ?? ''}       onChange={v => setEditing(p => ({ ...p!, slug: v }))} />
            <Field label="Título *"                 value={editing.title ?? ''}      onChange={v => setEditing(p => ({ ...p!, title: v }))} />
            <Field label="URL do vídeo *"           value={editing.external_url ?? ''} onChange={v => setEditing(p => ({ ...p!, external_url: v }))} full hint={editing.external_url ? `Provedor detectado: ${detectVideoProvider(editing.external_url)}` : 'YouTube, Drive, Vimeo, Bunny ou .mp4'} />
            <Field label="Thumbnail URL (opcional)" value={editing.thumbnail_url ?? ''} onChange={v => setEditing(p => ({ ...p!, thumbnail_url: v }))} />
            <Field label="Instrutor"                value={editing.instructor ?? ''} onChange={v => setEditing(p => ({ ...p!, instructor: v }))} />
            <NumF  label="Duração (segundos)"       value={editing.duration_sec ?? 0} onChange={v => setEditing(p => ({ ...p!, duration_sec: v }))} />
            <NumF  label="Ordem"                    value={editing.order_index ?? 1} onChange={v => setEditing(p => ({ ...p!, order_index: v }))} />
            <NumF  label="XP"                       value={editing.xp_reward ?? 20}  onChange={v => setEditing(p => ({ ...p!, xp_reward: v }))} />
            <BoolF label="Só Pro"                   value={!!editing.is_pro_only}    onChange={v => setEditing(p => ({ ...p!, is_pro_only: v }))} />
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
              className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-full disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={() => setEditing(null)} className="text-xs font-semibold text-gray-500 hover:text-black px-4 py-2">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500">Nenhuma aula ainda. Crie a primeira.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-gray-400 bg-gray-50">
              <tr>
                <th className="text-left p-3 w-12">#</th>
                <th className="text-left p-3">Título</th>
                <th className="text-left p-3 hidden md:table-cell">Provedor</th>
                <th className="text-left p-3 hidden md:table-cell">XP</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l.id} className="border-t border-gray-100">
                  <td className="p-3 text-xs text-gray-400">{l.order_index}</td>
                  <td className="p-3">
                    <p className="font-semibold text-black truncate">{l.title}</p>
                    <p className="text-xs text-gray-400 truncate">{l.slug}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-gray-500">
                    {detectVideoProvider(l.external_url)}
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs font-bold">{l.xp_reward}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditing({ ...l })}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(l)}
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

function Field({ label, value, onChange, full, hint }: { label: string; value: string; onChange: (v: string) => void; full?: boolean; hint?: string }) {
  return (
    <label className={full ? 'block md:col-span-2' : 'block'}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:outline-none focus:border-black"
      />
      {hint && <span className="text-[10px] text-gray-400 mt-1 block">{hint}</span>}
    </label>
  )
}
function NumF({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
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
function BoolF({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 mt-4">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span className="text-xs font-semibold text-black">{label}</span>
    </label>
  )
}
