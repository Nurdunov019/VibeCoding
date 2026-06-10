const API = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API}${path}`, { ...options, headers })
  if (res.status === 401 && !path.includes('/auth/login')) {
    localStorage.removeItem('token')
    if (!path.includes('/ranking')) {
      window.location.href = '/login'
    }
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Ката кетти')
  }
  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json()
  }
  return res
}

export const api = {
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  me: () => request('/auth/me'),

  config: () => request('/config'),

  publicGroups: () => request('/groups/public'),

  groupRanking: (groupId) => request(`/ranking/group/${groupId}`),

  telegramLogin: (tgUser) =>
    request('/auth/telegram', { method: 'POST', body: JSON.stringify(tgUser) }),

  telegramWebApp: (initData) =>
    request('/auth/telegram-webapp', { method: 'POST', body: JSON.stringify({ init_data: initData }) }),

  myProgress: () => request('/progress/me'),

  saveProgress: (page_number, repetitions) =>
    request('/progress', { method: 'POST', body: JSON.stringify({ page_number, repetitions }) }),

  groupStatus: (groupId) => request(`/progress/group/${groupId}`),

  confirmProgress: (progressId) =>
    request(`/progress/${progressId}/confirm`, { method: 'POST' }),

  myGroups: () => request('/groups/my'),

  teacherGroups: () => request('/groups'),

  createGroup: (name, teacher_id) =>
    request('/groups', { method: 'POST', body: JSON.stringify({ name, teacher_id }) }),

  listTeachers: () => request('/users/teachers'),

  getChat: (groupId) => request(`/chat/${groupId}`),

  sendChat: (groupId, text) =>
    request(`/chat/${groupId}`, { method: 'POST', body: JSON.stringify({ text }) }),

  groupStudents: (groupId) => request(`/groups/${groupId}/students`),

  addStudent: (groupId, data) =>
    request(`/groups/${groupId}/students`, { method: 'POST', body: JSON.stringify(data) }),

  weeklyChart: (userId) => request(`/charts/weekly/${userId}`),

  pageChart: (userId) => request(`/charts/pages/${userId}`),

  downloadReport: (months = 3, groupId = null) => {
    const params = new URLSearchParams({ months })
    if (groupId) params.set('group_id', groupId)
    return request(`/reports/excel?${params}`)
  },

  listUsers: () => request('/users'),

  updateUser: (userId, data) =>
    request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) }),

  removeFromGroup: (userId, groupId) =>
    request(`/users/${userId}/from-group/${groupId}`, { method: 'DELETE' }),

  promoteToTeacher: (userId) =>
    request(`/users/${userId}/promote-to-teacher`, { method: 'POST' }),
}
