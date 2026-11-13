// All profiles, products and enquiries below are fictional DEMO DATA.
// Photos load from Pexels (real photographs). If one fails to load,
// the <SmartImage> component shows a woven-textile pattern instead, so there are never broken images.
// To use your own photos: put them in /public/images (e.g. /public/images/products/p1.jpg) - they are used first.

// Real photographs from Pexels (free to use, loaded directly from Pexels' image servers).
// Each keyword group maps to a pool of photos (used only for the page backgrounds).
const POOLS = {
  loom: [6634704, 6634341, 6634555, 4219651, 6634700, 4219654, 6634610], // weavers, hand looms
  silk: [7232413, 7676881, 15305990, 15305987, 7676347, 1475034],        // gold / silk / zari cloth
  saree: [35108807, 28943572, 27575174, 33078836, 2723623, 7920189],     // women in sarees
  fabric: [2325270, 28762830, 1937336, 6461401, 11733651, 365066, 2120584, 20578931], // folded fabrics, textiles, thread
}
const LOOM_WORDS = ['loom', 'weaving', 'weaver', 'weavers', 'weave', 'workshop', 'factory', 'cooperative', 'spinning', 'khadi', 'artisan', 'yarn', 'thread', 'warp', 'hands', 'dye']
const SILK_WORDS = ['silk', 'zari', 'gold', 'jamdani', 'wedding', 'border']
const SAREE_WORDS = ['saree', 'woman', 'dupatta', 'indian', 'traditional', 'ikat']

// px(photoId, width, height) -> direct Pexels image URL
export const px = (id, w = 800, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`

const used = { loom: 0, silk: 0, saree: 0, fabric: 0 }

// pic(keywords, n, width, height) -> next unused photo from the matching pool
export const pic = (kw, n, w = 800, h = 800) => {
  const words = String(kw).split(',')
  const has = (list) => words.some((x) => list.includes(x))
  const key = has(LOOM_WORDS) ? 'loom' : has(SILK_WORDS) ? 'silk' : has(SAREE_WORDS) ? 'saree' : 'fabric'
  const pool = POOLS[key]
  const id = pool[used[key]++ % pool.length]
  return px(id, w, h)
}

export const CATEGORIES = [
  'Handloom Sarees',
  'Silk Sarees',
  'Cotton Sarees',
  'Dress Materials',
  'Traditional Fabrics',
  'Handloom Accessories',
]

export const INDUSTRY_TYPES = [
  'Handloom weaving unit',
  'Small textile manufacturing unit',
  'Traditional silk weaving business',
  'Cotton fabric production unit',
  'Handloom product cooperative',
]

export const categoryKeyword = {
  'Handloom Sarees': 'saree,handloom',
  'Silk Sarees': 'silk,saree',
  'Cotton Sarees': 'cotton,saree',
  'Dress Materials': 'fabric,textile',
  'Traditional Fabrics': 'textile,weaving',
  'Handloom Accessories': 'dupatta,scarf',
}

const P = (id, name, price, material, category, desc, ownerType, ownerId, photo) => ({
  id, name, price, material, category, desc, ownerType, ownerId,
  details: `${desc} Handwoven with attention to border and finish. Colours may vary slightly from the photograph because every piece is handmade. The photograph is a representative stock image. This is a Demo Data listing and cannot be purchased.`,
  image: [`/images/products/${id}.jpg`, px(photo)],
})

export const products = [
  P('p1', 'Everyday Handloom Saree', 2450, 'Handloom cotton', 'Handloom Sarees', 'Comfortable handloom saree in traditional drape, ideal for daily and festive wear.', 'artisan', 'a1', 27575174),
  P('p2', 'Classic Handloom Cotton Saree', 2990, 'Handloom cotton', 'Cotton Sarees', 'Soft, breathable cotton saree woven on a wooden handloom.', 'artisan', 'a1', 2723623),
  P('p3', 'Pink & Orange Hand-Dyed Cotton Fabric (per 2 m)', 1850, 'Cotton, natural dyes', 'Dress Materials', 'Hand-dyed cotton fabric in warm pink and orange tones, sold by the length.', 'artisan', 'a2', 2120584),
  P('p4', 'Pink Traditional Silk Saree', 8900, 'Silk with zari', 'Silk Sarees', 'Lightweight silk saree in a rich pink with a fine woven border.', 'artisan', 'a3', 35108807),
  P('p5', 'Gold Silk Fabric (per 2 m)', 6200, 'Pure silk', 'Traditional Fabrics', 'Lustrous gold silk fabric used for blouses, borders and festive outfits.', 'artisan', 'a4', 7676881),
  P('p6', 'Festive Handloom Saree', 3200, 'Handloom cotton-silk blend', 'Handloom Sarees', 'Festive handloom saree with a graceful fall and woven detailing.', 'artisan', 'a5', 33078836),
  P('p7', 'Indigo-Blue Handloom Cotton Fabric (per 2 m)', 780, 'Handspun cotton', 'Traditional Fabrics', 'Stacks of soft blue handloom cotton fabric, sold by the length.', 'artisan', 'a6', 28762830),
  P('p8', 'Handwoven Table Runner', 1650, 'Cotton', 'Handloom Accessories', 'Table runner woven by hand on a traditional loom.', 'industry', 'i1', 6634704),
  P('p9', 'Orange Handloom Cotton Stole', 650, 'Cotton', 'Handloom Accessories', 'Light cotton stole in a warm orange handloom weave.', 'industry', 'i1', 1475034),
  P('p10', 'Assorted Cotton Dress Materials', 1250, 'Cotton blend', 'Dress Materials', 'Folded assortment of everyday cotton dress materials in many colours.', 'industry', 'i2', 2325270),
  P('p11', 'Folded Handloom Fabric Set', 890, 'Cotton', 'Traditional Fabrics', 'Set of folded handloom fabrics for stitching and home furnishing.', 'industry', 'i2', 6461401),
  P('p12', 'Blue & Gold Silk Fabric (per 2 m)', 9800, 'Silk with zari', 'Traditional Fabrics', 'Blue silk fabric with a gold sheen, woven for festive wear.', 'industry', 'i3', 7676347),
  P('p13', 'Gold Silk Dupatta Material', 2150, 'Silk', 'Handloom Accessories', 'Gold silk material for dupattas and stoles.', 'industry', 'i3', 15305990),
  P('p14', 'Classic Handloom Saree in Traditional Wear', 2100, 'Soft cotton', 'Cotton Sarees', 'Simple handloom saree in a traditional style, suitable for markets, offices and festivals.', 'industry', 'i4', 28943572),
  P('p15', 'Handloom Cotton Fabric Bundle', 540, 'Cotton', 'Traditional Fabrics', 'Bundle of folded handloom cotton textiles for stitching and furnishings.', 'industry', 'i4', 1937336),
  P('p16', 'Cooperative Handloom Cloth Bundle', 1650, 'Cotton', 'Traditional Fabrics', 'Pile of handloom cloth produced by members of a weaver cooperative.', 'industry', 'i5', 365066),
  P('p17', 'Gold Zari Fabric (Cooperative Weave)', 520, 'Cotton with zari', 'Traditional Fabrics', 'Gold-toned zari fabric woven by cooperative members.', 'industry', 'i5', 15305987),
]

export const artisans = [
  { id: 'a1', name: 'Lakshmi Devi', village: 'Mangalagiri', district: 'Guntur', specialization: 'Mangalagiri cotton sarees with Nizam borders', productsMade: 'Cotton sarees, handloom checks', bio: 'Demo biography: a fictional weaver who learned the pit-loom from her family and weaves cotton sarees with traditional Nizam borders.', image: '', demo: true },
  { id: 'a2', name: 'Venkata Rao', village: 'Pedana', district: 'Krishna', specialization: 'Kalamkari hand-block printing on handloom cotton', productsMade: 'Dress materials, printed fabrics', bio: 'Demo biography: a fictional block-printer who uses natural dyes and hand-carved wooden blocks.', image: '', demo: true },
  { id: 'a3', name: 'Sita Mahalakshmi', village: 'Uppada', district: 'Kakinada', specialization: 'Jamdani-style silk weaving', productsMade: 'Silk sarees, dupattas', bio: 'Demo biography: a fictional silk weaver who specialises in lightweight sarees with floral woven motifs.', image: '', demo: true },
  { id: 'a4', name: 'Ramesh Babu', village: 'Dharmavaram', district: 'Sri Sathya Sai', specialization: 'Temple-border pure silk sarees', productsMade: 'Silk sarees, bridal sarees', bio: 'Demo biography: a fictional master weaver known for broad temple borders and rich zari pallus.', image: '', demo: true },
  { id: 'a5', name: 'Padmavathi', village: 'Venkatagiri', district: 'Tirupati', specialization: 'Fine cotton sarees with zari borders', productsMade: 'Fine cotton sarees', bio: 'Demo biography: a fictional weaver who creates feather-light cotton sarees with delicate zari work.', image: '', demo: true },
  { id: 'a6', name: 'Narasimha Murthy', village: 'Ponduru', district: 'Srikakulam', specialization: 'Handspun khadi weaving', productsMade: 'Khadi fabrics, shirting', bio: 'Demo biography: a fictional khadi weaver who works with handspun yarn on a wooden handloom.', image: '', demo: true },
]

export const industries = [
  { id: 'i1', name: 'Sri Venkateswara Handloom Weaving Unit', area: 'Mangalagiri', district: 'Guntur', type: 'Handloom weaving unit', productsMade: 'Handwoven table runners, cotton stoles', description: 'Demo business: a fictional family-run unit with a group of weavers producing handloom cotton products and accessories.', methods: 'Hand-dyed yarn, warp preparation by hand, weaving on wooden pit looms and frame looms, hand finishing.', employment: 'Employs about 15 local weavers and helpers (demo figure).', image: '', gallery: [], demo: true },
  { id: 'i2', name: 'Krishna Textile Works', area: 'Vijayawada outskirts', district: 'NTR', type: 'Small textile manufacturing unit', productsMade: 'Dress materials, handloom fabric sets', description: 'Demo business: a fictional small unit producing everyday cotton dress materials and home textiles.', methods: 'Semi-mechanised weaving with hand-finished edges and natural-dye test batches.', employment: 'Provides work to about 25 people including women self-help group members (demo figure).', image: '', gallery: [], demo: true },
  { id: 'i3', name: 'Amaravati Silk Weavers', area: 'Dharmavaram', district: 'Sri Sathya Sai', type: 'Traditional silk weaving business', productsMade: 'Silk fabrics, silk dupatta material', description: 'Demo business: a fictional silk weaving business continuing a multi-generation tradition of zari-bordered silk.', methods: 'Silk reeling and twisting, tie-and-weave warp setting, zari brocade on traditional jacquard-assisted handlooms.', employment: 'Supports about 40 weaving families (demo figure).', image: '', gallery: [], demo: true },
  { id: 'i4', name: 'Godavari Cotton Fabrics', area: 'Rajahmundry', district: 'East Godavari', type: 'Cotton fabric production unit', productsMade: 'Cotton sarees, furnishing fabrics', description: 'Demo business: a fictional cotton fabric unit focusing on soft sarees and sturdy household fabrics.', methods: 'Locally sourced cotton yarn, hand-operated looms, sun-drying and hand-pressing.', employment: 'Provides full-time work to about 20 people (demo figure).', image: '', gallery: [], demo: true },
  { id: 'i5', name: 'Andhra Handloom Cooperative Society', area: 'Chirala', district: 'Bapatla', type: 'Handloom product cooperative', productsMade: 'Cloth bundles, zari fabrics', description: 'Demo business: a fictional cooperative of weavers who share looms, raw material purchases and marketing.', methods: 'Members weave at home on their own looms; the cooperative handles yarn supply, quality checks and shared sales.', employment: 'Represents about 60 member weavers (demo figure).', image: '', gallery: [], demo: true },
]

export const customers = [
  { email: 'customer@chenetaconnect.com', name: 'Ananya Reddy (Demo Customer)' },
  { email: 'kiran.demo@example.com', name: 'Kiran Kumar (Demo Customer)' },
  { email: 'meera.demo@example.com', name: 'Meera Nair (Demo Customer)' },
]

export const enquiries = [
  { id: 'e1', date: '2026-10-20T10:15:00.000Z', name: 'Ananya Reddy', email: 'customer@chenetaconnect.com', subject: 'Availability of handloom saree', message: 'Is the everyday handloom saree available in a maroon colour?', productId: 'p1', targetType: 'artisan', targetId: 'a1', status: 'New' },
  { id: 'e2', date: '2026-10-24T14:40:00.000Z', name: 'Kiran Kumar', email: 'kiran.demo@example.com', subject: 'Bulk order of stoles', message: 'We would like to know whether the unit can supply 50 cotton stoles for an event.', productId: 'p9', targetType: 'industry', targetId: 'i1', status: 'Replied' },
  { id: 'e3', date: '2026-10-28T09:05:00.000Z', name: 'Meera Nair', email: 'meera.demo@example.com', subject: 'Silk fabric care', message: 'How should the gold silk fabric be stored and cleaned?', productId: 'p5', targetType: 'artisan', targetId: 'a4', status: 'New' },
]

export const DEMO_ACCOUNTS = [
  { role: 'customer', email: 'customer@chenetaconnect.com', password: 'customer123', name: 'Ananya Reddy (Demo Customer)', profileId: null },
  { role: 'artisan', email: 'artisan@chenetaconnect.com', password: 'artisan123', name: 'Lakshmi Devi (Demo Artisan)', profileId: 'a1' },
  { role: 'industry', email: 'industry@chenetaconnect.com', password: 'industry123', name: 'Sri Venkateswara Handloom Weaving Unit (Demo)', profileId: 'i1' },
  { role: 'admin', email: 'admin@chenetaconnect.com', password: 'admin123', name: 'Demo Administrator', profileId: null },
]

// Photos for artisans and industries (a different photo for each; your own file in /public/images is used first)
const ARTISAN_PHOTO = { a1: 6634700, a2: 6634555, a3: 6634610, a4: 4219651, a5: 7920189, a6: 4219654 }
artisans.forEach((a) => { a.image = [`/images/artisans/${a.id}.jpg`, px(ARTISAN_PHOTO[a.id], 700, 800)] })

const INDUSTRY_PHOTO = { i1: 11733651, i2: 1937336, i3: 15305987, i4: 28762830, i5: 2120584 }
const INDUSTRY_GALLERY = {
  i1: [6634341, 6634555, 20578931],
  i2: [4219654, 6634341, 7232413],
  i3: [7232413, 7676881, 6634610],
  i4: [1475034, 4219651, 365066],
  i5: [6634700, 6634555, 11733651],
}
industries.forEach((i) => {
  i.image = [`/images/industries/${i.id}.jpg`, px(INDUSTRY_PHOTO[i.id], 900, 600)]
  i.gallery = INDUSTRY_GALLERY[i.id].map((id, n) => [`/images/industries/${i.id}-${n + 1}.jpg`, px(id, 600, 400)])
})

export const seed = { products, artisans, industries, customers, enquiries, users: [], favs: {} }