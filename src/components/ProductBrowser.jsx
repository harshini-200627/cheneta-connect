import { useMemo, useState } from 'react'
import { useApp } from '../store'
import { CATEGORIES } from '../data/seed'
import { ProductCard } from './Cards'

const PRICE_RANGES = [
  { key: 'all', label: 'Any price', test: () => true },
  { key: 'u1', label: 'Under ₹1,000', test: (p) => p < 1000 },
  { key: 'r2', label: '₹1,000 – ₹3,000', test: (p) => p >= 1000 && p <= 3000 },
  { key: 'r3', label: '₹3,000 – ₹6,000', test: (p) => p > 3000 && p <= 6000 },
  { key: 'o6', label: 'Above ₹6,000', test: (p) => p > 6000 },
]

// Search + category + price + sort. Used on the Products page and in the Customer dashboard.
export default function ProductBrowser({ onlyFavourites = false }) {
  const { db, favs } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [price, setPrice] = useState('all')
  const [sort, setSort] = useState('featured')

  const list = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.key === price)
    const term = q.trim().toLowerCase()
    let out = db.products.filter((p) => {
      if (onlyFavourites && !favs.includes(p.id)) return false
      if (cat !== 'All' && p.category !== cat) return false
      if (!range.test(p.price)) return false
      if (!term) return true
      return [p.name, p.material, p.category, p.desc].some((t) => t.toLowerCase().includes(term))
    })
    if (sort === 'low') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'high') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'name') out = [...out].sort((a, b) => a.name.localeCompare(b.name))
    return out
  }, [db.products, favs, q, cat, price, sort, onlyFavourites])

  const reset = () => { setQ(''); setCat('All'); setPrice('all'); setSort('featured') }

  return (
    <div>
      <div className="card mb-6 grid gap-3 p-4 md:grid-cols-4">
        <input className="input md:col-span-2" placeholder="Search sarees, fabrics, materials…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        <select className="input" value={price} onChange={(e) => setPrice(e.target.value)} aria-label="Price filter">
          {PRICE_RANGES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          <option value="featured">Sort: Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
        <div className="flex flex-wrap gap-2 md:col-span-4">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${cat === c ? 'border-maroon bg-maroon text-ivory' : 'border-gold bg-white/70 text-maroon hover:bg-gold/30'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-indigo/80">{list.length} product{list.length === 1 ? '' : 's'} found</p>

      {list.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-serif text-xl text-maroon">{onlyFavourites ? 'No favourites yet.' : 'No products match your filters.'}</p>
          <button onClick={reset} className="btn-primary mt-4">Clear filters</button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
