import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { REGIONS } from '../constants/regions'

const EMPTY_COMPLEX = {
  name: '', slug: '', developer: '', address: '', city: 'Бишкек', region: 'bishkek',
  status: 'building', completion_quarter: '4 кв.', completion_year: 2028,
  price_per_sqm_usd: 0, price_per_sqm_kgs: 0, class_type: 'comfort',
  floors: 10, apartments_count: 100, verification_score: 0,
  verification_status: 'unverified', image_url: '', description: '',
  latitude: 42.87, longitude: 74.57,
}

const EMPTY_DOC = {
  doc_type: 'land_title', title: '', number: '', issued_by: '',
  issued_date: '', status: 'valid', file_url: '', is_public: true,
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/["«»]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const { openLogin } = useAuthModal()
  const navigate = useNavigate()
  const [complexes, setComplexes] = useState([])
  const [selected, setSelected] = useState(null)
  const [documents, setDocuments] = useState([])
  const [form, setForm] = useState(EMPTY_COMPLEX)
  const [docForm, setDocForm] = useState(EMPTY_DOC)
  const [editingId, setEditingId] = useState(null)
  const [editingDocId, setEditingDocId] = useState(null)
  const [tab, setTab] = useState('complexes')
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  const load = () => api.adminGetComplexes().then(setComplexes).catch(console.error)

  useEffect(() => { load() }, [])

  const loadDocs = (id) => {
    api.adminGetDocuments(id).then(setDocuments).catch(console.error)
  }

  const selectComplex = (c) => {
    setSelected(c)
    setForm({ ...c })
    setEditingId(c.id)
    setTab('documents')
    loadDocs(c.id)
  }

  const resetForm = () => {
    setForm(EMPTY_COMPLEX)
    setEditingId(null)
    setSelected(null)
    setDocuments([])
  }

  const saveComplex = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      if (editingId) {
        const updated = await api.adminUpdateComplex(editingId, form)
        setForm(updated)
        setMsg('Объект обновлён')
      } else {
        const created = await api.adminCreateComplex(form)
        setEditingId(created.id)
        setSelected(created)
        setForm(created)
        setMsg('Объект создан')
      }
      load()
    } catch (err) {
      setMsg(err.message)
    }
  }

  const deleteComplex = async (id) => {
    if (!confirm('Удалить объект?')) return
    await api.adminDeleteComplex(id)
    resetForm()
    setTab('complexes')
    load()
    setMsg('Удалено')
  }

  const recalculate = async () => {
    if (!editingId) return
    setMsg('')
    try {
      const updated = await api.adminRecalculate(editingId)
      setForm(updated)
      load()
      setMsg(`Рейтинг эсептелди: ${updated.verification_score}% (${updated.verification_status})`)
    } catch (err) {
      setMsg(err.message)
    }
  }

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.adminUpload(file, 'image')
      setForm((f) => ({ ...f, image_url: url }))
      setMsg('Сүрөт жүктөлдү')
    } catch (err) {
      setMsg(err.message)
    } finally {
      setUploading(false)
    }
  }

  const uploadPdf = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.adminUpload(file, 'pdf')
      setDocForm((f) => ({ ...f, file_url: url }))
      setMsg('PDF жүктөлдү')
    } catch (err) {
      setMsg(err.message)
    } finally {
      setUploading(false)
    }
  }

  const saveDoc = async (e) => {
    e.preventDefault()
    if (!editingId) return
    setMsg('')
    try {
      if (editingDocId) {
        await api.adminUpdateDocument(editingDocId, docForm)
      } else {
        await api.adminCreateDocument(editingId, docForm)
      }
      setDocForm(EMPTY_DOC)
      setEditingDocId(null)
      loadDocs(editingId)
      const updated = await api.adminRecalculate(editingId)
      setForm(updated)
      load()
      setMsg(`Документ сакталды. Рейтинг: ${updated.verification_score}%`)
    } catch (err) {
      setMsg(err.message)
    }
  }

  const editDoc = (d) => {
    setDocForm({ ...d })
    setEditingDocId(d.id)
  }

  const deleteDoc = async (id) => {
    if (!confirm('Удалить документ?')) return
    await api.adminDeleteDocument(id)
    loadDocs(editingId)
    const updated = await api.adminRecalculate(editingId)
    setForm(updated)
    load()
    setMsg(`Рейтинг жаңыланды: ${updated.verification_score}%`)
  }

  useEffect(() => {
    if (!authLoading && !user?.is_admin) {
      openLogin()
      navigate('/', { replace: true })
    }
  }, [authLoading, user, openLogin, navigate])

  if (authLoading || !user?.is_admin) return <p className="empty">Загрузка...</p>

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Админ панель</h1>
        <p className="muted">ЖК башкаруу · сүрөт · документ · рейтинг</p>
      </div>

      {msg && <div className="admin-msg">{msg}</div>}

      <div className="admin-tabs">
        <button type="button" className={tab === 'complexes' ? 'active' : ''} onClick={() => setTab('complexes')}>ЖК</button>
        <button type="button" className={tab === 'documents' ? 'active' : ''} onClick={() => setTab('documents')} disabled={!editingId}>Документтер</button>
      </div>

      <div className="admin-grid">
        <aside className="admin-list">
          <button type="button" className="btn-accent btn-sm btn-block" onClick={() => { resetForm(); setTab('complexes') }}>
            + Жаңы ЖК
          </button>
          {complexes.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`admin-list-item ${selected?.id === c.id ? 'active' : ''}`}
              onClick={() => selectComplex(c)}
            >
              <strong>{c.name}</strong>
              <span className={`badge badge-${c.verification_status === 'verified' ? 'ok' : c.verification_status === 'risk' ? 'bad' : 'warn'}`}>
                {c.verification_score}%
              </span>
            </button>
          ))}
        </aside>

        <div className="admin-form-panel">
          {tab === 'complexes' && (
            <form onSubmit={saveComplex} className="admin-form">
              <h2>{editingId ? 'ЖК түзөтүү' : 'Жаңы ЖК кошуу'}</h2>

              <div className="admin-upload-block">
                <label className="upload-label">
                  📷 Сүрөт жүктөө
                  <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
                </label>
                {form.image_url && (
                  <img src={form.image_url} alt="" className="admin-preview" />
                )}
                <label className="full">же URL
                  <input value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                </label>
              </div>

              <div className="form-grid">
                <label>Аталышы
                  <input
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setForm({ ...form, name, slug: editingId ? form.slug : slugify(name) })
                    }}
                    required
                  />
                </label>
                <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
                <label>Куруучу<input value={form.developer || ''} onChange={(e) => setForm({ ...form, developer: e.target.value })} /></label>
                <label>Дарек<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></label>
                <label>
                  Облус
                  <select value={form.region || 'bishkek'} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                    {REGIONS.filter((r) => r.slug).map((r) => (
                      <option key={r.slug} value={r.slug}>{r.slug}</option>
                    ))}
                  </select>
                </label>
                <label>Баа USD<input type="number" value={form.price_per_sqm_usd || ''} onChange={(e) => setForm({ ...form, price_per_sqm_usd: +e.target.value })} /></label>
                <label>Баа KGS<input type="number" value={form.price_per_sqm_kgs || ''} onChange={(e) => setForm({ ...form, price_per_sqm_kgs: +e.target.value })} /></label>
                <label>Класс
                  <select value={form.class_type || ''} onChange={(e) => setForm({ ...form, class_type: e.target.value })}>
                    <option value="economy">Эконом</option>
                    <option value="comfort">Комфорт</option>
                    <option value="business">Бизнес</option>
                    <option value="premium">Премиум</option>
                  </select>
                </label>
                <label>Объект статусу
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="building">Курулуп жатат</option>
                    <option value="commissioned">Берилген</option>
                  </select>
                </label>
                <label>Широта<input type="number" step="any" value={form.latitude || ''} onChange={(e) => setForm({ ...form, latitude: +e.target.value })} /></label>
                <label>Долгота<input type="number" step="any" value={form.longitude || ''} onChange={(e) => setForm({ ...form, longitude: +e.target.value })} /></label>
                <label className="full">Сүрөттөмө<textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></label>
              </div>

              <div className="admin-rating-box">
                <div>
                  <strong>Текшерүү рейтинги: {form.verification_score}%</strong>
                  <span className={`badge badge-${form.verification_status === 'verified' ? 'ok' : form.verification_status === 'risk' ? 'bad' : 'warn'}`}>
                    {form.verification_status}
                  </span>
                </div>
                <p className="muted">Документтерге негизделип автоматтык эсептелет</p>
                {editingId && (
                  <button type="button" className="btn-outline btn-sm" onClick={recalculate}>
                    🔄 Рейтингти кайра эсептөө
                  </button>
                )}
              </div>

              <div className="admin-actions">
                <button type="submit" className="btn-accent">Сактоо</button>
                {editingId && (
                  <button type="button" className="btn-danger" onClick={() => deleteComplex(editingId)}>Өчүрүү</button>
                )}
              </div>
            </form>
          )}

          {tab === 'documents' && editingId && (
            <div>
              <h2>Документтер — {form.name}</h2>
              <div className="doc-admin-list">
                {documents.map((d) => (
                  <div key={d.id} className="doc-admin-item">
                    <div>
                      <strong>{d.title}</strong>
                      <span className={`badge badge-${d.status === 'valid' ? 'ok' : d.status === 'missing' ? 'bad' : 'warn'}`}>{d.status}</span>
                      {d.file_url && <span className="muted"> · PDF ✓</span>}
                    </div>
                    <div className="admin-actions">
                      <button type="button" className="btn-ghost btn-sm" onClick={() => editDoc(d)}>Түзөтүү</button>
                      <button type="button" className="btn-danger btn-sm" onClick={() => deleteDoc(d.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={saveDoc} className="admin-form" style={{ marginTop: 24 }}>
                <h3>{editingDocId ? 'Документти түзөтүү' : 'Документ кошуу'}</h3>
                <div className="form-grid">
                  <label>Түрү
                    <select value={docForm.doc_type} onChange={(e) => setDocForm({ ...docForm, doc_type: e.target.value })}>
                      <option value="land_title">Жер участогу</option>
                      <option value="construction_permit">Куруу уруксаты</option>
                      <option value="expertise">Экспертиза</option>
                      <option value="commissioning">Берүү актысы</option>
                      <option value="ownership_scheme">Ээлигинин схемасы</option>
                    </select>
                  </label>
                  <label>Аталышы<input value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} required /></label>
                  <label>Номер<input value={docForm.number || ''} onChange={(e) => setDocForm({ ...docForm, number: e.target.value })} /></label>
                  <label>Статус
                    <select value={docForm.status} onChange={(e) => setDocForm({ ...docForm, status: e.target.value })}>
                      <option value="valid">✓ Действителен</option>
                      <option value="expired">⚠ Истёк</option>
                      <option value="missing">✕ Жок</option>
                      <option value="pending">◷ Текшерүүдө</option>
                    </select>
                  </label>
                  <label className="full upload-label">
                    📄 PDF жүктөө
                    <input type="file" accept=".pdf,application/pdf" onChange={uploadPdf} disabled={uploading} />
                  </label>
                  <label className="full">же PDF URL
                    <input value={docForm.file_url || ''} onChange={(e) => setDocForm({ ...docForm, file_url: e.target.value })} placeholder="https://..." />
                  </label>
                </div>
                <div className="admin-actions">
                  <button type="submit" className="btn-accent">Сактоо</button>
                  {editingDocId && (
                    <button type="button" className="btn-ghost" onClick={() => { setDocForm(EMPTY_DOC); setEditingDocId(null) }}>Жокко чыгаруу</button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
