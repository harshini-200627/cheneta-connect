import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp, dashboardPath } from '../store'
import { DEMO_ACCOUNTS } from '../data/seed'
import { Field, PhotoBackdrop, bg } from '../components/UI'

const ROLES = [
  { key: 'customer', label: 'Customer' },
  { key: 'artisan', label: 'Artisan' },
  { key: 'industry', label: 'Small Industry' },
  { key: 'admin', label: 'Admin' },
]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RoleTabs({ roles, role, setRole }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist">
      {roles.map((r) => (
        <button
          key={r.key}
          type="button"
          role="tab"
          aria-selected={role === r.key}
          onClick={() => setRole(r.key)}
          className={`rounded-md border px-2 py-2 text-xs font-semibold transition ${role === r.key ? 'border-maroon bg-maroon text-ivory' : 'border-gold bg-white/80 text-maroon hover:bg-gold/30'}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input className="input pr-16" type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} autoComplete="off" />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-maroon hover:text-terracotta" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

function AuthShell({ title, children }) {
  return (
    <div className="relative min-h-[80vh]">
      <PhotoBackdrop images={bg.login} overlay="bg-ivory/70" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-8 px-4 py-12 lg:grid-cols-2">
        <div className="card gold-frame bg-ivory/95 p-6 md:p-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mb-4 mt-1 rounded-md border border-terracotta/40 bg-terracotta/10 p-2 text-xs text-terracotta">
            <strong>Demo Mode:</strong> this is a frontend-only demonstration, not secure authentication. Never enter a real password.
          </p>
          {children}
        </div>
        <div className="hidden lg:block">
          <div className="card bg-maroon/90 p-8 text-ivory" style={{ background: 'linear-gradient(135deg,rgba(100,27,46,.95),rgba(74,18,34,.95))' }}>
            <h2 className="text-3xl font-bold text-gold-light">Welcome to Cheneta Connect</h2>
            <p className="mt-3 text-ivory/90">Customers explore and enquire, artisans and small industries manage their products, and admins oversee the platform — all with demo data stored in your browser.</p>
            <ul className="mt-5 space-y-2 text-sm text-ivory/90">
              <li>◆ Browse and favourite handloom products</li>
              <li>◆ Manage products and profiles as a producer</li>
              <li>◆ Track customer enquiries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Login() {
  const { login, session } = useApp()
  const nav = useNavigate()
  const [role, setRole] = useState('customer')
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState({})
  const [formErr, setFormErr] = useState('')

  if (session) return <Navigate to={dashboardPath(session.role)} replace />

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!EMAIL_RE.test(f.email.trim())) er.email = 'Enter a valid email address.'
    if (f.password.length < 6) er.password = 'Password must be at least 6 characters.'
    setErr(er)
    setFormErr('')
    if (Object.keys(er).length) return
    const res = login(f.email, f.password, role)
    if (!res.ok) return setFormErr(res.error)
    nav(dashboardPath(res.role))
  }

  const fill = (a) => { setRole(a.role); setF({ email: a.email, password: a.password }); setErr({}); setFormErr('') }

  return (
    <AuthShell title="Login">
      <RoleTabs roles={ROLES} role={role} setRole={setRole} />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" error={err.email}>
          <input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
        </Field>
        <Field label="Password" error={err.password}>
          <PasswordInput value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="Your password" />
        </Field>
        {formErr && <p role="alert" className="rounded-md border border-red-700 bg-red-50 p-2 text-sm font-medium text-red-800">{formErr}</p>}
        <button type="submit" className="btn-primary w-full">Login as {ROLES.find((r) => r.key === role).label}</button>
        <p className="text-center text-sm">New here? <Link to="/signup" className="link">Create a demo account</Link></p>
      </form>

      <div className="mt-6 rounded-lg border border-gold bg-white/70 p-4">
        <h3 className="font-serif text-lg font-bold">Demo Login</h3>
        <p className="mb-3 text-xs text-indigo/70">Click “Use” to fill the form with the demo credentials.</p>
        <ul className="space-y-2 text-xs">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.role} className="flex items-center justify-between gap-2 rounded-md bg-ivory/80 p-2">
              <span>
                <strong className="capitalize text-maroon">{a.role === 'industry' ? 'Small Industry' : a.role}</strong><br />
                {a.email} / {a.password}
              </span>
              <button type="button" onClick={() => fill(a)} className="btn-gold btn-sm">Use</button>
            </li>
          ))}
        </ul>
      </div>
    </AuthShell>
  )
}

export function Signup() {
  const { signup, session } = useApp()
  const nav = useNavigate()
  const [role, setRole] = useState('customer')
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [err, setErr] = useState({})
  const [formErr, setFormErr] = useState('')

  if (session) return <Navigate to={dashboardPath(session.role)} replace />

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter your name.'
    if (!EMAIL_RE.test(f.email.trim())) er.email = 'Enter a valid email address.'
    if (f.password.length < 6) er.password = 'Password must be at least 6 characters.'
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.'
    setErr(er)
    setFormErr('')
    if (Object.keys(er).length) return
    const res = signup({ name: f.name.trim(), email: f.email, password: f.password, role })
    if (!res.ok) return setFormErr(res.error)
    nav(dashboardPath(res.role))
  }

  return (
    <AuthShell title="Signup">
      <RoleTabs roles={ROLES.slice(0, 3)} role={role} setRole={setRole} />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label={role === 'customer' ? 'Your name' : role === 'artisan' ? 'Artisan name' : 'Business name'} error={err.name}>
          <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </Field>
        <Field label="Email" error={err.email}>
          <input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </Field>
        <Field label="Password" error={err.password}>
          <PasswordInput value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="At least 6 characters" />
        </Field>
        <Field label="Confirm password" error={err.confirm}>
          <PasswordInput value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} placeholder="Repeat password" />
        </Field>
        {formErr && <p role="alert" className="rounded-md border border-red-700 bg-red-50 p-2 text-sm font-medium text-red-800">{formErr}</p>}
        <button type="submit" className="btn-primary w-full">Create demo account</button>
        <p className="text-center text-xs text-indigo/70">Admin accounts cannot be created — use the demo admin login. Accounts are stored only in this browser.</p>
        <p className="text-center text-sm">Already have an account? <Link to="/login" className="link">Login</Link></p>
      </form>
    </AuthShell>
  )
}
