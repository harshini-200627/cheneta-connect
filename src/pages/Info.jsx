import { Link } from 'react-router-dom'
import EnquiryForm from '../components/EnquiryForm'
import SmartImage from '../components/SmartImage'
import { PhotoBackdrop, SectionTitle, bg } from '../components/UI'
import { px } from '../data/seed'

const fabrics = [
  ['Mangalagiri cotton', 'Handwoven cotton sarees and fabrics known for the Nizam border and crisp finish.', 28762830],
  ['Uppada Jamdani silk', 'Lightweight silk with floral woven motifs created using the jamdani technique.', 7676347],
  ['Dharmavaram silk', 'Rich pure-silk sarees with broad temple borders and zari pallus.', 7232413],
  ['Venkatagiri cotton', 'Fine, lightweight cotton sarees with delicate zari borders.', 2120584],
  ['Ponduru khadi', 'Soft handspun, hand-woven khadi cotton fabric.', 365066],
  ['Kalamkari on handloom', 'Hand-block and hand-painted designs on handloom cotton using natural dyes.', 1475034],
]

const videos = [
  ['How a handloom works', 'handloom weaving process'],
  ['Mangalagiri handloom weavers', 'mangalagiri handloom weaving'],
  ['Silk saree weaving', 'dharmavaram silk saree weaving'],
]

export function Heritage() {
  return (
    <div className="relative">
      <PhotoBackdrop images={bg.heritage} overlay="bg-ivory/80" />
      <div className="relative z-10">
        <section className="mx-auto max-w-5xl px-4 py-14 text-center">
          <SectionTitle eyebrow="Educational" title="Handloom Heritage of India" sub="Why handloom matters, how it is made and how you can help keep it alive." />
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 md:grid-cols-2">
          <div className="card gold-frame p-8">
            <h2 className="text-2xl font-bold">Importance of traditional handloom</h2>
            <p className="mt-3">Handloom fabric is woven by hand without electricity. It supports millions of weaving families, uses little energy and keeps regional designs alive. Each piece carries the individual touch of its weaver.</p>
            <h2 className="mt-6 text-2xl font-bold">India's weaving heritage</h2>
            <p className="mt-3">India has woven cotton, silk and wool for thousands of years. Every region developed its own colours, motifs and techniques — from jamdani and ikat to khadi and zari brocade.</p>
          </div>
          <SmartImage src={['/images/misc/heritage-hero.jpg', px(6634610, 900, 650)]} alt="Handloom weaver at work" label="Handloom weaver at work" className="h-72 w-full rounded-xl border-2 border-gold object-cover md:h-96" />
        </section>

        <section className="bg-ivory/60 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <SectionTitle title="Traditional weaving methods" />
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ['Pit loom & frame loom', 'The weaver sits at the loom and works treadles with the feet while passing the shuttle by hand.'],
                ['Extra-weft & zari work', 'Additional threads are woven in only where a motif is needed, producing buttas, borders and gold detailing.'],
                ['Natural dyeing & finishing', 'Yarn and cloth are dyed, washed, sun-dried and pressed by hand for colour and softness.'],
              ].map(([t, d]) => (
                <div key={t} className="card card-hover p-6"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2 text-sm">{d}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4">
            <SectionTitle title="Different types of handloom fabrics" sub="Examples from Andhra Pradesh and beyond. Photographs are representative stock images of handloom cloth." />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fabrics.map(([t, d, photo], idx) => (
                <div key={t} className="card card-hover overflow-hidden">
                  <SmartImage src={[`/images/misc/fabric-${idx + 1}.jpg`, px(photo, 700, 500)]} alt={t} label={t} className="h-44 w-full object-cover" />
                  <div className="p-4"><h3 className="text-lg font-bold">{t}</h3><p className="text-sm">{d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ivory/60 py-14">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
            {[
              ['Cultural importance of sarees & textiles', 'Sarees and woven textiles feature in weddings, festivals and daily life. Borders, colours and motifs often carry regional and cultural meaning.'],
              ['Why support artisans', 'Buying directly from weavers and small units provides fair income, preserves skills and encourages younger people to continue the craft.'],
              ['Role of small industries', 'Weaving units and cooperatives organise yarn supply, training and marketing so that traditional production can continue at a sustainable scale.'],
            ].map(([t, d]) => (
              <div key={t} className="card gold-frame p-6"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2 text-sm">{d}</p></div>
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4">
            <SectionTitle title="Weaving videos" sub="These links open sample video searches on YouTube in a new tab." />
            <div className="grid gap-6 md:grid-cols-3">
              {videos.map(([t, q], n) => (
                <a
                  key={t}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="card card-hover group relative block overflow-hidden"
                >
                  <SmartImage src={[`/images/misc/video-${n + 1}.jpg`, px([6634700, 4219654, 6634341][n], 700, 420)]} alt={t} label={t} className="h-44 w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-maroon/30 transition group-hover:bg-maroon/50">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-ivory text-2xl text-maroon">▶</span>
                  </span>
                  <p className="p-4 font-serif text-lg font-bold text-maroon">{t}</p>
                </a>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/products" className="btn-primary">Shop handloom products</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export function About() {
  const goals = [
    ['Promoting traditional handloom products', 'Giving handloom sarees, fabrics and accessories a clear online showcase.'],
    ['Increasing awareness of weaving heritage', 'Sharing the stories, techniques and regions behind each fabric.'],
    ['Supporting individual artisans', 'Letting weavers present their work and receive customer enquiries.'],
    ['Promoting small-scale textile industries', 'Highlighting weaving units, silk businesses and cooperatives.'],
    ['Improving visibility of traditional products', 'Helping local products reach customers beyond their town.'],
    ['Connecting customers with producers', 'Making it easy to ask producers questions directly.'],
    ['Preserving craftsmanship through technology', 'Using digital tools to keep traditional skills relevant for a new generation.'],
  ]
  return (
    <div className="relative">
      <PhotoBackdrop images={bg.heritage} overlay="bg-ivory/85" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-14">
        <SectionTitle eyebrow="About Us" title="About Cheneta Connect" />
        <div className="card gold-frame p-8 text-center">
          <p className="text-lg">
            Cheneta Connect is a community-oriented digital platform that promotes traditional handloom products and connects customers with individual artisans and small-scale industries. It is a college project demonstration built with sample (Demo) data.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {goals.map(([t, d], i) => (
            <div key={t} className="card card-hover flex gap-4 p-5">
              <span className="font-serif text-3xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              <div><h3 className="text-lg font-bold">{t}</h3><p className="text-sm text-indigo/80">{d}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/products" className="btn-primary mr-3">Explore Products</Link>
          <Link to="/contact" className="btn-outline bg-ivory/70">Contact us</Link>
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="relative">
      <PhotoBackdrop images={bg.heritage} overlay="bg-ivory/85" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-14">
        <SectionTitle eyebrow="Contact & Enquiry" title="Get in touch" sub="Ask a question or enquire about products from individual artisans and small industries." />
        <EnquiryForm />
      </div>
    </div>
  )
}