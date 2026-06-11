import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { api } from '../api'
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

  useEffect(() => {
    api.getMapMarkers()
      .then(setMarkers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="map-page">
      <section className="page-header">
        <h1>Поиск на карте</h1>
        <p className="muted">ЖК Бишкекте — текшерүү статусу жана баасы</p>
      </section>

      {loading ? (
        <p className="empty">Загрузка карты...</p>
      ) : markers.length === 0 ? (
        <p className="empty">Координаталары бар объекттер жок</p>
      ) : (
        <div className="map-wrap">
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
                  Проверка: {m.verification_score}%
                  <br />
                  <Link to={`/complex/${m.slug}`}>Подробнее →</Link>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <aside className="map-sidebar">
            {markers.map((m) => (
              <Link key={m.slug} to={`/complex/${m.slug}`} className="map-list-item">
                {m.image_url && <img src={m.image_url} alt="" />}
                <div>
                  <strong>{m.name}</strong>
                  <span className="muted">{m.address}</span>
                  <span className={`badge badge-${m.verification_status === 'verified' ? 'ok' : m.verification_status === 'risk' ? 'bad' : 'warn'}`}>
                    {m.verification_score}%
                  </span>
                </div>
              </Link>
            ))}
          </aside>
        </div>
      )}
    </div>
  )
}
