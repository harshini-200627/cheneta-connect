import { useState } from 'react'

// src can be a string or an array of fallbacks, e.g. ['/images/products/p1.jpg', 'https://...'].
// Tries each in order; if all fail, shows a woven-textile pattern so there is never a broken image.
export default function SmartImage({ src, alt, className = '', label }) {
  const list = (Array.isArray(src) ? src : [src]).filter(Boolean)
  const [i, setI] = useState(0)
  if (i >= list.length) {
    return (
      <div className={`weave-fallback ${className}`} role="img" aria-label={alt}>
        <span>{label || alt}</span>
      </div>
    )
  }
  return <img key={list[i]} src={list[i]} alt={alt} loading="lazy" onError={() => setI(i + 1)} className={className} />
}
