import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useCompare } from '../context/CompareContext'

const STATUS_LABELS = {
  verified: 'Проверен',
  partial: 'Частично',
  unverified: 'Не проверен',
  risk: 'Риск',
}

const CLASS_LABELS = {
  economy: 'Эконом',
  comfort: 'Комфорт',
  business: 'Бизнес',
  premium: 'Премиум',
}

export default function Compare() {
  const { slugs, remove, clear } = useCompare()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slugs.length < 2) {
      setItems([])
      return
    }
    setLoading(true)
    setError('')
    api.compareComplexes(slugs)
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slugs])

  if (slugs.length < 2) {
    return (
      <div className="compare-page">
        <h1>Сравнение объектов</h1>
        <p className="empty">Выберите минимум 2 ЖК на главной странице для сравнения.</p>
        <Link to="/" className="btn-primary">К объектам</Link>
      </div>
    )
  }

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Сравнение объектов</h1>
        <button type="button" className="btn-ghost" onClick={clear}>Очистить всё</button>
      </div>

      {loading && <p className="empty">Загрузка...</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && items.length > 0 && (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Параметр</th>
                {items.map((item) => (
                  <th key={item.complex.slug}>
                    <button type="button" className="compare-remove" onClick={() => remove(item.complex.slug)}>×</button>
                    <Link to={`/complex/${item.complex.slug}`}>{item.complex.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Застройщик</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.developer}</td>)}
              </tr>
              <tr>
                <td>Адрес</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.address}</td>)}
              </tr>
              <tr>
                <td>Цена / м²</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    <strong>${i.complex.price_per_sqm_usd?.toLocaleString()}</strong>
                    <br />
                    <span className="muted">{i.complex.price_per_sqm_kgs?.toLocaleString()} с</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Сдача</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.completion_quarter} {i.complex.completion_year}</td>)}
              </tr>
              <tr>
                <td>Класс</td>
                {items.map((i) => <td key={i.complex.slug}>{CLASS_LABELS[i.complex.class_type] || i.complex.class_type}</td>)}
              </tr>
              <tr>
                <td>Этажей</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.floors}</td>)}
              </tr>
              <tr>
                <td>Квартир</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.apartments_count}</td>)}
              </tr>
              <tr>
                <td>Проверка</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    <strong>{i.complex.verification_score}%</strong>
                    <br />
                    <span className={`badge badge-${i.complex.verification_status === 'verified' ? 'ok' : i.complex.verification_status === 'risk' ? 'bad' : 'warn'}`}>
                      {STATUS_LABELS[i.complex.verification_status]}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Документы</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    ✓ {i.documents_valid} / ✕ {i.documents_missing} / {i.documents_total}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
