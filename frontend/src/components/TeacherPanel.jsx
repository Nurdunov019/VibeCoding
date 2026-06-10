import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { useApp } from '../context/AppContext'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import GroupChat from './GroupChat'

export default function TeacherPanel() {
  const { t } = useApp()
  const [tab, setTab] = useState('groups')
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [user, setUser] = useState(null)
  const [newStudent, setNewStudent] = useState({ username: '', password: '', full_name: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.me().then(setUser)
    api.teacherGroups().then((grps) => {
      setGroups(grps)
      if (grps.length > 0) setSelectedGroup((prev) => prev || grps[0].id)
    }).catch((err) => setError(err.message))
  }, [])

  const loadGroupData = useCallback(async () => {
    if (!selectedGroup) return
    try {
      const status = await api.groupStatus(selectedGroup)
      setMembers(status)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [selectedGroup])

  useAutoRefresh(loadGroupData, 30000)

  const handleConfirm = async (member) => {
    if (!member.progress_id) return
    try {
      await api.confirmProgress(member.progress_id)
      loadGroupData()
    } catch (err) {
      setError(err.message)
    }
  }

  const addStudent = async (e) => {
    e.preventDefault()
    try {
      await api.addStudent(selectedGroup, newStudent)
      setNewStudent({ username: '', password: '', full_name: '' })
      setMsg('✅')
      loadGroupData()
      const grps = await api.teacherGroups()
      setGroups(grps)
    } catch (err) {
      setError(err.message)
    }
  }

  const handlePromoteToTeacher = async (member) => {
    if (!confirm(`${member.full_name} устаз кылып белгилесизби?`)) return
    try {
      await api.promoteToTeacher(member.user_id)
      setMsg(`${member.full_name} устаз кылып белгиленди`)
      loadGroupData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <div className="teacher-header">
        <div>
          <h2>{t('teacher')}</h2>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'groups' ? 'active' : ''}`} onClick={() => setTab('groups')}>
          {t('groups')}
        </button>
        <button className={`tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
          {t('addStudent')}
        </button>
        <button className={`tab ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
          {t('chat')}
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}
      {msg && <p className="success-msg">{msg}</p>}

      {groups.length > 0 && (
        <div className="card">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('selectGroup')}</label>
            <select
              value={selectedGroup || ''}
              onChange={(e) => setSelectedGroup(Number(e.target.value))}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.student_count})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {tab === 'groups' && (
        <div className="card table-card">
          <h2>Күндөлүк окуу</h2>
          {groups.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>{t('noData')}</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('student')}</th>
                    <th>{t('todayScore')}</th>
                    <th>{t('days')}</th>
                    <th>{t('page')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.user_id}>
                      <td>{m.full_name}</td>
                      <td>
                        <span className={`badge ${m.read_today ? 'badge-ok' : 'badge-no'}`}>
                          {m.read_today ? t('readToday') : t('notRead')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${m.read_yesterday ? 'badge-ok' : 'badge-no'}`}>
                          {m.read_yesterday ? t('readToday') : t('notRead')}
                        </span>
                      </td>
                      <td>{m.today_page ? `${m.today_page}/${m.today_repetitions}` : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {m.read_today && !m.confirmed && m.progress_id && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleConfirm(m)}>
                              {t('confirm')}
                            </button>
                          )}
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handlePromoteToTeacher(m)}
                            title="Устаз кылуу"
                          >
                            👨‍🏫
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'add' && selectedGroup && (
        <div className="card">
          <h2>{t('addStudent')}</h2>
          <form onSubmit={addStudent}>
            <div className="grid-2">
              <div className="form-group">
                <label>{t('name')}</label>
                <input
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('username')}</label>
                <input
                  value={newStudent.username}
                  onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t('password')}</label>
              <input
                type="password"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">{t('add')}</button>
          </form>
        </div>
      )}

      {tab === 'chat' && user && (
        <div className="card">
          <h2>💬 {t('groupChat')}</h2>
          <GroupChat groupId={selectedGroup} user={user} />
        </div>
      )}
    </div>
  )
}
