'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import {
  fetchAllMissionsAdmin,
  upsertMission,
  deleteMission,
  type Mission,
} from '@/lib/supabase/queries'

const BLANK: Partial<Mission> = {
  slug: '',
  title: '',
  description: '',
  icon: '⚔️',
  rarity: 'Bronze',
  xp_reward: 50,
  is_pro_only: false,
  queue_size: 0,
  is_active: true,
  sort_order: 100,
}

const RARITIES: Mission['rarity'][] = ['Bronze', 'Prata', 'Ouro', 'Lendário']
const XP_BY_RARITY: Record<Mission['rarity'], number> = {
  Bronze: 50, Prata: 150, Ouro: 500, 'Lendário': 1500,
}

export default function AdminMissoesPage() {
  const [items, setItems] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Mission> | null>(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    const ms = await fetchAllMissionsAdmin()
    setItems(ms)
    setLoading(false)
  }
  useEffect(() => { reload() }, [])

  async function save() {
    if (!editing?.slug || !editing.title) {
      setErr('Slug e título são obrigatórios.')
      return
    }
    setSaving(true); setErr(null)
    try {
      await upsertMission(editing as any)
      setEditing(null); reload()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  async function remove(m: Mission) {
    if (!confirm(`Deletar missão "${m.title}"?`)) return
    try { await deleteMission(m.id); reload() } catch (e: any) { alert(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-serif text-black">Missões</h2>
          <p className="text-xs text-gray-500">XP oficial: Bronze 50 / Prata 150 / Ouro 500 / Lendário 1500.</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK })}
          className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800"
        >
          <Plus className="w-3.5 h-3.5" /> Nova missão
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-3">
            <F label="Slug *" value={editing.slug ?? ''} onChange={v => setEditing(p => ({ ...p!, slug: v }))} />
            <F label="Título *" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p!, title: v }))} />
            <F label="Ícone (emoji)" value={editing.icon ?? ''} onChange={v => setEditing(p => ({ ...p!, icon: v }))} />
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Raridade</span>
              <select
                value={editing.rarity ?? 'Bronze'}
                onChange={e => {
                  const r = e.target.value as Mission['rarity']
                  setEditing(p => ({ ...p!, rarity: r, xp_reward: XP_BY_RARITY[r] }))
                }}
                className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 bg-white focus:outline-none focus:border-black"
              >
                {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <N label="XP reward"  value={editing.xp_reward ?? 50}   onChange={v => setEditing(p => ({ ...p!, xp_reward: v }))} />
            <N label="Sort order" value={editing.sort_order ?? 100} onChange={v => setEditing(p => ({ ...p!, sort_order: v }))} />
            <N label="Queue size" value={editing.queue_size ?? 0}   onChange={v => setEditing(p => ({ ...p!, queue_size: v }))} />
            <B label="Ativa"      value={!!editing.is_active}       onChange={v => setEditing(p => ({ ...p!, is_active: v }))} />
            <B label="Só Pro"     value={!!editing.is_pro_only}     onChange={v => setEditing(p => ({ ...p!, is_pro_only: v }))} />
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
          Nenhuma missão.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-gray-400 bg-gray-50">
              <tr>
                <th className="text-left p-3">Missão</th>
                <th className="text-left p-3 hidden md:table-cell">Raridade</th>
                <th className="text-left p-3 hidden md:table-cell">XP</th>
                <th className="text-left p-3 hidden md:table-cell">Ativa</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.icon}</span>
                      <div><p className="font-semibold text-black">{m.title}</p>
                        <p className="text-xs text-gray-400">{m.slug}</p></div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs">{m.rarity}</td>
                  <td className="p-3 hidden md:table-cell text-xs font-bold">{m.xp_reward}</td>
                  <td className="p-3 hidden md:table-cell text-xs">{m.is_active ? '✓' : '—'}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setEditing({ ...m })} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black" title="Editar">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(m)} className="p-1.5 rounded-full hover:bg-red-50 text-red-500" title="Remover">
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

function F({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:outline-none focus:border-black" />
    </label>
  )
}
function N({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
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
