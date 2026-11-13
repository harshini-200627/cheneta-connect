import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useApp, dashboardPath } from '../store'
import { ArtisanCard, IndustryCard } from '../components/Cards'
import ProductBrowser from '../components/ProductBrowser'
import EnquiryForm from '../components/EnquiryForm'
import { ProductForm, ProfileForm } from '../components/Forms'
import SmartImage from '../components/SmartImage'
import { DemoBadge, Modal, SectionTitle, Tabs, rupees } from '../components/UI'

// ---------- Guard ----------
export function RequireRole({ role, children }) {
  const { session } = useApp()
  if (!session) return <Navigate to="/login" replace />
  if (session.role !== role) return <Navigate to={dashboardPath(session.role)} replace />
  return children
}

function DashHeader({ title, sub }) {
  const { session, logout } = useApp()
  return (
    <div className="card gold-frame mb-6 flex flex-wrap items-center justify-between gap-3 bg-ivory/95 p-5">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        <p className="text-sm text-indigo/80">{sub} <DemoBadge>Demo Mode</DemoBadge></p>
        <p className="text-xs text-indigo/60">Signed in as {session.email}</p>
      </div>
      <button onClick={logout} className="btn-primary btn-sm">Logout</button>
    </div>
  )
}

const dateStr = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function EnquiryList({ items, onStatus, onDelete, showTarget }) {
  const { db } = useApp()
  if (!items.length) return <p className="card p-6 text-center">No enquiries yet.</p>
  const targetName = (e) => {
    if (!e.targetType) return 'General (Cheneta Connect)'
    const list = e.targetType === 'artisan' ? db.artisans : db.industries
    return list.find((x) => x.id === e.targetId)?.name || 'Removed profile'
  }
  return (
    <div className="space-y-4">
      {[...items].sort((a, b) => b.date.localeCompare(a.date)).map((e) => {
        const prod = db.products.find((p) => p.id === e.productId)
        return (
          <div key={e.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">{e.subject}</h3>
                <p className="text-xs text-indigo/70">
                  From {e.name} ({e.email}) • {dateStr(e.date)}
                  {showTarget && <> • To: {targetName(e)}</>}
                  {prod && <> • Product: <Link className="link" to={`/products/${prod.id}`}>{prod.name}</Link></>}
                </p>
              </div>
              <span className={`badge ${e.status === 'New' ? '!bg-terracotta/15 !text-terracotta' : ''}`}>{e.status}</span>
            </div>
            <p className="mt-2 text-sm">{e.message}</p>
            {(onStatus || onDelete) && (
              <div className="mt-3 flex gap-2">
                {onStatus && <button className="btn-outline btn-sm" onClick={() => onStatus(e)}>{e.status === 'New' ? 'Mark as replied' : 'Mark as new'}</button>}
                {onDelete && <button className="btn-danger btn-sm" onClick={() => onDelete(e)}>Delete</button>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ProductTable({ products, onEdit, onDelete, showOwner }) {
  const { getOwner } = useApp()
  if (!products.length) return <p className="card p-6 text-center">No products yet. Use “Add product” to create one.</p>
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-maroon text-ivory">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            {showOwner && <th className="p-3">Producer</th>}
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-gold/40 hover:bg-gold/10">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <SmartImage src={p.image} alt={p.name} label="" className="h-12 w-12 rounded object-cover" />
                  <div><p className="font-semibold">{p.name}</p><p className="text-xs text-indigo/70">{p.material}</p></div>
                </div>
              </td>
              <td className="p-3">{p.category}</td>
              <td className="p-3 font-semibold">{rupees(p.price)}</td>
              {showOwner && <td className="p-3">{getOwner(p)?.name || '—'}</td>}
              <td className="p-3 text-right">
                <button className="btn-outline btn-sm mr-2" onClick={() => onEdit(p)}>Edit</button>
                <button className="btn-danger btn-sm" onClick={() => onDelete(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------- Customer ----------
function OrderList({ items }) {
  if (!items.length) {
    return (
      <div className="card p-6 text-center">
        <p>You have not placed any demo orders yet.</p>
        <Link to="/products" className="btn-primary mt-4">Browse products</Link>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {items.map((o) => (
        <div key={o.id} className="card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold">Order #{o.id.slice(1)}</h3>
              <p className="text-xs text-indigo/70">Placed on {dateStr(o.date)}</p>
            </div>
            <span className="badge">{o.status}</span>
          </div>
          <ul className="mt-3 divide-y divide-gold/30 text-sm">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 py-2">
                <span>{i.name} × {i.qty}</span>
                <span className="font-semibold">{rupees(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-right font-serif text-lg font-bold text-maroon">Total: {rupees(o.total)}</p>
          {o.shipping?.address && <p className="mt-1 text-xs text-indigo/70">Deliver to: {o.shipping.name}, {o.shipping.address}</p>}
        </div>
      ))}
    </div>
  )
}

export function CustomerDashboard() {
  const { db, session, favs, myOrders } = useApp()
  const location = useLocation()
  const [tab, setTab] = useState(location.state?.tab || 'browse')
  const mine = db.enquiries.filter((e) => e.email === session.email)
  const tabs = [
    { key: 'browse', label: 'Browse products' },
    { key: 'orders', label: 'My orders', count: myOrders.length },
    { key: 'favs', label: 'Favourites', count: favs.length },
    { key: 'artisans', label: 'Artisans' },
    { key: 'industries', label: 'Small industries' },
    { key: 'enquire', label: 'New enquiry' },
    { key: 'mine', label: 'My enquiries', count: mine.length },
  ]
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DashHeader title={`Welcome, ${session.name}`} sub="Customer Dashboard" />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'browse' && <ProductBrowser />}
      {tab === 'orders' && <OrderList items={myOrders} />}
      {tab === 'favs' && <ProductBrowser onlyFavourites />}
      {tab === 'artisans' && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{db.artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}</div>}
      {tab === 'industries' && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{db.industries.map((i) => <IndustryCard key={i.id} industry={i} />)}</div>}
      {tab === 'enquire' && <div className="mx-auto max-w-3xl"><EnquiryForm heading="Submit a product enquiry" /></div>}
      {tab === 'mine' && <EnquiryList items={mine} showTarget />}
    </section>
  )
}

// ---------- Artisan / Small Industry ----------
export function ProducerDashboard({ kind }) {
  const { db, session, upsert, remove } = useApp()
  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(null) // null | 'new' | product

  const col = kind === 'artisan' ? 'artisans' : 'industries'
  const profile = db[col].find((x) => x.id === session.profileId)
  const label = kind === 'artisan' ? 'Artisan' : 'Small Industry'

  if (!profile) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Profile not found</h1>
        <p className="mt-2">This demo profile was removed by the admin. Use “Reset demo data” in the footer to restore it.</p>
      </section>
    )
  }

  const myProducts = db.products.filter((p) => p.ownerType === kind && p.ownerId === profile.id)
  const myEnq = db.enquiries.filter((e) => e.targetType === kind && e.targetId === profile.id)
  const tabs = [
    { key: 'profile', label: 'My profile' },
    { key: 'products', label: 'My products', count: myProducts.length },
    { key: 'enquiries', label: 'Customer enquiries', count: myEnq.length },
  ]

  const where = kind === 'artisan' ? `${profile.village}, ${profile.district}` : `${profile.area}, ${profile.district}`

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DashHeader title={`${label} Dashboard`} sub={profile.name} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-4 lg:col-span-1">
            <SmartImage src={profile.image} alt={profile.name} label={profile.name} className="h-56 w-full rounded object-cover" />
            <h2 className="mt-3 text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-terracotta">{where}</p>
            <div className="mt-2"><DemoBadge>{kind === 'artisan' ? 'Demo Profile' : 'Demo Data'}</DemoBadge></div>
            <Link to={kind === 'artisan' ? `/artisans/${profile.id}` : `/industries/${profile.id}`} className="btn-outline btn-sm mt-4">View public page</Link>
          </div>
          <div className="card p-6 lg:col-span-2">
            <h3 className="mb-4 text-xl font-bold">Edit profile information</h3>
            <ProfileForm kind={kind} initial={profile} onSave={(v) => upsert(col, v)} />
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">My products</h2>
            <button className="btn-primary" onClick={() => setEditing('new')}>+ Add product</button>
          </div>
          <ProductTable
            products={myProducts}
            onEdit={setEditing}
            onDelete={(p) => { if (window.confirm(`Delete "${p.name}"?`)) remove('products', p.id) }}
          />
        </div>
      )}

      {tab === 'enquiries' && (
        <EnquiryList
          items={myEnq}
          onStatus={(e) => upsert('enquiries', { ...e, status: e.status === 'New' ? 'Replied' : 'New' })}
        />
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Add product' : 'Edit product'} onClose={() => setEditing(null)}>
          <ProductForm
            initial={editing === 'new' ? null : editing}
            owner={{ type: kind, id: profile.id }}
            onSave={(p) => { upsert('products', p); setEditing(null) }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </section>
  )
}

// ---------- Admin ----------
function Stat({ label, value, tone = 'maroon' }) {
  const tones = { maroon: 'border-t-maroon', gold: 'border-t-gold', peacock: 'border-t-peacock', terracotta: 'border-t-terracotta', indigo: 'border-t-indigo' }
  return (
    <div className={`card border-t-4 p-5 ${tones[tone]}`}>
      <p className="font-serif text-4xl font-bold text-maroon">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo/70">{label}</p>
    </div>
  )
}

function ProfileTable({ kind, items, onEdit, onDelete }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-maroon text-ivory">
          <tr><th className="p-3">Name</th><th className="p-3">Location</th><th className="p-3">{kind === 'artisan' ? 'Specialization' : 'Type'}</th><th className="p-3 text-right">Actions</th></tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.id} className="border-t border-gold/40 hover:bg-gold/10">
              <td className="p-3 font-semibold">{x.name}</td>
              <td className="p-3">{kind === 'artisan' ? x.village : x.area}, {x.district}</td>
              <td className="p-3">{kind === 'artisan' ? x.specialization : x.type}</td>
              <td className="p-3 text-right">
                <button className="btn-outline btn-sm mr-2" onClick={() => onEdit(x)}>Edit</button>
                <button className="btn-danger btn-sm" onClick={() => onDelete(x)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdminDashboard() {
  const { db, upsert, remove, removeProducer } = useApp()
  const [tab, setTab] = useState('overview')
  const [prodEdit, setProdEdit] = useState(null)
  const [profEdit, setProfEdit] = useState(null) // {kind, item|null}

  const customers = [...db.customers, ...db.users.filter((u) => u.role === 'customer').map((u) => ({ email: u.email, name: u.name }))]
  const newEnq = db.enquiries.filter((e) => e.status === 'New').length

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'products', label: 'Products', count: db.products.length },
    { key: 'artisans', label: 'Artisans', count: db.artisans.length },
    { key: 'industries', label: 'Small industries', count: db.industries.length },
    { key: 'enquiries', label: 'Enquiries', count: db.enquiries.length },
    { key: 'customers', label: 'Customers', count: customers.length },
  ]

  const byCat = db.products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})
  const maxCat = Math.max(1, ...Object.values(byCat))

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DashHeader title="Admin Dashboard" sub="Platform overview and management" />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Total products" value={db.products.length} />
            <Stat label="Demo artisans" value={db.artisans.length} tone="gold" />
            <Stat label="Small industries" value={db.industries.length} tone="peacock" />
            <Stat label="Customers" value={customers.length} tone="indigo" />
            <Stat label="New enquiries" value={newEnq} tone="terracotta" />
          </div>
          <div className="card mt-6 p-6">
            <h3 className="mb-4 text-xl font-bold">Products by category</h3>
            <div className="space-y-3">
              {Object.entries(byCat).map(([c, n]) => (
                <div key={c} className="flex items-center gap-3 text-sm">
                  <span className="w-44 shrink-0">{c}</span>
                  <div className="h-5 flex-1 rounded bg-ivory-dark"><div className="h-5 rounded bg-gradient-to-r from-maroon to-gold" style={{ width: `${(n / maxCat) * 100}%` }} /></div>
                  <span className="w-6 text-right font-semibold">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Manage products</h2>
            <button className="btn-primary" onClick={() => setProdEdit('new')}>+ Add product</button>
          </div>
          <ProductTable
            showOwner
            products={db.products}
            onEdit={setProdEdit}
            onDelete={(p) => { if (window.confirm(`Delete "${p.name}"?`)) remove('products', p.id) }}
          />
        </div>
      )}

      {tab === 'artisans' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Manage artisan profiles</h2>
            <button className="btn-primary" onClick={() => setProfEdit({ kind: 'artisan', item: null })}>+ Add artisan</button>
          </div>
          <ProfileTable
            kind="artisan"
            items={db.artisans}
            onEdit={(item) => setProfEdit({ kind: 'artisan', item })}
            onDelete={(x) => { if (window.confirm(`Delete ${x.name} and all their products?`)) removeProducer('artisan', x.id) }}
          />
        </div>
      )}

      {tab === 'industries' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Manage small industry profiles</h2>
            <button className="btn-primary" onClick={() => setProfEdit({ kind: 'industry', item: null })}>+ Add industry</button>
          </div>
          <ProfileTable
            kind="industry"
            items={db.industries}
            onEdit={(item) => setProfEdit({ kind: 'industry', item })}
            onDelete={(x) => { if (window.confirm(`Delete ${x.name} and all its products?`)) removeProducer('industry', x.id) }}
          />
        </div>
      )}

      {tab === 'enquiries' && (
        <EnquiryList
          showTarget
          items={db.enquiries}
          onStatus={(e) => upsert('enquiries', { ...e, status: e.status === 'New' ? 'Replied' : 'New' })}
          onDelete={(e) => { if (window.confirm('Delete this enquiry?')) remove('enquiries', e.id) }}
        />
      )}

      {tab === 'customers' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-maroon text-ivory"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Enquiries</th><th className="p-3">Favourites</th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email} className="border-t border-gold/40">
                  <td className="p-3 font-semibold">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{db.enquiries.filter((e) => e.email === c.email).length}</td>
                  <td className="p-3">{(db.favs[c.email] || []).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {prodEdit && (
        <Modal title={prodEdit === 'new' ? 'Add product' : 'Edit product'} onClose={() => setProdEdit(null)}>
          <ProductForm
            allowOwnerPick
            initial={prodEdit === 'new' ? null : prodEdit}
            onSave={(p) => { upsert('products', p); setProdEdit(null) }}
            onCancel={() => setProdEdit(null)}
          />
        </Modal>
      )}

      {profEdit && (
        <Modal title={`${profEdit.item ? 'Edit' : 'Add'} ${profEdit.kind === 'artisan' ? 'artisan' : 'small industry'}`} onClose={() => setProfEdit(null)}>
          <ProfileForm
            kind={profEdit.kind}
            initial={profEdit.item}
            saveLabel={profEdit.item ? 'Save changes' : 'Add profile'}
            onSave={(v) => { upsert(profEdit.kind === 'artisan' ? 'artisans' : 'industries', v); setProfEdit(null) }}
            onCancel={() => setProfEdit(null)}
          />
        </Modal>
      )}
    </section>
  )
}