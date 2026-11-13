import { createContext, useContext, useEffect, useState } from 'react'
import { seed, DEMO_ACCOUNTS } from './data/seed'

// Everything is kept in browser localStorage. This is DEMO authentication only - not secure.
const DB_KEY = 'cc_db_v5'
const SESSION_KEY = 'cc_session_v1'
const CART_KEY = 'cc_cart_v1'

const read = (k, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(k))
    return v ?? fallback
  } catch {
    return fallback
  }
}
const write = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ }
}

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export const dashboardPath = (role) => `/dashboard/${role}`

export function AppProvider({ children }) {
  const [db, setDb] = useState(() => {
    const s = read(DB_KEY, null)
    return s && s.products ? s : seed
  })
  const [session, setSession] = useState(() => read(SESSION_KEY, null))
  const [cart, setCart] = useState(() => {
    const c = read(CART_KEY, [])
    return Array.isArray(c) ? c : []
  })

  useEffect(() => write(DB_KEY, db), [db])
  useEffect(() => write(CART_KEY, cart), [cart])
  useEffect(() => {
    if (session) write(SESSION_KEY, session)
    else { try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ } }
  }, [session])

  const upsert = (col, item) =>
    setDb((d) => {
      const list = d[col] || []
      const exists = list.some((x) => x.id === item.id)
      return { ...d, [col]: exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list] }
    })

  const remove = (col, id) => setDb((d) => ({ ...d, [col]: (d[col] || []).filter((x) => x.id !== id) }))

  // Removing a producer profile also removes the products it owns.
  const removeProducer = (kind, id) =>
    setDb((d) => ({
      ...d,
      [kind === 'artisan' ? 'artisans' : 'industries']: d[kind === 'artisan' ? 'artisans' : 'industries'].filter((x) => x.id !== id),
      products: d.products.filter((p) => !(p.ownerType === kind && p.ownerId === id)),
    }))

  const favKey = session?.email || 'guest'
  const favs = db.favs[favKey] || []
  const toggleFav = (id) =>
    setDb((d) => {
      const cur = d.favs[favKey] || []
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      return { ...d, favs: { ...d.favs, [favKey]: next } }
    })

  const addEnquiry = (e) =>
    upsert('enquiries', { id: 'e' + Date.now(), date: new Date().toISOString(), status: 'New', ...e })

  const getOwner = (p) =>
    p ? (p.ownerType === 'artisan' ? db.artisans : db.industries).find((x) => x.id === p.ownerId) : null

  // ---------- CART ----------
  const clampQty = (q) => Math.max(1, Math.min(20, Math.round(Number(q)) || 1))

  const cartItems = cart
    .map((c) => {
      const product = db.products.find((p) => p.id === c.id)
      return product ? { product, qty: c.qty } : null
    })
    .filter(Boolean)
  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0)
  const cartTotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)

  const addToCart = (id, qty = 1) =>
    setCart((c) => {
      const ex = c.find((x) => x.id === id)
      return ex
        ? c.map((x) => (x.id === id ? { ...x, qty: clampQty(x.qty + qty) } : x))
        : [...c, { id, qty: clampQty(qty) }]
    })
  const setCartQty = (id, qty) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: clampQty(qty) } : x)))
  const removeFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id))
  const clearCart = () => setCart([])

  // ---------- DEMO ORDERS ----------
  const orders = db.orders || []
  const myOrders = orders.filter((o) => o.customerEmail === session?.email)

  const placeOrder = (shipping = {}) => {
    if (!session) return { ok: false, error: 'Please log in as a customer to place a demo order.' }
    if (session.role !== 'customer') return { ok: false, error: 'Only customer accounts can place orders. Please log in as a customer.' }
    if (cartItems.length === 0) return { ok: false, error: 'Your cart is empty.' }
    const order = {
      id: 'o' + Date.now(),
      date: new Date().toISOString(),
      customerEmail: session.email,
      customerName: session.name,
      items: cartItems.map((i) => ({ id: i.product.id, name: i.product.name, price: i.product.price, qty: i.qty })),
      total: cartTotal,
      status: 'Placed (Demo)',
      shipping,
    }
    setDb((d) => ({ ...d, orders: [order, ...(d.orders || [])] }))
    setCart([])
    return { ok: true, order }
  }

  const login = (email, password, role) => {
    const em = email.trim().toLowerCase()
    const demo = DEMO_ACCOUNTS.find((a) => a.email === em && a.password === password && a.role === role)
    const user = demo || db.users.find((u) => u.email === em && u.password === password && u.role === role)
    if (!user) return { ok: false, error: 'Incorrect email, password or account type. Please check the demo credentials.' }
    setSession({ email: user.email, name: user.name, role: user.role, profileId: user.profileId || null })
    return { ok: true, role: user.role }
  }

  const signup = ({ name, email, password, role }) => {
    const em = email.trim().toLowerCase()
    if (role === 'admin') return { ok: false, error: 'Admin accounts cannot be created. Use the demo admin login.' }
    if (DEMO_ACCOUNTS.some((a) => a.email === em) || db.users.some((u) => u.email === em))
      return { ok: false, error: 'An account with this email already exists.' }
    const profileId = role === 'artisan' ? 'a' + Date.now() : role === 'industry' ? 'i' + Date.now() : null
    setDb((d) => {
      const next = { ...d, users: [...d.users, { email: em, password, name, role, profileId }] }
      if (role === 'artisan') {
        next.artisans = [{ id: profileId, name, village: 'Your village', district: 'Your district', specialization: 'Add your specialization', productsMade: 'Add products you make', bio: 'Demo profile created via signup. Edit this from your dashboard.', image: '', demo: true }, ...d.artisans]
      } else if (role === 'industry') {
        next.industries = [{ id: profileId, name, area: 'Your area', district: 'Your district', type: 'Handloom weaving unit', productsMade: 'Add products', description: 'Demo profile created via signup. Edit this from your dashboard.', methods: 'Describe your traditional production methods.', employment: 'Demo profile', image: '', gallery: [], demo: true }, ...d.industries]
      }
      return next
    })
    setSession({ email: em, name, role, profileId })
    return { ok: true, role }
  }

  const logout = () => setSession(null)
  const resetDemo = () => { setDb(seed); setSession(null); setCart([]) }

  const value = {
    db, session, favs, toggleFav, upsert, remove, removeProducer, addEnquiry, getOwner,
    login, signup, logout, resetDemo,
    cartItems, cartCount, cartTotal, addToCart, setCartQty, removeFromCart, clearCart,
    orders, myOrders, placeOrder,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}