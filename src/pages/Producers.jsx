import { Link, useParams } from 'react-router-dom'
import { useApp } from '../store'
import { ArtisanCard, IndustryCard, ProductCard } from '../components/Cards'
import EnquiryForm from '../components/EnquiryForm'
import SmartImage from '../components/SmartImage'
import { DemoBadge, PhotoBackdrop, SectionTitle, bg } from '../components/UI'

function NotFound({ what, back }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">{what} not found</h1>
      <Link to={back} className="btn-primary mt-6">Go back</Link>
    </section>
  )
}

export function Artisans() {
  const { db } = useApp()
  return (
    <div className="relative">
      <PhotoBackdrop images={bg.heritage} overlay="bg-ivory/85" />
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        <SectionTitle eyebrow="Individual weavers" title="Artisan Profiles" sub="All profiles below are fictional Demo Profiles from Andhra Pradesh weaving areas. No personal contact details are shown." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {db.artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
        </div>
      </section>
    </div>
  )
}

export function ArtisanProfile() {
  const { id } = useParams()
  const { db } = useApp()
  const a = db.artisans.find((x) => x.id === id)
  if (!a) return <NotFound what="Artisan" back="/artisans" />
  const items = db.products.filter((p) => p.ownerType === 'artisan' && p.ownerId === a.id)
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <nav className="mb-6 text-sm"><Link to="/artisans" className="link">← All artisans</Link></nav>
      <div className="card gold-frame grid gap-8 p-6 md:grid-cols-3">
        <SmartImage src={a.image} alt={a.name} label={a.name} className="h-80 w-full rounded object-cover md:h-full" />
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold md:text-4xl">{a.name}</h1>
            {a.demo && <DemoBadge>Demo Profile</DemoBadge>}
          </div>
          <p className="mt-1 text-terracotta">{a.village}, {a.district} district, Andhra Pradesh</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div><dt className="font-semibold text-maroon">Specialization</dt><dd>{a.specialization}</dd></div>
            <div><dt className="font-semibold text-maroon">Products made</dt><dd>{a.productsMade}</dd></div>
            <div><dt className="font-semibold text-maroon">About</dt><dd>{a.bio}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-indigo/70">Fictional profile created for demonstration. Not a real person; no contact details are shown.</p>
        </div>
      </div>

      <div className="mt-12">
        <SectionTitle left title={`Products by ${a.name}`} />
        {items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : <p className="card p-6">No products listed yet.</p>}
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <EnquiryForm defaultTarget={`artisan:${a.id}`} heading={`Send an enquiry to ${a.name}`} />
      </div>
    </section>
  )
}

export function Industries() {
  const { db } = useApp()
  return (
    <div className="relative">
      <PhotoBackdrop images={bg.heritage} overlay="bg-ivory/85" />
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        <SectionTitle eyebrow="Producers & cooperatives" title="Small Industries" sub="Weaving units, textile manufacturers, silk businesses and cooperatives. All businesses are fictional Demo Data and are not verified." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {db.industries.map((i) => <IndustryCard key={i.id} industry={i} />)}
        </div>
        <div className="card mt-12 grid gap-4 p-6 text-center md:grid-cols-3">
          {[['Local employment', 'Small units give steady work to weavers, dyers and helpers close to home.'], ['Traditional production', 'Many units keep hand-operated looms and natural finishing alive.'], ['Wider reach', 'Online visibility helps small producers find customers beyond their town.']].map(([t, d]) => (
            <div key={t}><h3 className="text-lg font-bold">{t}</h3><p className="text-sm text-indigo/80">{d}</p></div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function IndustryDetails() {
  const { id } = useParams()
  const { db } = useApp()
  const i = db.industries.find((x) => x.id === id)
  if (!i) return <NotFound what="Industry" back="/industries" />
  const items = db.products.filter((p) => p.ownerType === 'industry' && p.ownerId === i.id)
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <nav className="mb-6 text-sm"><Link to="/industries" className="link">← All small industries</Link></nav>
      <div className="card gold-frame overflow-hidden">
        <SmartImage src={i.image} alt={i.name} label={i.name} className="h-64 w-full object-cover md:h-80" />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{i.type}</span>
            {i.demo && <DemoBadge />}
          </div>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{i.name}</h1>
          <p className="text-terracotta">{i.area}, {i.district} district, Andhra Pradesh</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div><h3 className="text-lg font-bold">About the business</h3><p className="text-sm">{i.description}</p></div>
            <div><h3 className="text-lg font-bold">Traditional production methods</h3><p className="text-sm">{i.methods}</p></div>
            <div><h3 className="text-lg font-bold">Products manufactured</h3><p className="text-sm">{i.productsMade}</p></div>
            <div><h3 className="text-lg font-bold">Local employment & craftsmanship</h3><p className="text-sm">{i.employment}</p></div>
          </div>
          <p className="mt-4 text-xs text-indigo/70">Fictional business shown as Demo Data. Not verified; no real contact details.</p>
        </div>
      </div>

      {i.gallery?.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {i.gallery.map((g, n) => <SmartImage key={n} src={g} alt={`${i.name} photo ${n + 1}`} label="Production photo" className="h-48 w-full rounded-lg border border-gold object-cover" />)}
        </div>
      )}

      <div className="mt-12">
        <SectionTitle left title="Manufactured products" />
        {items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : <p className="card p-6">No products listed yet.</p>}
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <EnquiryForm defaultTarget={`industry:${i.id}`} heading={`Send an enquiry to ${i.name}`} />
      </div>
    </section>
  )
}
