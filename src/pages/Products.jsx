import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../store'
import ProductBrowser from '../components/ProductBrowser'
import { FavButton, ProductCard } from '../components/Cards'
import EnquiryForm from '../components/EnquiryForm'
import SmartImage from '../components/SmartImage'
import { DemoBadge, SectionTitle, rupees } from '../components/UI'

export function Products() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle eyebrow="Catalogue" title="Handloom Products" sub="Browse sarees, fabrics and accessories from demo artisans and small industries." />
      <ProductBrowser />
    </section>
  )
}

export function ProductDetails() {
  const { id } = useParams()
  const { db, getOwner, addToCart } = useApp()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const product = db.products.find((p) => p.id === id)

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <p className="mt-2">This product may have been removed.</p>
        <Link to="/products" className="btn-primary mt-6">Back to products</Link>
      </section>
    )
  }

  const owner = getOwner(product)
  const ownerPath = product.ownerType === 'artisan' ? `/artisans/${product.ownerId}` : `/industries/${product.ownerId}`
  const related = db.products.filter((p) => p.id !== product.id && (p.category === product.category || p.ownerId === product.ownerId)).slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <nav className="mb-6 text-sm text-indigo/80">
        <Link to="/" className="link">Home</Link> / <Link to="/products" className="link">Products</Link> / {product.name}
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card gold-frame relative overflow-hidden p-2">
          <SmartImage src={product.image} alt={product.name} className="aspect-square w-full rounded object-cover" />
          <FavButton id={product.id} className="absolute right-5 top-5" />
        </div>
        <div>
          <div className="flex flex-wrap gap-2"><span className="badge">{product.category}</span><DemoBadge /></div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">{product.name}</h1>
          <p className="mt-3 font-serif text-3xl font-bold text-terracotta">{rupees(product.price)}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="card p-3"><dt className="text-xs font-semibold uppercase text-terracotta">Material</dt><dd className="font-semibold">{product.material}</dd></div>
            <div className="card p-3"><dt className="text-xs font-semibold uppercase text-terracotta">Category</dt><dd className="font-semibold">{product.category}</dd></div>
            <div className="card col-span-2 p-3">
              <dt className="text-xs font-semibold uppercase text-terracotta">Made by</dt>
              <dd className="font-semibold">
                {owner ? <Link to={ownerPath} className="link">{owner.name}</Link> : 'Unknown producer'}{' '}
                <span className="font-normal text-indigo/70">({product.ownerType === 'artisan' ? 'Individual artisan' : 'Small industry'})</span>
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-indigo">{product.details || product.desc}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded border border-gold">
              <button className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn-primary" onClick={() => { addToCart(product.id, qty); setAdded(true) }}>Add to cart</button>
            {added && <Link to="/cart" className="btn-gold">Go to cart</Link>}
          </div>
          <p className="mt-4 rounded-md border border-terracotta/40 bg-terracotta/10 p-3 text-xs text-terracotta">
            Demo Data: this listing is fictional. Orders are demo only and no payment is taken. You can also use the enquiry form below to contact the producer (demo).
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <EnquiryForm product={product} heading="Enquire about this product" />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionTitle title="You may also like" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </section>
  )
}