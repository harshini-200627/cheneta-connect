import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp, dashboardPath } from '../store'
import { PhotoBackdrop, bg } from './UI'

// Menu for each type of visitor. Only guests and customers can use the cart.
const guestLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/artisans', label: 'Artisans' },
  { to: '/industries', label: 'Small Industries' },
  { to: '/heritage', label: 'Heritage' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]
const customerLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/heritage', label: 'Heritage' },
  { to: '/contact', label: 'Contact Us' },
]
const staffLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/contact', label: 'Contact Us' },
]

const menuFor = (session) => {
  if (!session) return guestLinks
  if (session.role === 'customer') return customerLinks
  if (session.role === 'admin') return [] // admin uses the dashboard only
  return staffLinks // artisan, industry
}
const dashLabel = (role) => (role === 'customer' ? 'My Dashboard' : 'Dashboard')

function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold bg-maroon font-serif text-xl font-bold text-gold-light">C</span>
      <span className={`font-serif text-xl font-bold leading-none ${light ? 'text-gold-light' : 'text-maroon'}`}>
        Cheneta Connect
        <span className={`block text-[10px] font-sans font-medium uppercase tracking-[0.2em] ${light ? 'text-ivory/80' : 'text-terracotta'}`}>Handloom • Artisans • Industries</span>
      </span>
    </Link>
  )
}

function CartLink({ className = '' }) {
  const { cartCount } = useApp()
  return (
    <Link
      to="/cart"
      aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
      className={`relative flex items-center gap-1.5 rounded-md border border-gold px-3 py-1.5 text-sm font-semibold text-maroon transition hover:bg-gold/20 ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 7H6" />
      </svg>
      <span>Cart</span>
      {cartCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-ivory">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  )
}

function Navbar() {
  const { session, logout } = useApp()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])

  const links = menuFor(session)
  const showCart = !session || session.role === 'customer'

  const linkCls = ({ isActive }) =>
    `px-2.5 py-2 text-sm font-semibold transition border-b-2 ${isActive ? 'border-gold text-maroon' : 'border-transparent text-indigo hover:text-maroon hover:border-gold/60'}`

  const doLogout = () => { logout(); nav('/') }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-gold bg-ivory/95 shadow-md backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
          {session && <NavLink to={dashboardPath(session.role)} className={linkCls}>{dashLabel(session.role)}</NavLink>}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {showCart && <CartLink />}
          {session ? (
            <button onClick={doLogout} className="btn-primary btn-sm">Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn-primary btn-sm">Login</Link>
              <Link to="/signup" className="btn-gold btn-sm">Signup</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          {showCart && <CartLink className="!px-2" />}
          <button className="rounded-md border border-gold p-2 text-maroon" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-gold/60 bg-ivory px-4 pb-4 lg:hidden">
          <nav className="flex flex-col py-2">
            {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
            {session && <NavLink to={dashboardPath(session.role)} className={linkCls}>{dashLabel(session.role)}</NavLink>}
          </nav>
          <div className="flex gap-2">
            {session ? (
              <button onClick={doLogout} className="btn-primary btn-sm flex-1">Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn-primary btn-sm flex-1">Login</Link>
                <Link to="/signup" className="btn-gold btn-sm flex-1">Signup</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  const { session, resetDemo } = useApp()
  const links = menuFor(session)
  const showCart = !session || session.role === 'customer'
  return (
    <footer className="relative z-10 mt-16 bg-maroon text-ivory">
      <div className="border-motif" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm text-ivory/80">
            Cheneta Connect promotes traditional handloom products and connects customers with individual artisans and small-scale textile industries through digital technology.
          </p>
          <p className="mt-3 text-xs text-gold-light">Demo Mode: all profiles, products and enquiries are fictional Demo Data created for a college project.</p>
        </div>
        <div>
          {(links.length > 0 || showCart) && (
            <>
              <h4 className="mb-3 font-serif text-lg text-gold-light">Explore</h4>
              <ul className="space-y-2 text-sm">
                {links.map((l) => <li key={l.to}><Link className="hover:text-gold-light" to={l.to}>{l.label}</Link></li>)}
                {showCart && <li><Link className="hover:text-gold-light" to="/cart">Cart</Link></li>}
              </ul>
            </>
          )}
        </div>
        <div>
          <h4 className="mb-3 font-serif text-lg text-gold-light">Accounts</h4>
          <ul className="space-y-2 text-sm">
            {session ? (
              <li><Link className="hover:text-gold-light" to={dashboardPath(session.role)}>{dashLabel(session.role)}</Link></li>
            ) : (
              <>
                <li><Link className="hover:text-gold-light" to="/login">Login</Link></li>
                <li><Link className="hover:text-gold-light" to="/signup">Signup</Link></li>
              </>
            )}
            <li>
              <button
                className="text-left hover:text-gold-light"
                onClick={() => { if (window.confirm('Reset all demo data (products, profiles, enquiries, favourites, cart and orders) to the original sample data?')) resetDemo() }}
              >
                Reset demo data
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/40 py-4 text-center text-xs text-ivory/70">
        © {new Date().getFullYear()} Cheneta Connect — College project demonstration. No real payments, no real authentication.
      </div>
    </footer>
  )
}

// Pages that have no photo background of their own get a soft one here.
const backdropPaths = ['/dashboard', '/cart', '/products', '/contact', '/about']
function PageBackdrop() {
  const { pathname } = useLocation()
  if (!backdropPaths.some((p) => pathname.startsWith(p))) return null
  return <PhotoBackdrop images={bg.heritage} />
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-peacock px-4 py-1.5 text-center text-xs font-medium text-ivory">
        Demo Mode — frontend-only demonstration. All artisans, industries and products shown are fictional Demo Data.
      </div>
      <Navbar />
      <main className="relative z-10 flex-1">
        <PageBackdrop />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}