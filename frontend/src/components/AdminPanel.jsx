import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import UserManage from './UserManage'

export default function AdminPanel({ user }) {
  const [tab, setTab] = useState('groups')
  const [groups, setGroups] = useState([])
  const [teachers, setTeachers] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [newGroup, setNewGroup] = useState({ name: '', teacher_id: '' })
  const [newStudent, setNewStudent] = useState({ username: '', password: '', full_name: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const loadGroups = useCallback(async () => {
    try {
      const [grps, tchs] = await Promise.all([api.teacherGroups(), api.listTeachers()])
      setGroups(grps)
      setTeachers(tchs)
      if (grps.length > 0) setSelectedGroup((prev) => prev || grps[0].id)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => { loadGroups() }, [loadGroups])

  const createGroup = async (e) => {
    e.preventDefault()
    try {
      await api.createGroup(newGroup.name, Number(newGroup.teacher_id))
      setNewGroup({ name: '', teacher_id: '' })
      setMsg('Топ түзүлдү!')
      loadGroups()
    } catch (err) {
      setError(err.message)
    }
  }

  const addStudent = async (e) => {
    e.preventDefault()
    try {
      await api.addStudent(selectedGroup, newStudent)
      setNewStudent({ username: '', password: '', full_name: '' })
      setMsg('Окуучу кошулду!')
      loadGroups()
    } catch (err) {
      setError(err.message)
    }
  }

  const downloadReport = async () => {
    const token = localStorage.getItem('token')
    const params = new URLSearchParams({ months: '3' })
    if (selectedGroup) params.set('group_id', selectedGroup)
    const res = await fetch(`/api/reports/excel?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quran_report_3m.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <div className="teacher-header">
        <div>
          <h2>Админ</h2>
          <p className="teacher-subtitle">Бардык колдонуучуларды жана топторду башкаруу</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'groups' ? 'active' : ''}`} onClick={() => setTab('groups')}>
          Топтор
        </button>
        <button className={`tab ${tab === 'manage' ? 'active' : ''}`} onClick={() => setTab('manage')}>
          Башкаруу
        </button>
        <button className={`tab ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>
          Отчёттор
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}
      {msg && <p className="success-msg">{msg}</p>}

      {tab === 'manage' && (
        <UserManage user={user} groups={groups} selectedGroup={selectedGroup} />
      )}

      {tab === 'reports' && (
        <div className="card">
          <h2>📊 Excel отчёт (3 ай)</h2>
          <button className="btn btn-primary" onClick={downloadReport}>Жүктөп алуу</button>
        </div>
      )}

      {tab === 'groups' && (
        <>
          <div className="grid-2">
            <div className="card">
              <h2>Жаңы топ</h2>
              <form onSubmit={createGroup}>
                <div className="form-group">
                  <label>Топ аты</label>
                  <input
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Устаз</label>
                  <select
                    value={newGroup.teacher_id}
                    onChange={(e) => setNewGroup({ ...newGroup, teacher_id: e.target.value })}
                    required
                  >
                    <option value="">Тандаңыз...</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name} ({t.username})</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Түзүү</button>
              </form>
            </div>

            <div className="card">
              <h2>Топтор ({groups.length})</h2>
              {groups.length > 0 ? (
                <select
                  value={selectedGroup || ''}
                  onChange={(e) => setSelectedGroup(Number(e.target.value))}
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name} ({g.student_count} окуучу)</option>
                  ))}
                </select>
              ) : (
                <p style={{ color: 'var(--muted)' }}>Топ жок</p>
              )}
            </div>
          </div>

          {selectedGroup && (
            <div className="card">
              <h2>Окуучу кошуу</h2>
              <form onSubmit={addStudent}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Аты</label>
                    <input
                      value={newStudent.full_name}
                      onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Логин</label>
                    <input
                      value={newStudent.username}
                      onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Пароль</label>
                  <input
                    type="password"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Кошуу</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}
