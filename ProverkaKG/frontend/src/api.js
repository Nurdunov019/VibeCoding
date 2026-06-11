const API = '/api'

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const detail = err.detail
    const msg = typeof detail === 'string' ? detail : Array.isArray(detail) ? detail[0]?.msg : 'Ошибка сервера'
    throw new Error(msg || 'Ошибка сервера')
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getComplexes: (params = {}) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'undefined'))
    const q = new URLSearchParams(clean)
    return request(`/complexes?${q}`)
  },
  getStats: () => request('/complexes/stats'),
  getMapMarkers: () => request('/complexes/map'),
  getComplex: (slug) => request(`/complexes/${slug}`),
  compareComplexes: (slugs) =>
    request('/complexes/compare', { method: 'POST', body: JSON.stringify({ slugs }) }),
  getDocuments: (slug) => request(`/documents/complex/${slug}`),
  verifyComplex: (slug) => request(`/documents/verify/${slug}`),
  requestLegalAccess: (slug, email, days = 3) =>
    request(`/legal/request/${slug}`, { method: 'POST', body: JSON.stringify({ email, days }) }),
  viewLegalReport: (token) => request(`/legal/view/${token}`),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password, full_name) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, full_name }) }),
  me: () => request('/auth/me'),

  adminGetComplexes: () => request('/admin/complexes'),
  adminCreateComplex: (data) =>
    request('/admin/complexes', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateComplex: (id, data) =>
    request(`/admin/complexes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteComplex: (id) =>
    request(`/admin/complexes/${id}`, { method: 'DELETE' }),
  adminGetDocuments: (complexId) =>
    request(`/admin/complexes/${complexId}/documents`),
  adminCreateDocument: (complexId, data) =>
    request(`/admin/complexes/${complexId}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateDocument: (id, data) =>
    request(`/admin/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteDocument: (id) =>
    request(`/admin/documents/${id}`, { method: 'DELETE' }),
  adminRecalculate: (complexId) =>
    request(`/admin/complexes/${complexId}/recalculate`, { method: 'POST' }),
  adminUpload: async (file, kind = 'image') => {
    const token = localStorage.getItem('token')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`${API}/admin/upload?kind=${kind}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Жүктөө катасы')
    }
    return res.json()
  },
}
