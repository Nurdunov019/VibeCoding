import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { api } from '../api'
import { useLocale } from '../context/LocaleContext'
import { useRegion } from '../context/RegionContext'
import 'leaflet/dist/leaflet.css'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const BISHKEK = [42.8746, 74.5698]

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

  const complexLinks = (slug, status) => {
    const base = `/complex/${slug}`
    return (
      <div className="map-item-actions">
        <Link to={base} className="btn-outline btn-sm">{t('card.details')}</Link>
        <Link to={`${base}?tab=legal`} className="btn-legal btn-sm">{t('card.legal')}</Link>
        {status === 'commissioned' && (
          <Link to={`${base}?tab=reviews`} className="btn-outline btn-sm">{t('card.reviews')}</Link>
        )}
      </div>
    )
  }

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
                {m.image_url && <img src={m.image_url} alt="" />}
                <div className="map-list-body">
                  <strong>{m.name}</strong>
                  <span className="muted">{m.address}</span>
                  <span className={`badge badge-${m.verification_status === 'verified' ? 'ok' : m.verification_status === 'risk' ? 'bad' : 'warn'}`}>
                    {t('map.check')}: {m.verification_score}%
                  </span>
                  {complexLinks(m.slug, m.status)}
                </div>
              </article>
            ))}
          </section>

          <div className="map-container-wrap">
            <MapContainer center={BISHKEK} zoom={12} className="map-container" scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
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
                    <br />
                    <Link to={`/complex/${m.slug}?tab=legal`}>{t('card.legal')} →</Link>
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
