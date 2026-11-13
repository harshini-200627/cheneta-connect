import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { ProductCard, ArtisanCard, IndustryCard } from '../components/Cards'
import EnquiryForm from '../components/EnquiryForm'
import SmartImage from '../components/SmartImage'
import { PhotoBackdrop, SectionTitle, bg } from '../components/UI'
import { px } from '../data/seed'

const techniques = [
  { t: 'Yarn preparation & dyeing', d: 'Cotton and silk yarn is cleaned, dyed in vibrant colours and dried before it reaches the loom.', img: px(20578931, 600, 450) },
  { t: 'Warping & loom setting', d: 'Hundreds of warp threads are measured and stretched on the loom by hand, a task needing patience and precision.', img: px(6634341, 600, 450) },
  { t: 'Weaving the pattern', d: 'The weaver passes the weft through the warp, shaping borders, checks and motifs thread by thread.', img: px(4219651, 600, 450) },
  { t: 'Zari & extra-weft work', d: 'Metallic zari and extra weft threads are woven in to create the gold borders and buttas of festive sarees.', img: px(7232413, 600, 450) },
]

const why = [
  ['Unique & handmade', 'No two handloom pieces are exactly alike.'],
  ['Eco-friendly', 'Handlooms use no electricity and have a low carbon footprint.'],
  ['Skin-friendly fabrics', 'Natural cotton and silk breathe and feel comfortable.'],
  ['Livelihoods', 'Every purchase supports weaving families and small units.'],
  ['Living heritage', 'Techniques passed down through generations stay alive.'],
  ['Made to last', 'Well-woven handloom fabrics age gracefully.'],
]

export default function Home() {
  const { db } = useApp()
  return (
    <div className="relative">
      {/* Soft, faded traditional photographs behind the whole homepage */}
      <PhotoBackdrop images={bg.home} />

      {/* HERO */}
      <section className="relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center md:py-28">
          <p className="animate-fadeUp text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">Handloom • Heritage • Community</p>
          <h1 className="mx-auto mt-4 max-w-4xl animate-fadeUp text-4xl font-extrabold leading-tight text-maroon md:text-6xl">
            Connecting Traditional Handloom Artisans with the Digital World.
          </h1>
          <div className="mx-auto my-5 h-1 w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mx-auto max-w-2xl animate-fadeUp text-lg text-indigo">
            Discover traditional craftsmanship, explore authentic handloom products, and support the artisans and small industries preserving India's weaving heritage.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/products" className="btn-primary">Explore Products</Link>
            <Link to="/artisans" className="btn-gold">Discover Artisans</Link>
            <Link to="/industries" className="btn-outline bg-ivory/70">Explore Small Industries</Link>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3">
            {[[db.products.length, 'Products'], [db.artisans.length, 'Artisans'], [db.industries.length, 'Small Industries']].map(([n, l]) => (
              <div key={l} className="card gold-frame bg-ivory/85 p-4">
                <p className="font-serif text-3xl font-bold text-maroon">{n}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-motif" />
      </section>

      {/* MISSION */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="card gold-frame bg-ivory/90 p-8 text-center md:p-12">
            <SectionTitle eyebrow="Why we exist" title="Our Mission" />
            <p className="text-lg leading-relaxed text-indigo">
              Cheneta Connect is a digital platform designed to promote traditional handloom products, improve awareness of India's weaving heritage, and connect customers with individual artisans and small-scale textile producers. It aims to improve product visibility, encourage appreciation of traditional craftsmanship, and create better opportunities for local producers through technology.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="relative z-10 bg-ivory/55 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Handpicked" title="Featured Handloom Products" sub="Sarees, fabrics and accessories woven by artisans and small industries (Demo Data)." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[db.products[0], db.products[3], db.products[4], db.products[7]].filter(Boolean).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-8 text-center"><Link to="/products" className="btn-primary">View all products</Link></div>
        </div>
      </section>

      {/* ARTISANS */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="The hands behind the cloth" title="Meet Our Artisans" sub="Demo profiles from weaving clusters across Andhra Pradesh, including Mangalagiri." />
          <div className="grid gap-6 md:grid-cols-3">
            {db.artisans.slice(0, 3).map((a) => <ArtisanCard key={a.id} artisan={a} />)}
          </div>
          <div className="mt-8 text-center"><Link to="/artisans" className="btn-outline bg-ivory/70">See all artisans</Link></div>
        </div>
      </section>

      {/* SMALL INDUSTRIES */}
      <section className="relative z-10 bg-ivory/55 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Weaving units & cooperatives" title="Explore Small Industries" sub="Small-scale producers keep traditional production alive and provide local employment." />
          <div className="grid gap-6 md:grid-cols-3">
            {db.industries.slice(0, 3).map((i) => <IndustryCard key={i.id} industry={i} />)}
          </div>
          <div className="mt-8 text-center"><Link to="/industries" className="btn-outline bg-ivory/70">See all small industries</Link></div>
        </div>
      </section>

      {/* HERITAGE */}
      <section className="relative z-10 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="card gold-frame overflow-hidden p-2">
            <SmartImage src={['/images/misc/heritage-home.jpg', px(4219654, 900, 650)]} alt="Traditional handloom weaving" label="Traditional handloom weaving" className="h-72 w-full rounded object-cover md:h-96" />
          </div>
          <div>
            <SectionTitle left eyebrow="Living tradition" title="Discover Indian Handloom Heritage" />
            <p className="text-indigo">
              Handloom weaving is one of India's oldest living crafts. From the Nizam-border cottons of Mangalagiri to the zari-rich silks of Dharmavaram, every region has its own patterns, colours and techniques.
            </p>
            <Link to="/heritage" className="btn-primary mt-6">Explore Heritage</Link>
          </div>
        </div>
      </section>

      {/* TECHNIQUES */}
      <section className="relative z-10 bg-ivory/55 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="From yarn to fabric" title="Traditional Weaving Techniques" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techniques.map((t, i) => (
              <div key={t.t} className="card card-hover overflow-hidden">
                <SmartImage src={[`/images/misc/technique-${i + 1}.jpg`, t.img]} alt={t.t} label={t.t} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-bold text-terracotta">STEP {i + 1}</p>
                  <h3 className="text-lg font-bold">{t.t}</h3>
                  <p className="mt-1 text-sm text-indigo/80">{t.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY HANDLOOM */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Reasons to choose" title="Why Choose Handloom?" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {why.map(([t, d], i) => (
              <div key={t} className="card card-hover border-l-4 border-l-maroon p-5">
                <span className="font-serif text-3xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="text-sm text-indigo/80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORTING LOCAL PRODUCERS */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="card gold-frame overflow-hidden bg-maroon p-8 text-center text-ivory md:p-12" style={{ background: 'linear-gradient(135deg,#641B2E,#4A1222)' }}>
            <h2 className="text-3xl font-bold text-gold-light md:text-4xl">Supporting Local Producers</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ivory/90">
              When customers discover individual artisans and small industries directly, producers gain visibility, fair recognition and steady work — and traditional craftsmanship stays alive for the next generation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="btn-gold">Join as artisan or industry</Link>
              <Link to="/about" className="btn border border-gold text-gold-light hover:bg-gold hover:text-maroon-dark">Learn more</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section className="relative z-10 bg-ivory/55 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionTitle eyebrow="Get in touch" title="Customer Enquiry" sub="Ask about a product, an artisan or a small industry." />
          <EnquiryForm />
        </div>
      </section>
    </div>
  )
}