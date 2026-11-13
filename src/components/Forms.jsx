import { useState } from 'react'
import { useApp } from '../store'
import { CATEGORIES, INDUSTRY_TYPES, categoryKeyword, pic } from '../data/seed'
import { Field } from './UI'

// ---------- Product form (add / edit) ----------
// owner: {type, id} fixed for producers; if allowOwnerPick (admin) a selector is shown.
export function ProductForm({ initial, owner, allowOwnerPick = false, onSave, onCancel }) {
  const { db } = useApp()
  const [f, setF] = useState(
    initial ? { ...initial, image: Array.isArray(initial.image) ? '' : initial.image || '' } : { name: '', price: '', material: '', category: CATEGORIES[0], desc: '', image: '' }
  )
  const [ownerVal, setOwnerVal] = useState(initial ? `${initial.ownerType}:${initial.ownerId}` : owner ? `${owner.type}:${owner.id}` : '')
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 3) er.name = 'Product name is required.'
    if (!(Number(f.price) > 0)) er.price = 'Enter a price greater than 0.'
    if (!f.material.trim()) er.material = 'Material is required.'
    if (f.desc.trim().length < 10) er.desc = 'Description should be at least 10 characters.'
    if (!ownerVal) er.owner = 'Choose the producer.'
    setErr(er)
    if (Object.keys(er).length) return
    const [ownerType, ownerId] = ownerVal.split(':')
    const id = initial?.id || 'p' + Date.now()
    onSave({
      ...f,
      id,
      name: f.name.trim(),
      price: Number(f.price),
      material: f.material.trim(),
      desc: f.desc.trim(),
      details: initial?.details || `${f.desc.trim()} Added through the demo dashboard. Demo Data — cannot be purchased.`,
      ownerType,
      ownerId,
      image: f.image.trim() || initial?.image || pic(categoryKeyword[f.category] || 'handloom,textile', Math.floor(Math.random() * 900) + 100),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {allowOwnerPick && (
        <Field label="Producer" error={err.owner}>
          <select className="input" value={ownerVal} onChange={(e) => setOwnerVal(e.target.value)}>
            <option value="">Select producer…</option>
            <optgroup label="Artisans">{db.artisans.map((a) => <option key={a.id} value={`artisan:${a.id}`}>{a.name}</option>)}</optgroup>
            <optgroup label="Small industries">{db.industries.map((i) => <option key={i.id} value={`industry:${i.id}`}>{i.name}</option>)}</optgroup>
          </select>
        </Field>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" error={err.name}><input className="input" value={f.name} onChange={set('name')} /></Field>
        <Field label="Price (₹)" error={err.price}><input className="input" type="number" min="1" value={f.price} onChange={set('price')} /></Field>
        <Field label="Material" error={err.material}><input className="input" value={f.material} onChange={set('material')} placeholder="e.g. Handloom cotton" /></Field>
        <Field label="Category">
          <select className="input" value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
      </div>
      <Field label="Short description" error={err.desc}><textarea className="input min-h-[90px]" value={f.desc} onChange={set('desc')} /></Field>
      <Field label="Image URL (optional — a sample photo is used if empty)"><input className="input" value={f.image} onChange={set('image')} placeholder="https://… or /images/my-photo.jpg" /></Field>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary">{initial ? 'Save changes' : 'Add product'}</button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </form>
  )
}

// ---------- Profile form (artisan / industry) ----------
const ARTISAN_FIELDS = [
  { key: 'name', label: 'Name', req: true },
  { key: 'village', label: 'Village / area', req: true },
  { key: 'district', label: 'District', req: true },
  { key: 'specialization', label: 'Specialization', req: true },
  { key: 'productsMade', label: 'Products made', req: true },
  { key: 'bio', label: 'Short biography', type: 'textarea', req: true },
  { key: 'image', label: 'Photo URL (optional)' },
]
const INDUSTRY_FIELDS = [
  { key: 'name', label: 'Business name', req: true },
  { key: 'area', label: 'Village / town / area', req: true },
  { key: 'district', label: 'District', req: true },
  { key: 'type', label: 'Type of industry', type: 'select', options: INDUSTRY_TYPES },
  { key: 'productsMade', label: 'Products manufactured', req: true },
  { key: 'description', label: 'Business description', type: 'textarea', req: true },
  { key: 'methods', label: 'Traditional production methods', type: 'textarea', req: true },
  { key: 'employment', label: 'Local employment note' },
  { key: 'image', label: 'Photo URL (optional)' },
]

export function ProfileForm({ kind, initial, onSave, onCancel, saveLabel = 'Save profile' }) {
  const fields = kind === 'artisan' ? ARTISAN_FIELDS : INDUSTRY_FIELDS
  const [f, setF] = useState(
    initial || (kind === 'industry' ? { type: INDUSTRY_TYPES[0], gallery: [] } : {})
  )
  const [err, setErr] = useState({})
  const [saved, setSaved] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    fields.forEach((fl) => { if (fl.req && !(f[fl.key] || '').toString().trim()) er[fl.key] = `${fl.label} is required.` })
    setErr(er)
    if (Object.keys(er).length) return
    onSave({ ...f, id: initial?.id || (kind === 'artisan' ? 'a' : 'i') + Date.now(), demo: true })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((fl) => (
          <div key={fl.key} className={fl.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <Field label={fl.label} error={err[fl.key]}>
              {fl.type === 'textarea' ? (
                <textarea className="input min-h-[90px]" value={f[fl.key] || ''} onChange={(e) => setF({ ...f, [fl.key]: e.target.value })} />
              ) : fl.type === 'select' ? (
                <select className="input" value={f[fl.key] || ''} onChange={(e) => setF({ ...f, [fl.key]: e.target.value })}>
                  {fl.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input className="input" value={Array.isArray(f[fl.key]) ? '' : f[fl.key] || ''} onChange={(e) => setF({ ...f, [fl.key]: e.target.value })} />
              )}
            </Field>
          </div>
        ))}
      </div>
      <p className="text-xs text-indigo/70">Please do not enter phone numbers or private addresses. Profiles are labelled Demo Data.</p>
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary">{saveLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>}
        {saved && <span className="text-sm font-semibold text-peacock">Saved ✓</span>}
      </div>
    </form>
  )
}
