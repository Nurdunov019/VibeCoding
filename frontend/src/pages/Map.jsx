import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { api } from '../api'
import ComplexActionLinks from '../components/ComplexActionLinks'
import { useLocale } from '../context/LocaleContext'
import { useRegion } from '../context/RegionContext'
import { verificationBadgeClass } from '../utils/complex'
import { mediaUrl } from '../utils/mediaUrl'
import 'leaflet/dist/leaflet.css'
import { TILE_2GIS } from '../utils/mapTiles'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const BISHKEK = [42.8746, 74.5698]

function FitMapBounds({ markers }) {
  const map = useMap()
  useEffect(() => {
    const pts = markers.filter((m) => m.latitude && m.longitude)
    if (pts.length === 0) return
    if (pts.length === 1) {
      map.setView([pts[0].latitude, pts[0].longitude], 15, { animate: false })
      return
    }
    const bounds = L.latLngBounds(pts.map((m) => [m.latitude, m.longitude]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 })
  }, [markers, map])
  return null
}

export default function MapPage() {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLocale()
  const { region } = useRegion()
  const cityName = t(`regions.${region}`)

  useEffect(() => {
    api.getMapMarkers()
      .then(setMarkers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="map-page">
      <section className="page-header">
        <h1>{t('map.title')}</h1>
        <p className="muted">{t('map.sub', { city: cityName })}</p>
      </section>

      {loading ? (
        <p className="empty">{t('map.loading')}</p>
      ) : markers.length === 0 ? (
        <p className="empty">{t('map.noCoords')}</p>
      ) : (
        <div className="map-layout">
          <section className="map-list">
            {markers.map((m) => (
              <article key={m.slug} className="map-list-item">
                <Link to={`/complex/${m.slug}`} className="map-list-hit">
                  <div className="map-list-thumb">
                    {m.image_url ? (
                      <img src={mediaUrl(m.image_url)} alt={m.name} loading="lazy" decoding="async" />
                    ) : (
                      <div className="map-list-thumb-ph" aria-hidden>🏢</div>
                    )}
                  </div>
                  <div className="map-list-info">
                    <strong>{m.name}</strong>
                    <span className="muted">{m.address}</span>
                    <span className={`badge badge-${verificationBadgeClass(m.verification_status)}`}>
                      {t('map.check')}: {m.verification_score}%
                    </span>
                  </div>
                </Link>
                <ComplexActionLinks
                  slug={m.slug}
                  status={m.status}
                  legalDocUrl={m.legal_doc_url}
                  className="map-item-actions"
                />
              </article>
            ))}
          </section>

          <div className="map-container-wrap">
            <MapContainer center={BISHKEK} zoom={12} className="map-container" scrollWheelZoom>
              <TileLayer
                url={TILE_2GIS.url}
                attribution={TILE_2GIS.attribution}
                subdomains={TILE_2GIS.subdomains}
                maxZoom={TILE_2GIS.maxZoom}
              />
              <FitMapBounds markers={markers} />
              {markers.map((m) => (
                <Marker key={m.slug} position={[m.latitude, m.longitude]} icon={icon}>
                  <Popup>
                    <strong>{m.name}</strong>
                    <br />
                    {m.address}
                    <br />
                    ${m.price_per_sqm_usd?.toLocaleString()} / м²
                    <br />
                    {t('map.check')}: {m.verification_score}%
                    <br />
                    <Link to={`/complex/${m.slug}`}>{t('card.details')} →</Link>
                    {m.status === 'commissioned' && (
                      <>
                        <br />
                        <Link to={`/complex/${m.slug}?tab=reviews`}>{t('card.reviews')} →</Link>
                      </>
                    )}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  )
}
