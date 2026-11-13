import { Link } from 'react-router-dom'
import { useApp, dashboardPath } from '../store'
import { DemoBadge, PhotoBackdrop, bg } from '../components/UI'

// Home page for artisans and small industries (admin goes straight to the dashboard).

const why = {
  artisan: [
    ['Be discovered', 'Customers browse artisans directly, so your work reaches people who value handloom.'],
    ['Your story, your name', 'Your profile shows your village, your speciality and the way you weave.'],
    ['Direct enquiries', 'Customers contact you through enquiries, and you reply from your dashboard.'],
    ['Heritage that lasts', 'Every listing helps keep traditional weaving alive for the next generation.'],
  ],
  industry: [
    ['Be discovered', 'Customers find small industries directly, so your unit gains visibility beyond your local market.'],
    ['Show your process', 'Your profile explains your production methods and the people who work with you.'],
    ['Direct enquiries', 'Customers and bulk buyers contact you through enquiries, and you reply from your dashboard.'],
    ['Local employment', 'Every sale supports weaving families and keeps traditional production going.'],
  ],
}

const steps = [
  ['Complete your profile', 'Add your location, speciality and story so customers know who you are.'],
  ['List your products', 'Add photos, prices, materials and a clear description for each product.'],
  ['Answer enquiries', 'Reply to customers from your dashboard and build lasting relationships.'],
]

const tipsFor = {
  artisan: [
    ['Add clear photos', 'Bright, close-up photos of your borders and pallu help customers trust your work.'],
    ['Describe the details', 'Mention the material, weaving technique and care instructions in every product.'],
    ['Reply to enquiries quickly', 'Customers who get a quick answer are more likely to come back.'],
    ['Complete your profile', 'Share your village, your speciality and your story so customers can connect with you.'],
  ],
  industry: [
    ['Show your process', 'Describe how your unit prepares yarn, weaves and finishes each piece.'],
    ['Keep products up to date', 'Remove sold-out items and add new designs regularly.'],
    ['Reply to enquiries quickly', 'Bulk and repeat customers value a fast, clear reply.'],
    ['Highlight local employment', 'Customers like to know that their purchase supports weaving families.'],
  ],
}

function Stat({ label, value, tone = 'border-t-maroon' }) {
  return (
    <div className={`card border-t-4 p-5 ${tone}`}>
      <p className="font-serif text-4xl font-bold text-maroon">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo/70">{label}</p>
    </div>
  )
}

export default function ProducerHome() {
  const { db, session } = useApp()
  const role = session.role === 'industry' ? 'industry' : 'artisan'
  const dash = dashboardPath(role)
  const col = role === 'artisan' ? 'artisans' : 'industries'

  const profile = db[col].find((x) => x.id === session.profileId)
  const myProducts = db.products.filter((p) => p.ownerType === role && p.ownerId === session.profileId)
  const myEnq = db.enquiries.filter((e) => e.targetType === role && e.targetId === session.profileId)
  const newEnq = myEnq.filter((e) => e.status === 'New').length

  const stats = [
    ['My products', myProducts.length, 'border-t-maroon'],
    ['Total enquiries', myEnq.length, 'border-t-gold'],
    ['New enquiries', newEnq, 'border-t-terracotta'],
  ]
  const actions = [
    ['Add a product', { tab: 'products' }],
    ['Reply to enquiries', { tab: 'enquiries' }],
    ['Edit my profile', { tab: 'profile' }],
  ]
  const roleLabel = role === 'artisan' ? 'Artisan' : 'Small Industry'

  return (
    <div className="relative">
      <PhotoBackdrop images={bg.home} />

      {/* WELCOME */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">{roleLabel} Home</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-maroon md:text-5xl">Welcome, {session.name}</h1>
        <div className="mx-auto my-4 h-1 w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="mx-auto max-w-2xl text-lg text-indigo">
          {profile ? `Manage ${profile.name}: ` : 'Manage '}your profile, products and customer enquiries. <DemoBadge>Demo Mode</DemoBadge>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {actions.map(([label, state], i) => (
            <Link key={label} to={dash} state={state} className={i === 0 ? 'btn-primary' : 'btn-outline bg-ivory/70'}>{label}</Link>
          ))}
        </div>
      </section>

      {/* YOUR NUMBERS */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(([label, value, tone]) => <Stat key={label} label={label} value={value} tone={tone} />)}
        </div>
      </section>

      {/* MISSION / TRUST */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="card gold-frame bg-ivory/90 p-8 text-center md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">Why we exist</p>
            <h2 className="mt-2 text-3xl font-bold text-maroon">Our Mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-indigo">
              Cheneta Connect is a digital platform that promotes traditional handloom products and connects customers with individual artisans and small-scale textile producers. It aims to improve product visibility, encourage appreciation of traditional craftsmanship and create better opportunities for local producers through technology.
            </p>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-6 text-center text-2xl font-bold text-maroon">Why producers choose Cheneta Connect</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why[role].map(([t, d], i) => (
            <div key={t} className="card card-hover border-l-4 border-l-maroon p-5">
              <span className="font-serif text-3xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="text-sm text-indigo/80">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 bg-ivory/55 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-6 text-center text-2xl font-bold text-maroon">How it works</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(([t, d], i) => (
              <div key={t} className="card p-5 text-center">
                <p className="text-xs font-bold text-terracotta">STEP {i + 1}</p>
                <h3 className="mt-1 text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-indigo/80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIPS */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-14">
        <h2 className="mb-6 text-center text-2xl font-bold text-maroon">Tips for growing your reach</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {tipsFor[role].map(([t, d]) => (
            <div key={t} className="card p-5">
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="text-sm text-indigo/80">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to={dash} className="btn-primary">Go to my dashboard</Link>
        </div>
      </section>
    </div>
  )
}