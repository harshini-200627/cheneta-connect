import { useState } from 'react'
import { useApp } from '../store'
import { Field } from './UI'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Saves enquiries to localStorage (demo). No phone number is collected.
// Props: product (optional) -> enquiry is sent to that product's producer.
//        defaultTarget (optional) -> "artisan:a1" / "industry:i1" preselects a producer.
export default function EnquiryForm({ product, defaultTarget = '', heading }) {
  const { db, session, addEnquiry } = useApp()
  const [form, setForm] = useState({
    name: session?.name?.replace(/ \(Demo.*\)$/, '') || '',
    email: session?.email || '',
    subject: product ? `Enquiry about ${product.name}` : '',
    message: '',
    target: defaultTarget,
  })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Please enter a valid email address.'
    if (form.subject.trim().length < 3) er.subject = 'Please enter a subject.'
    if (form.message.trim().length < 10) er.message = 'Message should be at least 10 characters.'
    setErrors(er)
    if (Object.keys(er).length) return

    let targetType = ''
    let targetId = ''
    if (product) { targetType = product.ownerType; targetId = product.ownerId }
    else if (form.target) [targetType, targetId] = form.target.split(':')

    addEnquiry({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      productId: product?.id || '',
      targetType,
      targetId,
    })
    setDone(true)
    setForm({ ...form, subject: product ? form.subject : '', message: '' })
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6" noValidate>
      {heading && <h3 className="text-2xl font-bold">{heading}</h3>}
      {done && (
        <div role="status" className="rounded-md border border-peacock bg-peacock/10 p-3 text-sm font-medium text-peacock">
          Thank you! Your enquiry was saved in this browser (demo). It is visible to the producer and in your dashboard.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input className="input" value={form.name} onChange={set('name')} placeholder="Your name" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
        </Field>
      </div>
      {!product && (
        <Field label="Enquire about (optional)">
          <select className="input" value={form.target} onChange={set('target')}>
            <option value="">General enquiry to Cheneta Connect</option>
            <optgroup label="Individual artisans (Demo)">
              {db.artisans.map((a) => <option key={a.id} value={`artisan:${a.id}`}>{a.name}, {a.village}</option>)}
            </optgroup>
            <optgroup label="Small industries (Demo)">
              {db.industries.map((i) => <option key={i.id} value={`industry:${i.id}`}>{i.name}</option>)}
            </optgroup>
          </select>
        </Field>
      )}
      <Field label="Subject" error={errors.subject}>
        <input className="input" value={form.subject} onChange={set('subject')} placeholder="What is your enquiry about?" />
      </Field>
      <Field label="Message" error={errors.message}>
        <textarea className="input min-h-[120px]" value={form.message} onChange={set('message')} placeholder="Write your message…" />
      </Field>
      <button type="submit" className="btn-primary">Submit Enquiry</button>
      <p className="text-xs text-indigo/70">Demo only: enquiries are stored in your browser's localStorage. No phone number is needed.</p>
    </form>
  )
}
