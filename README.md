# Cheneta Connect

Frontend-only demo website for promoting handloom artisans and small industries.
React + Vite + Tailwind CSS. No backend, no database — data lives in browser `localStorage`.

## Run

```bash
npm install
npm run dev      # open the URL shown (usually http://localhost:5173)
npm run build    # production build in /dist
```

## Demo logins (also shown on the Login page)

| Role | Email | Password |
|---|---|---|
| Customer | customer@chenetaconnect.com | customer123 |
| Artisan | artisan@chenetaconnect.com | artisan123 |
| Small Industry | industry@chenetaconnect.com | industry123 |
| Admin | admin@chenetaconnect.com | admin123 |

Demo authentication only — not secure. All profiles/products are fictional Demo Data.

## Where things are

- `src/data/seed.js` — sample products (17), artisans (6), small industries (5), enquiries, demo accounts, image URLs
- `src/store.jsx` — localStorage database + login/signup/favourites/enquiries
- `src/pages/` — all pages and the four dashboards
- `src/components/` — navbar/footer, cards, product browser, forms, enquiry form

## Photos

Photos are loaded from `loremflickr.com` by keyword (e.g. saree, handloom, weaving). If a photo cannot load,
a woven-textile pattern is shown instead, so there are no broken images. For your final demo, put your own
photos in `public/images/` and replace the URLs in `src/data/seed.js` (e.g. `/images/saree1.jpg`) and the
homepage backdrop list in `src/components/UI.jsx` (`bg.home`).

## Reset

Use "Reset demo data" in the footer, or clear the site's localStorage.
