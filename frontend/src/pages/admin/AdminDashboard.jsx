import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import jcLogo from '../../assets/jc-logo.png'

// ─── Helpers ────────────────────────────────────────────────────────────────

function authFetch(url, options = {}, token) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
}

async function apiFetch(url, token) {
  const res = await authFetch(url, {}, token)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return res.json()
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

async function parseError(res) {
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    return data.error ?? data.message ?? text
  } catch {
    return text || 'Something went wrong'
  }
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="3 6 5 6 21 6" />
      <path strokeLinecap="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path strokeLinecap="round" d="M10 11v6M14 11v6" />
      <path strokeLinecap="round" d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// ─── Success banner ───────────────────────────────────────────────────────────

function SuccessBanner({ message }) {
  if (!message) return null
  return (
    <div role="status" className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg animate-in fade-in duration-200">
      <CheckIcon />
      {message}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Form field helper ────────────────────────────────────────────────────────

function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

const inputClass = `border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
  focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent w-full`

const selectClass = `border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white
  focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent w-full`

// ─── Table wrapper ────────────────────────────────────────────────────────────

function AdminTable({ columns, children, isEmpty, emptyLabel }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-green-700 text-xs uppercase tracking-wider">
            {columns.map(col => <th key={col} scope="col" className="px-4 py-3">{col}</th>)}
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty
            ? <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">{emptyLabel}</td></tr>
            : children
          }
        </tbody>
      </table>
    </div>
  )
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <td className="px-4 py-3 text-right">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onEdit}
          aria-label="Edit"
          className="text-gray-500 hover:text-green-700 transition-colors p-1 rounded
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        >
          <PencilIcon />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete"
          className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          <TrashIcon />
        </button>
      </div>
    </td>
  )
}

// ─── Athlete tab ──────────────────────────────────────────────────────────────

const EMPTY_ATHLETE = { name: '', grade: '', personal_record: '' }

function AthletesTab({ token }) {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null) // { mode: 'add'|'edit', item }
  const [form, setForm] = useState(EMPTY_ATHLETE)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { data: athletes = [], isPending } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => apiFetch('/api/athletes', token),
  })

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const isEdit = modal?.mode === 'edit'
      const url = isEdit ? `/api/athletes/${modal.item.id}` : '/api/athletes'
      const res = await authFetch(url, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(data) }, token)
      if (!res.ok) throw new Error(await parseError(res))
      return isEdit ? 'updated' : 'added'
    },
    onSuccess: (action) => {
      qc.invalidateQueries({ queryKey: ['athletes'] })
      closeModal()
      setSuccessMsg(`Athlete ${action} successfully.`)
      setTimeout(() => setSuccessMsg(''), 4000)
    },
    onError: (err) => setFormError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await authFetch(`/api/athletes/${id}`, { method: 'DELETE' }, token)
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['athletes'] }),
  })

  function openAdd() { setForm(EMPTY_ATHLETE); setFormError(''); setModal({ mode: 'add' }) }
  function openEdit(item) { setForm({ name: item.name, grade: item.grade, personal_record: item.personal_record }); setFormError(''); setModal({ mode: 'edit', item }) }
  function closeModal() { setModal(null) }

  function handleDelete(item) {
    if (window.confirm(`Delete ${item.name}? This cannot be undone.`)) {
      deleteMutation.mutate(item.id)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    saveMutation.mutate({
      ...form,
      grade: form.grade !== '' ? Number(form.grade) : null,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Athletes</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg
                     hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          <PlusIcon /> Add Athlete
        </button>
      </div>
      <SuccessBanner message={successMsg} />

      {isPending
        ? <TableSkeleton cols={3} />
        : (
          <AdminTable columns={['Name', 'Grade', '5K PR']} isEmpty={athletes.length === 0} emptyLabel="No athletes yet.">
            {athletes.map(a => (
              <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                <td className="px-4 py-3 text-gray-600">{a.grade}</td>
                <td className="px-4 py-3 text-green-700 font-medium">{a.personal_record ?? '—'}</td>
                <ActionButtons onEdit={() => openEdit(a)} onDelete={() => handleDelete(a)} />
              </tr>
            ))}
          </AdminTable>
        )
      }

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Athlete' : 'Edit Athlete'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && <p role="alert" className="text-red-600 text-sm">{formError}</p>}
            <Field label="Name" id="a-name">
              <input id="a-name" type="text" required className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Grade" id="a-grade">
              <input id="a-grade" type="number" min="9" max="12" required className={inputClass} value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} />
            </Field>
            <Field label="5K PR (e.g. 18:45)" id="a-pr">
              <input id="a-pr" type="text" className={inputClass} placeholder="18:45" value={form.personal_record} onChange={e => setForm(f => ({ ...f, personal_record: e.target.value }))} />
            </Field>
            <ModalActions onCancel={closeModal} isPending={saveMutation.isPending} />
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Meets tab ────────────────────────────────────────────────────────────────

const EMPTY_MEET = { name: '', date: '', location: '' }

function MeetsTab({ token }) {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_MEET)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { data: meets = [], isPending } = useQuery({
    queryKey: ['meets'],
    queryFn: () => apiFetch('/api/meets', token),
  })

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const isEdit = modal?.mode === 'edit'
      const url = isEdit ? `/api/meets/${modal.item.id}` : '/api/meets'
      const res = await authFetch(url, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(data) }, token)
      if (!res.ok) throw new Error(await parseError(res))
      return isEdit ? 'updated' : 'added'
    },
    onSuccess: (action) => {
      qc.invalidateQueries({ queryKey: ['meets'] })
      closeModal()
      setSuccessMsg(`Meet ${action} successfully.`)
      setTimeout(() => setSuccessMsg(''), 4000)
    },
    onError: (err) => setFormError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await authFetch(`/api/meets/${id}`, { method: 'DELETE' }, token)
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['meets'] }),
  })

  function openAdd() { setForm(EMPTY_MEET); setFormError(''); setModal({ mode: 'add' }) }
  function openEdit(item) { setForm({ name: item.name, date: item.date, location: item.location }); setFormError(''); setModal({ mode: 'edit', item }) }
  function closeModal() { setModal(null) }

  function handleDelete(item) {
    if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(item.id)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    saveMutation.mutate(form)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Meets</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg
                     hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          <PlusIcon /> Add Meet
        </button>
      </div>
      <SuccessBanner message={successMsg} />

      {isPending
        ? <TableSkeleton cols={3} />
        : (
          <AdminTable columns={['Name', 'Date', 'Location']} isEmpty={meets.length === 0} emptyLabel="No meets yet.">
            {meets.map(m => (
              <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-3 text-gray-600">{m.date}</td>
                <td className="px-4 py-3 text-gray-600">{m.location}</td>
                <ActionButtons onEdit={() => openEdit(m)} onDelete={() => handleDelete(m)} />
              </tr>
            ))}
          </AdminTable>
        )
      }

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Meet' : 'Edit Meet'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && <p role="alert" className="text-red-600 text-sm">{formError}</p>}
            <Field label="Meet Name" id="m-name">
              <input id="m-name" type="text" required className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Date" id="m-date">
              <input id="m-date" type="date" required className={inputClass} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </Field>
            <Field label="Location" id="m-location">
              <input id="m-location" type="text" required className={inputClass} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </Field>
            <ModalActions onCancel={closeModal} isPending={saveMutation.isPending} />
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Results tab ──────────────────────────────────────────────────────────────

const EMPTY_RESULT = { athleteId: '', meetId: '', place: '', time: '' }

function ResultsTab({ token }) {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_RESULT)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { data: results  = [], isPending: rPending } = useQuery({ queryKey: ['results'],  queryFn: () => apiFetch('/api/results', token) })
  const { data: athletes = [] }                       = useQuery({ queryKey: ['athletes'], queryFn: () => apiFetch('/api/athletes', token) })
  const { data: meets    = [] }                       = useQuery({ queryKey: ['meets'],    queryFn: () => apiFetch('/api/meets', token) })

  const athleteMap = Object.fromEntries(athletes.map(a => [String(a.id), a.name]))
  const meetMap    = Object.fromEntries(meets.map(m => [String(m.id), m.name]))

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const isEdit = modal?.mode === 'edit'
      const url = isEdit ? `/api/results/${modal.item.id}` : '/api/results'
      const res = await authFetch(url, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(data) }, token)
      if (!res.ok) throw new Error(await parseError(res))
      return isEdit ? 'updated' : 'added'
    },
    onSuccess: (action) => {
      qc.invalidateQueries({ queryKey: ['results'] })
      closeModal()
      setSuccessMsg(`Result ${action} successfully.`)
      setTimeout(() => setSuccessMsg(''), 4000)
    },
    onError: (err) => setFormError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await authFetch(`/api/results/${id}`, { method: 'DELETE' }, token)
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['results'] }),
  })

  function openAdd() { setForm(EMPTY_RESULT); setFormError(''); setModal({ mode: 'add' }) }
  function openEdit(item) {
    setForm({ athleteId: String(item.athleteId), meetId: String(item.meetId), place: item.place ?? '', time: item.time ?? '' })
    setFormError('')
    setModal({ mode: 'edit', item })
  }
  function closeModal() { setModal(null) }

  function handleDelete(item) {
    if (window.confirm('Delete this result? This cannot be undone.')) {
      deleteMutation.mutate(item.id)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    saveMutation.mutate({ ...form, athleteId: Number(form.athleteId), meetId: Number(form.meetId), place: form.place ? Number(form.place) : null })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Results</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg
                     hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          <PlusIcon /> Add Result
        </button>
      </div>
      <SuccessBanner message={successMsg} />

      {rPending
        ? <TableSkeleton cols={4} />
        : (
          <AdminTable columns={['Athlete', 'Meet', 'Place', 'Time']} isEmpty={results.length === 0} emptyLabel="No results yet.">
            {results.map(r => (
              <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{athleteMap[String(r.athleteId)] ?? `#${r.athleteId}`}</td>
                <td className="px-4 py-3 text-gray-600">{meetMap[String(r.meetId)] ?? `#${r.meetId}`}</td>
                <td className="px-4 py-3 text-green-700 font-semibold">{r.place ?? '—'}</td>
                <td className="px-4 py-3 text-green-700 font-semibold">{r.time ?? '—'}</td>
                <ActionButtons onEdit={() => openEdit(r)} onDelete={() => handleDelete(r)} />
              </tr>
            ))}
          </AdminTable>
        )
      }

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Result' : 'Edit Result'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && <p role="alert" className="text-red-600 text-sm">{formError}</p>}
            <Field label="Athlete" id="r-athlete">
              <select id="r-athlete" required className={selectClass} value={form.athleteId} onChange={e => setForm(f => ({ ...f, athleteId: e.target.value }))}>
                <option value="">Select athlete…</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="Meet" id="r-meet">
              <select id="r-meet" required className={selectClass} value={form.meetId} onChange={e => setForm(f => ({ ...f, meetId: e.target.value }))}>
                <option value="">Select meet…</option>
                {meets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Place" id="r-place">
                <input id="r-place" type="number" min="1" className={inputClass} value={form.place} onChange={e => setForm(f => ({ ...f, place: e.target.value }))} />
              </Field>
              <Field label="Time (e.g. 18:45)" id="r-time">
                <input id="r-time" type="text" className={inputClass} placeholder="18:45" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </Field>
            </div>
            <ModalActions onCancel={closeModal} isPending={saveMutation.isPending} />
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Shared: table skeleton + modal actions ───────────────────────────────────

function TableSkeleton({ cols }) {
  return (
    <div aria-hidden="true" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-6">
        {Array.from({ length: cols + 1 }).map((_, i) => <div key={i} className="h-3 bg-gray-200 rounded w-20" />)}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-t border-gray-100 px-4 py-3 flex gap-6">
          {Array.from({ length: cols + 1 }).map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded w-24" />)}
        </div>
      ))}
    </div>
  )
}

function ModalActions({ onCancel, isPending }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg
                   hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg
                   hover:bg-green-700 disabled:opacity-60 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
      >
        {isPending ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}

// ─── Admin Dashboard (main) ───────────────────────────────────────────────────

const TABS = ['Athletes', 'Meets', 'Results']

function AdminDashboard() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Athletes')

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-green-950 border-b border-green-900 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={jcLogo} alt="" aria-hidden="true" className="w-8 h-8 object-contain" />
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Jones County XC</p>
            <p className="text-green-400 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-green-300 hover:text-white text-sm font-medium transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded px-2 py-1"
          >
            ← View site
          </a>
          <button
            onClick={handleLogout}
            className="text-green-300 hover:text-white text-sm font-medium transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded px-2 py-1"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav aria-label="Admin sections" className="flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600
                ${activeTab === tab
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {activeTab === 'Athletes' && <AthletesTab token={token} />}
        {activeTab === 'Meets'    && <MeetsTab    token={token} />}
        {activeTab === 'Results'  && <ResultsTab  token={token} />}
      </main>
    </div>
  )
}

export default AdminDashboard
