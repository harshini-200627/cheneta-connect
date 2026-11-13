import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import SmartImage from './SmartImage'
import { DemoBadge, rupees } from './UI'

export function FavButton({ id, className = '' }) {
  const { favs, toggleFav } = useApp()
  const on = favs.includes(id)
  return (
    <button
      onClick={(e) => { e.preventDefault(); toggleFav(id) }}
      aria-pressed={on}
      aria-label={on ? 'Remove from favourites' : 'Add to favourites'}
      title={on ? 'Remove from favourites' : 'Add to favourites'}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-gold bg-ivory/95 text-lg shadow transition hover:scale-110 ${on ? 'text-maroon' : 'text-indigo/60'} ${className}`}
    >
      {on ? '♥' : '♡'}
    </button>
  )
}

export function AddToCartButton({ id, qty = 1, className = '' }) {
  const { addToCart } = useApp()
  const [added, setAdded] = useState(false)
  const click = (e) => {
    e.preventDefault()
    addToCart(id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }
  return <button onClick={click} className={`btn-outline btn-sm ${className}`}>{added ? 'Added ✓' : 'Add to cart'}</button>
}

export function ProductCard({ product }) {
  const { getOwner } = useApp()
  const owner = getOwner(product)
  const ownerPath = product.ownerType === 'artisan' ? `/artisans/${product.ownerId}` : `/industries/${product.ownerId}`
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <SmartImage src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-2 top-2 rounded-full bg-maroon/90 px-2.5 py-0.5 text-[11px] font-semibold text-ivory">{product.category}</span>
        <FavButton id={product.id} className="absolute right-2 top-2" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold leading-snug">{product.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-terracotta">{product.material}</p>
        <p className="mt-2 line-clamp-2 text-sm text-indigo/80">{product.desc}</p>
        <p className="mt-2 text-xs text-indigo/70">
          By{' '}
          {owner ? <Link to={ownerPath} className="link">{owner.name}</Link> : 'Unknown producer'}{' '}
          <DemoBadge />
        </p>
        <div className="mt-auto pt-4">
          <span className="font-serif text-xl font-bold text-maroon">{rupees(product.price)}</span>
          <div className="mt-3 flex gap-2">
            <AddToCartButton id={product.id} />
            <Link to={`/products/${product.id}`} className="btn-primary btn-sm">View Details</Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ArtisanCard({ artisan }) {
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <SmartImage src={artisan.image} alt={artisan.name} label={artisan.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-bold">{artisan.name}</h3>
          {artisan.demo && <DemoBadge>Demo Profile</DemoBadge>}
        </div>
        <p className="text-sm text-terracotta">{artisan.village}, {artisan.district} district</p>
        <p className="mt-2 text-sm font-semibold text-peacock">{artisan.specialization}</p>
        <p className="mt-1 text-sm text-indigo/80"><span className="font-semibold">Makes:</span> {artisan.productsMade}</p>
        <Link to={`/artisans/${artisan.id}`} className="btn-outline btn-sm mt-4 self-start">View Profile</Link>
      </div>
    </article>
  )
}

export function IndustryCard({ industry }) {
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="aspect-[3/2] overflow-hidden">
        <SmartImage src={industry.image} alt={industry.name} label={industry.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="badge">{industry.type}</span>
          {industry.demo && <DemoBadge />}
        </div>
        <h3 className="text-xl font-bold">{industry.name}</h3>
        <p className="text-sm text-terracotta">{industry.area}, {industry.district} district</p>
        <p className="mt-2 line-clamp-2 text-sm text-indigo/80">{industry.description}</p>
        <p className="mt-1 text-sm text-indigo/80"><span className="font-semibold">Makes:</span> {industry.productsMade}</p>
        <Link to={`/industries/${industry.id}`} className="btn-outline btn-sm mt-4 self-start">View Details</Link>
      </div>
    </article>
  )
}