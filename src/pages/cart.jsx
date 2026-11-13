import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import SmartImage from '../components/SmartImage'
import { DemoBadge, SectionTitle, rupees } from '../components/UI'

const input = 'w-full rounded border border-gold bg-ivory px-3 py-2'

export default function Cart() {
  const { cartItems, cartTotal, setCartQty, removeFromCart, placeOrder, session } = useApp()
  const [ship, setShip] = useState({ name: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [placed, setPlaced] = useState(null)

  const set = (k) => (e) => setShip((s) => ({ ...s, [k]: e.target.value }))
  const isCustomer = session?.role === 'customer'

  const submit = () => {
    setError('')
    const shipping = { name: ship.name.trim() || session?.name || '', phone: ship.phone.trim(), address: ship.address.trim() }
    if (!shipping.address) { setError('Please enter a delivery address (demo).'); return }
    const res = placeOrder(shipping)
    if (!res.ok) { setError(res.error); return }
    setPlaced(res.order)
  }

  if (placed) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="card gold-frame p-8">
          <h1 className="text-3xl font-bold text-maroon">Demo order placed</h1>
          <p className="mt-2">Order #{placed.id.slice(1)} • Total {rupees(placed.total)}</p>
          <p className="mt-2 text-sm text-indigo/80">This is a demo. No payment was taken.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard/customer" state={{ tab: 'orders' }} className="btn-primary">View my orders</Link>
            <Link to="/products" className="btn-outline">Continue shopping</Link>
          </div>
        </div>
      </section>
    )
  }

  if (!cartItems.length) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2">Add some handloom products to get started.</p>
        <Link to="/products" className="btn-primary mt-6">Browse products</Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle eyebrow="Demo checkout" title="Your Cart" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map(({ product, qty }) => (
            <div key={product.id} className="card flex flex-wrap items-center gap-4 p-4">
              <SmartImage src={product.image} alt={product.name} label="" className="h-20 w-20 rounded object-cover" />
              <div className="min-w-[180px] flex-1">
                <Link to={`/products/${product.id}`} className="link font-bold">{product.name}</Link>
                <p className="text-sm text-indigo/70">{rupees(product.price)} each</p>
              </div>
              <div className="flex items-center rounded border border-gold">
                <button className="px-3 py-1 text-lg" onClick={() => setCartQty(product.id, qty - 1)} aria-label="Decrease quantity">−</button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button className="px-3 py-1 text-lg" onClick={() => setCartQty(product.id, qty + 1)} aria-label="Increase quantity">+</button>
              </div>
              <p className="w-24 text-right font-semibold">{rupees(product.price * qty)}</p>
              <button className="btn-danger btn-sm" onClick={() => removeFromCart(product.id)}>Remove</button>
            </div>
          ))}
        </div>

        <aside className="card gold-frame h-fit p-5">
          <h2 className="text-xl font-bold">Order summary <DemoBadge /></h2>
          <p className="mt-3 flex justify-between text-lg">
            <span>Total</span><span className="font-serif font-bold text-maroon">{rupees(cartTotal)}</span>
          </p>

          {!isCustomer ? (
            <div className="mt-4 rounded-md border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta">
              Please log in as a customer to place a demo order. Your cart will be kept.
              <div className="mt-3"><Link to="/login" className="btn-primary btn-sm">Login</Link></div>
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <input className={input} placeholder="Full name" value={ship.name} onChange={set('name')} />
              <input className={input} placeholder="Phone (demo)" value={ship.phone} onChange={set('phone')} />
              <textarea className={input} rows={3} placeholder="Delivery address (demo)" value={ship.address} onChange={set('address')} />
              {error && <p className="text-terracotta">{error}</p>}
              <button className="btn-primary w-full" onClick={submit}>Place demo order</button>
            </div>
          )}
          <p className="mt-3 text-xs text-indigo/70">Demo only. No payment is taken.</p>
        </aside>
      </div>
    </section>
  )
}