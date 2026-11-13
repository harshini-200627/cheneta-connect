import { useState } from 'react'
import { useApp } from '../store'

// Background photos: tries your own file in /public/images/backgrounds first,
// then a Wikimedia Commons photo. If both fail, a woven pattern is drawn instead.
const commons = (file, w = 900) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`

const local = (name, list) => list.map((r, i) => [`/images/backgrounds/${name}-${i + 1}.jpg`, r])

// Handloom photos from Wikimedia Commons, chosen to suit what each role does.
const P = {
  chanderi: 'Silk_weaver_at_a_loom_in_Chanderi_village.jpg',
  silkWeaver: 'India_-_Faces_-_silk_weaver_(5208914424).jpg',
  assam: 'A_tribal_women_weaving_ethnic_handlooms_in_Assam.jpg',
  manual: 'A_traditional_manual_handloom.jpg',
  dohar: 'Handloom_Lungi_Weaving_at_Dohar.jpg',
  free: 'Free_Standing_Loom.jpg',
  dyeing: 'Cotton_dyeing_in_India.jpg',
  tant: 'Weaving_Tant_Saree_by_Handloom_-_2_Natun_Phulia_-_Nadia_2016-11-12_1795.JPG',
  kanchi: 'Kanchipuram_silk_sareer.JPG',
  h1: 'Handloom_1.jpg',
  h2: 'Handloom_2.jpg',
  h3: 'Handloom_3.jpg',
}

// Six photos per role. The same set is used on every page of that role.
const sets = {
  // visitors: the heritage of Indian handloom in general
  guest:    [P.chanderi, P.h1, P.dyeing, P.assam, P.free, P.manual],
  // customers: finished sarees and the craft behind them
  customer: [P.kanchi, P.tant, P.chanderi, P.h2, P.silkWeaver, P.h3],
  // artisans: individual weavers at their looms
  artisan:  [P.silkWeaver, P.assam, P.chanderi, P.h1, P.manual, P.dohar],
  // small industries: production, dyeing and weaving units
  industry: [P.dyeing, P.dohar, P.h3, P.free, P.h2, P.manual],
  // admin: an overview mix of the whole platform
  admin:    [P.chanderi, P.dyeing, P.tant, P.h1, P.dohar, P.kanchi],
}

// To use your own photos for a role, save them as /public/images/backgrounds/<role>-1.jpg ... -6.jpg
// (guest-1.jpg, customer-1.jpg, artisan-1.jpg, industry-1.jpg, admin-1.jpg).
const roleBg = Object.fromEntries(Object.entries(sets).map(([k, files]) => [k, local(k, files.map((f) => commons(f)))]))
// home / login / heritage are kept so older imports of bg.home etc. still work.
export const bg = { ...roleBg, home: roleBg.guest, login: roleBg.guest, heritage: roleBg.guest }

const roleKey = (role) => (role in sets ? role : 'guest')

// Decorative woven-pattern tile. Shown when no photo can load, so the background never looks empty.
const palettes = [
  ['#641B2E', '#8A2A40', '#C9A227'],
  ['#1F6F78', '#2A8F99', '#C9A227'],
  ['#B5532F', '#D1703F', '#F1E3B0'],
  ['#2C2F6B', '#43479A', '#C9A227'],
]
function WeaveTile({ seed = 0 }) {
  const [a, b, line] = palettes[seed % palettes.length]
  const id = `weave-tile-${seed}`
  return (
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill={a} />
          <rect width="12" height="12" fill={b} />
          <rect x="12" y="12" width="12" height="12" fill={b} />
          <path d="M0 12H24M12 0V24" stroke={line} strokeWidth="1.2" opacity="0.7" />
          <circle cx="6" cy="18" r="1.6" fill={line} opacity="0.8" />
          <circle cx="18" cy="6" r="1.6" fill={line} opacity="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

function BackdropImg({ src, seed = 0 }) {
  const list = Array.isArray(src) ? src : [src]
  const [i, setI] = useState(0)
  if (i >= list.length) return <WeaveTile seed={seed} />
  return <img key={list[i]} src={list[i]} alt="" onError={() => setI(i + 1)} className="h-full w-full object-cover" />
}

// Faded photographic background with a light ivory cover.
// The cover is kept light (60%) so the photos and patterns stay clearly visible; cards keep text readable.
// Each type of visitor (guest, customer, artisan, small industry, admin) has its own set, used on every page.
export function PhotoBackdrop({ images, fixed = false }) {
  const app = useApp()
  const key = roleKey(app?.session?.role)
  const list = bg[key] || images
  const tone = Math.max(0, Object.keys(sets).indexOf(key))
  const overlay = 'bg-ivory/60'
  return (
    <div
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 z-0 overflow-hidden weave pointer-events-none`}
      aria-hidden="true"
    >
      <div className="grid h-full w-full grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2">
        {list.map((s, i) => <BackdropImg key={`${key}-${i}`} src={s} seed={i + tone} />)}
      </div>
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  )
}

export function Divider() {
  return (
    <div className="my-3 flex items-center justify-center gap-3 text-gold" aria-hidden="true">
      <span className="h-px w-16 bg-gold" />
      <span>◆</span>
      <span className="h-px w-16 bg-gold" />
    </div>
  )
}

export function SectionTitle({ eyebrow, title, sub, left = false }) {
  return (
    <div className={`mb-8 ${left ? '' : 'text-center'} animate-fadeUp`}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">{eyebrow}</p>}
      <h2 className="mt-1 text-3xl font-bold md:text-4xl">{title}</h2>
      {!left && <Divider />}
      {sub && <p className={`mt-2 max-w-2xl text-indigo/80 ${left ? '' : 'mx-auto'}`}>{sub}</p>}
    </div>
  )
}

export function DemoBadge({ children = 'Demo Data' }) {
  return <span className="badge-demo">{children}</span>
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-gold/60 pb-3">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
            active === t.key ? 'bg-maroon text-ivory' : 'bg-white/70 text-maroon hover:bg-gold/30'
          }`}
        >
          {t.label}
          {t.count !== undefined && <span className="ml-1.5 rounded-full bg-gold/30 px-1.5 text-xs">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, error, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-maroon">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-700">{error}</span>}
    </label>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="card my-8 w-full max-w-2xl bg-ivory p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none text-maroon hover:text-terracotta" aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const rupees = (n) => '₹' + Number(n).toLocaleString('en-IN')