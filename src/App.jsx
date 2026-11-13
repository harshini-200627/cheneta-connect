import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProducerHome from './pages/ProducerHome'
import { useApp } from './store'
import { Products, ProductDetails } from './pages/Products'
import { Artisans, ArtisanProfile, Industries, IndustryDetails } from './pages/Producers'
import { Heritage, About, Contact } from './pages/Info'
import { Login, Signup } from './pages/Auth'
import Cart from './pages/cart'
import { RequireRole, CustomerDashboard, ProducerDashboard, AdminDashboard } from './pages/Dashboards'

function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-2">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </section>
  )
}

// Visitors and customers see the main Home page; artisans and small industries see their own Home; admin goes straight to the dashboard.
function HomeRoute() {
  const { session } = useApp()
  if (session?.role === 'admin') return <Navigate to="/dashboard/admin" replace />
  if (session && session.role !== 'customer') return <ProducerHome />
  return <Home />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeRoute />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="artisans" element={<Artisans />} />
        <Route path="artisans/:id" element={<ArtisanProfile />} />
        <Route path="industries" element={<Industries />} />
        <Route path="industries/:id" element={<IndustryDetails />} />
        <Route path="heritage" element={<Heritage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="cart" element={<Cart />} />
        <Route path="dashboard/customer" element={<RequireRole role="customer"><CustomerDashboard /></RequireRole>} />
        <Route path="dashboard/artisan" element={<RequireRole role="artisan"><ProducerDashboard kind="artisan" /></RequireRole>} />
        <Route path="dashboard/industry" element={<RequireRole role="industry"><ProducerDashboard kind="industry" /></RequireRole>} />
        <Route path="dashboard/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}