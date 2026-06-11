import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import LocationSection from '../components/LocationSection'
import PdfViewer from '../components/PdfViewer'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'

const TAB_IDS = ['overview', 'location', 'building', 'documents', 'verify', 'legal']

const DOC_STATUS = {
  valid: '✓ Действителен',
  expired: '⚠ Истёк',
  missing: '✕ Отсутствует',
  pending: '◷ На проверке',
}

export default function ComplexDetail() {
  const { slug } = useParams()
  const { t } = useLocale()
  const { toggle, isSelected } = useCompare()
  const [tab, setTab] = useState('overview')
  const [complex, setComplex] = useState(null)
  const [documents, setDocuments] = useState([])
  const [verification, setVerification] = useState(null)
  const [email, setEmail] = useState('')
  const [accessInfo, setAccessInfo] = useState(null)
  const [viewingPdf, setViewingPdf] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.getComplex(slug),
      api.getDocuments(slug),
      api.verifyComplex(slug),
    ])
      .then(([c, d, v]) => {
        setComplex(c)
        setDocuments(d)
        setVerification(v)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const requestLegal = async (e) => {
    e.preventDefault()
    if (!email) return alert('Введите email')
    try {
      const data = await api.requestLegalAccess(slug, email, 3)
      setAccessInfo(data)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <p className="empty">Загрузка...</p>
  if (!complex) return <p className="empty">Объект не найден</p>

  return (
    <div className="detail">
      <Link to="/" className="back">← Все объекты</Link>

      <div className="detail-hero">
        {complex.image_url && (
          <Link to={`/complex/${slug}`} className="detail-img-wrap">
            <img src={complex.image_url} alt={complex.name} className="detail-img" />
          </Link>
        )}
        <div>
          <p className="eyebrow">{complex.city} • {complex.developer}</p>
          <h1>{complex.name}</h1>
          <p>{complex.address}</p>
          <div className="detail-badges">
            <span className="badge badge-score">Проверка: {complex.verification_score}%</span>
            <span className={`badge badge-${complex.verification_status === 'verified' ? 'ok' : complex.verification_status === 'risk' ? 'bad' : 'warn'}`}>
              {complex.verification_status}
            </span>
            <span className="price-tag">${complex.price_per_sqm_usd?.toLocaleString()} / м²</span>
          </div>
          <div className="detail-actions">
            <Link to="/map" className="btn-outline btn-sm">На карте</Link>
            <button
              type="button"
              className={`btn-compare btn-sm ${isSelected(slug) ? 'active' : ''}`}
              onClick={() => toggle(slug)}
            >
              {isSelected(slug) ? '✓ В сравнении' : '+ Сравнить'}
            </button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {TAB_IDS.map((id) => (
          <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {t(`detail.${id}`)}
          </button>
        ))}
      </div>

      <div className="tab-panel">
        {tab === 'overview' && (
          <div>
            <h2>{t('detail.overview')}</h2>
            <p>{complex.description}</p>
            <div className="info-grid">
              <div><span>{t('detail.class')}</span><strong>{complex.class_type}</strong></div>
              <div><span>{t('detail.completion')}</span><strong>{complex.completion_quarter} {complex.completion_year}</strong></div>
              <div><span>{t('detail.price')}</span><strong>${complex.price_per_sqm_usd} / {complex.price_per_sqm_kgs?.toLocaleString()} с</strong></div>
              <div><span>{t('detail.apartments')}</span><strong>{complex.apartments_count}</strong></div>
              <div><span>{t('detail.floors')}</span><strong>{complex.floors}</strong></div>
              <div><span>{t('detail.status')}</span><strong>{complex.status === 'commissioned' ? t('filter.commissioned') : t('filter.building')}</strong></div>
            </div>
          </div>
        )}

        {tab === 'location' && <LocationSection complex={complex} />}

        {tab === 'building' && (
          <div>
            <h2>Данные дома</h2>
            <div className="info-grid">
              <div><span>Застройщик</span><strong>{complex.developer}</strong></div>
              <div><span>Адрес</span><strong>{complex.address}</strong></div>
              <div><span>Корпусов</span><strong>{complex.buildings_count}</strong></div>
              <div><span>Этажность</span><strong>{complex.floors}</strong></div>
              <div><span>Класс жилья</span><strong>{complex.class_type}</strong></div>
              <div><span>Квартир в проекте</span><strong>{complex.apartments_count}</strong></div>
            </div>
          </div>
        )}

        {tab === 'documents' && (
          <div>
            <h2>Разрешительные документы</h2>
            <p className="muted">Публичная информация о документах объекта. PDF — только для просмотра.</p>
            <div className="doc-list">
              {documents.map((d) => (
                <div key={d.id} className={`doc-item doc-${d.status}`}>
                  <div>
                    <strong>{d.title}</strong>
                    {d.number && <p className="muted">№ {d.number} • {d.issued_by}</p>}
                  </div>
                  <div className="doc-item-actions">
                    <span>{DOC_STATUS[d.status] || d.status}</span>
                    {d.file_url && d.status === 'valid' && (
                      <button type="button" className="btn-outline btn-sm" onClick={() => setViewingPdf(d)}>
                        Просмотр PDF
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {viewingPdf && (
              <div className="pdf-modal">
                <div className="pdf-modal-header">
                  <h3>{viewingPdf.title}</h3>
                  <button type="button" className="btn-ghost" onClick={() => setViewingPdf(null)}>Закрыть</button>
                </div>
                <PdfViewer url={viewingPdf.file_url} title={viewingPdf.title} />
              </div>
            )}
          </div>
        )}

        {tab === 'verify' && verification && (
          <div>
            <h2>Проверить документы объекта</h2>
            <div className="verify-score">
              <div className="score-circle">{verification.score}%</div>
              <div>
                <strong>Статус: {verification.status}</strong>
                <p>Действительных: {verification.valid_documents} • Отсутствует: {verification.missing_documents} • Истекло: {verification.expired_documents}</p>
              </div>
            </div>
            <div className="check-list">
              {verification.checks.map((c) => (
                <div key={c.type} className={`check-item check-${c.status}`}>
                  <strong>{c.label}</strong>
                  <span>{c.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'legal' && (
          <div>
            <h2>Юридическое заключение</h2>
            <div className="legal-info">
              <p><strong>Рекомендация платформы:</strong> не давать постоянное скачивание файла — только просмотр на 3–4 дня.</p>
              <ul>
                <li>✓ Просмотр только на платформе</li>
                <li>✓ Доступ 3–4 дня</li>
                <li>✓ Водяной знак с email и датой</li>
                <li>✕ Скачивание отключено</li>
              </ul>
            </div>
            {!accessInfo ? (
              <form onSubmit={requestLegal} className="legal-form">
                <input type="email" placeholder="Ваш email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" className="btn-primary">Получить доступ на 3 дня</button>
              </form>
            ) : (
              <div className="access-granted">
                <p>{accessInfo.message}</p>
                <p>Доступ до: {new Date(accessInfo.expires_at).toLocaleString('ru')}</p>
                <Link to={accessInfo.view_url} className="btn-primary">Открыть заключение</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
