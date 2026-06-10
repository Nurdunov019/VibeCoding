import { useCallback, useState } from 'react'
import { api } from '../api'
import { useAutoRefresh } from '../hooks/useAutoRefresh'

export default function UserManage({ user, groups, selectedGroup }) {
  const [users, setUsers] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ full_name: '', username: '', password: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await api.listUsers()
      setUsers(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useAutoRefresh(load, 60000)

  const startEdit = (u) => {
    setEditing(u.id)
    setForm({ full_name: u.full_name, username: u.username, password: '' })
    setMsg('')
    setError('')
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        full_name: form.full_name,
        username: form.username,
      }
      if (form.password) payload.password = form.password
      await api.updateUser(editing, payload)
      setMsg('Сакталды!')
      setEditing(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const removeFromGroup = async (userId) => {
    if (!selectedGroup || !confirm('Окуучуну топтон чыгаргыңыз келеби?')) return
    try {
      await api.removeFromGroup(userId, selectedGroup)
      setMsg('Топтон чыгарылды')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      {error && <p className="error-msg">{error}</p>}
      {msg && <p className="success-msg">{msg}</p>}

      <div className="card">
        <h2>👤 Колдонуучуларды башкаруу</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Бардык колдонуучулардын логин, пароль жана атын өзгөртүңүз
        </p>

        <table>
          <thead>
            <tr>
              <th>Аты</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>Топтор</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                {editing === u.id ? (
                  <td colSpan={5}>
                    <form onSubmit={saveEdit} className="edit-form">
                      <div className="grid-2">
                        <div className="form-group">
                          <label>Аты</label>
                          <input
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Логин</label>
                          <input
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Жаңы пароль (бош калтырсаңыз — өзгөрбөйт)</label>
                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          placeholder="Жаңы пароль"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className="btn btn-primary btn-sm">Сактоо</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>
                          Жокко чыгаруу
                        </button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td>{u.full_name}</td>
                    <td>{u.username}</td>
                    <td><span className="badge badge-wait">{u.role}</span></td>
                    <td>{u.groups?.join(', ') || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => startEdit(u)}>
                          Өзгөртүү
                        </button>
                        {u.role === 'student' && selectedGroup && (
                          <button className="btn btn-secondary btn-sm" onClick={() => removeFromGroup(u.id)}>
                            Чыгаруу
                          </button>
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
