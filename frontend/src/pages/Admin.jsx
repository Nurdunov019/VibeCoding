import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { REGIONS } from '../constants/regions'
import { useLocale } from '../context/LocaleContext'
import { statusLabel, translateApiError } from '../utils/translate'

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
  const { t } = useLocale()
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

  const scrollToForm = () => {
    requestAnimationFrame(() => {
      const title = document.querySelector('.admin-form-title')
      if (!title) return
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 64
      const y = title.getBoundingClientRect().top + window.scrollY - headerH - 56
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    })
  }

  const selectComplex = (c) => {
    setSelected(c)
    setForm({ ...c })
    setEditingId(c.id)
    setTab('complexes')
    loadDocs(c.id)
    setMsg('')
    scrollToForm()
  }

  const startNewComplex = () => {
    resetForm()
    setTab('complexes')
    setMsg(t('admin.newComplexHint'))
    scrollToForm()
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
        setMsg(t('admin.updated'))
      } else {
        const created = await api.adminCreateComplex(form)
        setEditingId(created.id)
        setSelected(created)
        setForm(created)
        setMsg(t('admin.created'))
      }
      load()
    } catch (err) {
      setMsg(translateApiError(err.message, t))
    }
  }

  const deleteComplex = async (id) => {
    if (!confirm(t('admin.confirmDeleteComplex'))) return
    await api.adminDeleteComplex(id)
    resetForm()
    setTab('complexes')
    load()
    setMsg(t('admin.deleted'))
  }

  const recalculate = async () => {
    if (!editingId) return
    setMsg('')
    try {
      const updated = await api.adminRecalculate(editingId)
      setForm(updated)
      load()
      setMsg(t('admin.recalculated', {
        score: updated.verification_score,
        status: statusLabel(t, 'card', updated.verification_status),
      }))
    } catch (err) {
      setMsg(translateApiError(err.message, t))
    }
  }

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.adminUpload(file, 'image')
      setForm((f) => ({ ...f, image_url: url }))
      setMsg(t('admin.imageUploaded'))
    } catch (err) {
      setMsg(translateApiError(err.message, t))
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
      setMsg(t('admin.pdfUploaded'))
    } catch (err) {
      setMsg(translateApiError(err.message, t))
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
      setMsg(t('admin.docSaved', { score: updated.verification_score }))
    } catch (err) {
      setMsg(translateApiError(err.message, t))
    }
  }

  const editDoc = (d) => {
    setDocForm({ ...d })
    setEditingDocId(d.id)
  }

  const deleteDoc = async (id) => {
    if (!confirm(t('admin.confirmDeleteDoc'))) return
    await api.adminDeleteDocument(id)
    loadDocs(editingId)
    const updated = await api.adminRecalculate(editingId)
    setForm(updated)
    load()
    setMsg(t('admin.ratingUpdated', { score: updated.verification_score }))
  }

  useEffect(() => {
    if (!authLoading && !user?.is_admin) {
      navigate('/', { replace: true })
      openLogin()
    }
  }, [authLoading, user, openLogin, navigate])

  if (authLoading || !user?.is_admin) return <p className="empty">{t('admin.loading')}</p>

  return (
    <div className="admin-page">
      <div className="admin-sticky">
        <div className="admin-header">
          <h1>{t('admin.title')}</h1>
          <p className="muted">{t('admin.sub')}</p>
        </div>
        <div className="admin-tabs">
          <button type="button" className={tab === 'complexes' ? 'active' : ''} onClick={() => setTab('complexes')}>{t('admin.tabComplexes')}</button>
          <button type="button" className={tab === 'documents' ? 'active' : ''} onClick={() => setTab('documents')} disabled={!editingId}>{t('admin.tabDocuments')}</button>
        </div>
      </div>

      {msg && <div className="admin-msg">{msg}</div>}

      <div className="admin-grid">
        <aside className="admin-list-wrap">
          <button
            type="button"
            className={`btn-accent btn-sm btn-block admin-new-btn${!editingId ? ' active' : ''}`}
            onClick={startNewComplex}
          >
            + {t('admin.newComplex')}
          </button>
          <div className="admin-list">
            <p className="admin-list-title">{t('admin.tabComplexes')}</p>
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
          </div>
        </aside>

        <div className="admin-form-panel">
          {tab === 'complexes' && (
            <form onSubmit={saveComplex} className="admin-form">
              <h2 className="admin-form-title">{editingId ? t('admin.editComplex') : t('admin.addComplex')}</h2>

              <div className="admin-upload-block">
                <label className="upload-label">
                  📷 {t('admin.uploadImage')}
                  <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
                </label>
                {form.image_url && (
                  <img src={form.image_url} alt="" className="admin-preview" />
                )}
                <label className="full">{t('admin.orUrl')}
                  <input value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                </label>
              </div>

              <div className="form-grid">
                <label>{t('admin.formName')}
                  <input
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setForm({ ...form, name, slug: editingId ? form.slug : slugify(name) })
                    }}
                    required
                  />
                </label>
                <label>{t('admin.formSlug')}<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
                <label>{t('admin.formDeveloper')}<input value={form.developer || ''} onChange={(e) => setForm({ ...form, developer: e.target.value })} /></label>
                <label>{t('admin.formAddress')}<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></label>
                <label>
                  {t('admin.formRegion')}
                  <select value={form.region || 'bishkek'} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                    {REGIONS.map((r) => (
                      <option key={r.slug} value={r.slug}>{t(`regions.${r.key}`)}</option>
                    ))}
                  </select>
                </label>
                <label>{t('admin.formPriceUsd')}<input type="number" value={form.price_per_sqm_usd || ''} onChange={(e) => setForm({ ...form, price_per_sqm_usd: +e.target.value })} /></label>
                <label>{t('admin.formPriceKgs')}<input type="number" value={form.price_per_sqm_kgs || ''} onChange={(e) => setForm({ ...form, price_per_sqm_kgs: +e.target.value })} /></label>
                <label>{t('admin.formClass')}
                  <select value={form.class_type || ''} onChange={(e) => setForm({ ...form, class_type: e.target.value })}>
                    <option value="economy">{t('filter.economy')}</option>
                    <option value="comfort">{t('filter.comfort')}</option>
                    <option value="business">{t('filter.business')}</option>
                    <option value="premium">{t('filter.premium')}</option>
                  </select>
                </label>
                <label>{t('admin.formComplexStatus')}
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="building">{t('filter.building')}</option>
                    <option value="commissioned">{t('filter.commissioned')}</option>
                  </select>
                </label>
                <label>{t('admin.formLat')}<input type="number" step="any" value={form.latitude || ''} onChange={(e) => setForm({ ...form, latitude: +e.target.value })} /></label>
                <label>{t('admin.formLng')}<input type="number" step="any" value={form.longitude || ''} onChange={(e) => setForm({ ...form, longitude: +e.target.value })} /></label>
                <label className="full">{t('admin.formDescription')}<textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></label>
              </div>

              <div className="admin-rating-box">
                <div>
                  <strong>{t('admin.rating')}: {form.verification_score}%</strong>
                  <span className={`badge badge-${form.verification_status === 'verified' ? 'ok' : form.verification_status === 'risk' ? 'bad' : 'warn'}`}>
                    {statusLabel(t, 'card', form.verification_status)}
                  </span>
                </div>
                <p className="muted">{t('admin.ratingHint')}</p>
                {editingId && (
                  <button type="button" className="btn-outline btn-sm" onClick={recalculate}>
                    🔄 {t('admin.recalculate')}
                  </button>
                )}
              </div>

              <div className="admin-actions">
                <button type="submit" className="btn-accent">{t('admin.save')}</button>
                {editingId && (
                  <button type="button" className="btn-danger" onClick={() => deleteComplex(editingId)}>{t('admin.delete')}</button>
                )}
              </div>
            </form>
          )}

          {tab === 'documents' && editingId && (
            <div>
              <h2>{t('admin.documents')} — {form.name}</h2>
              <div className="doc-admin-list">
                {documents.map((d) => (
                  <div key={d.id} className="doc-admin-item">
                    <div>
                      <strong>{statusLabel(t, 'docTypes', d.doc_type) || d.title}</strong>
                      <span className={`badge badge-${d.status === 'valid' ? 'ok' : d.status === 'missing' ? 'bad' : 'warn'}`}>
                        {statusLabel(t, 'docStatus', d.status)}
                      </span>
                      {d.file_url && <span className="muted"> · PDF ✓</span>}
                    </div>
                    <div className="admin-actions">
                      <button type="button" className="btn-ghost btn-sm" onClick={() => editDoc(d)}>{t('admin.edit')}</button>
                      <button type="button" className="btn-danger btn-sm" onClick={() => deleteDoc(d.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={saveDoc} className="admin-form" style={{ marginTop: 24 }}>
                <h3>{editingDocId ? t('admin.editDoc') : t('admin.addDoc')}</h3>
                <div className="form-grid">
                  <label>{t('admin.formDocType')}
                    <select value={docForm.doc_type} onChange={(e) => setDocForm({ ...docForm, doc_type: e.target.value })}>
                      {['land_title', 'construction_permit', 'expertise', 'commissioning', 'ownership_scheme'].map((type) => (
                        <option key={type} value={type}>{t(`docTypes.${type}`)}</option>
                      ))}
                    </select>
                  </label>
                  <label>{t('admin.formDocTitle')}<input value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} required /></label>
                  <label>{t('admin.formDocNumber')}<input value={docForm.number || ''} onChange={(e) => setDocForm({ ...docForm, number: e.target.value })} /></label>
                  <label>{t('admin.formDocStatus')}
                    <select value={docForm.status} onChange={(e) => setDocForm({ ...docForm, status: e.target.value })}>
                      {['valid', 'expired', 'missing', 'pending'].map((s) => (
                        <option key={s} value={s}>{t(`docStatus.${s}`)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="full upload-label">
                    📄 {t('admin.uploadPdf')}
                    <input type="file" accept=".pdf,application/pdf" onChange={uploadPdf} disabled={uploading} />
                  </label>
                  <label className="full">{t('admin.orPdfUrl')}
                    <input value={docForm.file_url || ''} onChange={(e) => setDocForm({ ...docForm, file_url: e.target.value })} placeholder="https://..." />
                  </label>
                </div>
                <div className="admin-actions">
                  <button type="submit" className="btn-accent">{t('admin.save')}</button>
                  {editingDocId && (
                    <button type="button" className="btn-ghost" onClick={() => { setDocForm(EMPTY_DOC); setEditingDocId(null) }}>{t('admin.cancel')}</button>
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
