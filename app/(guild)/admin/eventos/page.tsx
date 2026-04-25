'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import {
  fetchAllEventsAdmin,
  upsertEvent,
  deleteEvent,
  type EventRow,
} from '@/lib/supabase/queries'

const BLANK: Partial<EventRow> = {
  title: '',
  description: '',
  starts_at: new Date().toISOString(),
  ends_at: null,
  location: '',
  join_url: null,
  kind: 'live',
  is_private: false,
  pro_only: false,
}

const KINDS: EventRow['kind'][] = ['mentoria', 'workshop', 'live', 'open']

export default function AdminEventosPage() {
  const [items, setItems] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<EventRow> | null>(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    const es = await fetchAllEventsAdmin()
    setItems(es)
    setLoading(false)
  }
  useEffect(() => { reload() }, [])

  async function save() {
    if (!editing?.title || !editing.starts_at) {
      setErr('Título e data de início são obrigatórios.')
      return
    }
    setSaving(true); setErr(null)
    try {
      await upsertEvent(editing as any)
      setEditing(null); reload()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  async function remove(e: EventRow) {
    if (!confirm(`Deletar evento "${e.title}"?`)) return
    try { await deleteEvent(e.id); reload() } catch (err: any) { alert(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-serif text-black">Eventos</h2>
          <p className="text-xs text-gray-500">Encontros ao vivo, mentorias, workshops.</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK })}
          className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800"
        >
          <Plus className="w-3.5 h-3.5" /> Novo evento
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-3">
            <F label="Título *" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p!, title: v }))} />
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tipo</span>
              <select value={editing.kind ?? 'live'} onChange={e => setEditing(p => ({ ...p!, kind: e.target.value as EventRow['kind'] }))}
                className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 bg-white focus:outline-none focus:border-black">
                {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            <F label="Início * (ISO)" value={toLocal(editing.starts_at)} onChange={v => setEditing(p => ({ ...p!, starts_at: fromLocal(v) }))} type="datetime-local" />
            <F label="Fim (opcional)"  value={toLocal(editing.ends_at)}   onChange={v => setEditing(p => ({ ...p!, ends_at: v ? fromLocal(v) : null }))} type="datetime-local" />
            <F label="Local"           value={editing.location ?? ''}     onChange={v => setEditing(p => ({ ...p!, location: v }))} />
            <F label="URL para entrar" value={editing.join_url ?? ''}     onChange={v => setEditing(p => ({ ...p!, join_url: v || null }))} />
            <B label="Privado"         value={!!editing.is_private}       onChange={v => setEditing(p => ({ ...p!, is_private: v }))} />
            <B label="Só Pro"          value={!!editing.pro_only}         onChange={v => setEditing(p => ({ ...p!, pro_only: v }))} />
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
            <button onClick={save} disabled={saving}
              className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full disabled:opacity-40">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={() => setEditing(null)} className="text-xs font-semibold text-gray-500 hover:text-black px-4 py-2">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="h-24 bg-white rounded-xl animate-pulse" />
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-sm text-gray-500">
          Nenhum evento.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-gray-400 bg-gray-50">
              <tr>
                <th className="text-left p-3">Evento</th>
                <th className="text-left p-3 hidden md:table-cell">Tipo</th>
                <th className="text-left p-3 hidden md:table-cell">Início</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(e => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <p className="font-semibold text-black">{e.title}</p>
                    <p className="text-xs text-gray-400 truncate">{e.location}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs">{e.kind}</td>
                  <td className="p-3 hidden md:table-cell text-xs">{new Date(e.starts_at).toLocaleString('pt-BR')}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setEditing({ ...e })} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black" title="Editar">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(e)} className="p-1.5 rounded-full hover:bg-red-50 text-red-500" title="Remover">
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

function toLocal(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function fromLocal(v: string): string {
  return new Date(v).toISOString()
}

function F({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:outline-none focus:border-black" />
    </label>
  )
}
function B({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 mt-4">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span className="text-xs font-semibold text-black">{label}</span>
    </label>
  )
}
