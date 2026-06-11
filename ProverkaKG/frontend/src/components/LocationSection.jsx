import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CATEGORY_COLORS, getNearbyPlaces } from '../data/nearbyPlaces'
import { useLocale } from '../context/LocaleContext'

const homeIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [28, 46],
  iconAnchor: [14, 46],
})

function poiIcon(color, emoji) {
  return L.divIcon({
    className: 'poi-marker-wrap',
    html: `<div class="poi-marker" style="background:${color}">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

const CATEGORIES = [
  { id: 'kindergarten', icon: '🧒' },
  { id: 'shop', icon: '🛒' },
  { id: 'bus', icon: '🚌' },
  { id: 'school', icon: '🏫' },
  { id: 'pharmacy', icon: '💊' },
]

function MapController({ bounds, flyTo }) {
  const map = useMap()
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo, 17, { duration: 0.6 })
      return
    }
    if (bounds?.length > 1) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 16 })
    }
  }, [bounds, flyTo, map])
  return null
}

export default function LocationSection({ complex }) {
  const { t } = useLocale()
  const hasCoords = complex.latitude && complex.longitude
  const center = hasCoords ? [complex.latitude, complex.longitude] : [42.8746, 74.5698]

  const nearby = useMemo(
    () => getNearbyPlaces(complex.slug, complex.latitude, complex.longitude),
    [complex.slug, complex.latitude, complex.longitude]
  )

  const [category, setCategory] = useState('kindergarten')
  const [showAll, setShowAll] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [flyTo, setFlyTo] = useState(null)

  const places = nearby[category] || []
  const visible = showAll ? places : places.slice(0, 3)
  const catMeta = CATEGORIES.find((c) => c.id === category)

  const bounds = useMemo(() => {
    const pts = [[center[0], center[1]]]
    places.forEach((p) => { if (p.lat && p.lng) pts.push([p.lat, p.lng]) })
    return pts
  }, [places, center])

  const handleCategory = (id) => {
    setCategory(id)
    setShowAll(false)
    setSelectedIdx(null)
    setFlyTo(null)
  }

  const handlePlaceClick = (place, idx) => {
    setSelectedIdx(idx)
    if (place.lat && place.lng) setFlyTo([place.lat, place.lng])
  }

  const mapsUrl = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${complex.latitude}&mlon=${complex.longitude}#map=16/${complex.latitude}/${complex.longitude}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(complex.address + ' ' + complex.city)}`

  return (
    <section className="location-section">
      <h2>{t('location.title')}</h2>

      <div className="location-map-wrap">
        <MapContainer center={center} zoom={15} className="location-map" scrollWheelZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController bounds={bounds} flyTo={flyTo} />
          <Marker position={center} icon={homeIcon}>
            <Popup><strong>{complex.name}</strong><br />{complex.address}</Popup>
          </Marker>
          {places.map((place, i) => place.lat && place.lng && (
            <Marker
              key={`${category}-${i}`}
              position={[place.lat, place.lng]}
              icon={poiIcon(CATEGORY_COLORS[category], catMeta?.icon || '•')}
              eventHandlers={{ click: () => setSelectedIdx(i) }}
            >
              <Popup>
                <strong>{place.name}</strong><br />
                🚶 {place.walkMin} {t('location.min')} · {place.distanceM} {t('location.m')}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="location-map-link">
          {t('location.openMap')} →
        </a>
      </div>

      <div className="location-address">
        <strong>{complex.address}</strong>
        <span>{complex.city}</span>
      </div>

      <div className="location-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`loc-cat ${category === cat.id ? 'active' : ''}`}
            onClick={() => handleCategory(cat.id)}
            style={category === cat.id ? { borderColor: CATEGORY_COLORS[cat.id] } : {}}
          >
            <span>{cat.icon}</span>
            {t(`location.${cat.id}`)}
            <span className="loc-cat-count">{(nearby[cat.id] || []).length}</span>
          </button>
        ))}
      </div>

      <p className="location-hint muted">{t('location.mapHint')}</p>

      <ul className="location-list">
        {visible.map((place, i) => (
          <li
            key={i}
            className={`location-item ${selectedIdx === i ? 'selected' : ''}`}
            onClick={() => handlePlaceClick(place, i)}
            onKeyDown={(e) => e.key === 'Enter' && handlePlaceClick(place, i)}
            role="button"
            tabIndex={0}
          >
            <span className="location-item-dot" style={{ background: CATEGORY_COLORS[category] }} />
            <div>
              <strong>{place.name}</strong>
              <span className="location-meta">
                {t(`location.${category}`)} · 🚶 {place.walkMin} {t('location.min')} · {place.distanceM} {t('location.m')}
              </span>
            </div>
            <span className="location-chevron">›</span>
          </li>
        ))}
      </ul>

      {places.length > 3 && !showAll && (
        <button type="button" className="location-show-all" onClick={() => setShowAll(true)}>
          {t('location.showAll')} ↓
        </button>
      )}

      <Link to="/map" className="location-full-map">{t('location.searchOnMap')}</Link>
    </section>
  )
}
