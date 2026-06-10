import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'

function rankClass(rank) {
  if (rank === 1) return 'rank-1'
  if (rank === 2) return 'rank-2'
  if (rank === 3) return 'rank-3'
  return ''
}

export default function Home({ onShowLogin }) {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [ranking, setRanking] = useState([])
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    api.publicGroups().then((grps) => {
      setGroups(grps)
      if (grps.length > 0) setSelectedGroup(grps[0].id)
    }).catch((err) => setError(err.message))
  }, [])

  const load = useCallback(async () => {
    if (!selectedGroup) return
    try {
      const data = await api.groupRanking(selectedGroup)
      setRanking(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [selectedGroup])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  return (
    <div className="container">
      <div className="hero">
        <h1>Куран окуу рейтинги</h1>
        <p>Топ ичиндеги окуучулардын прогресси</p>
      </div>

      <p className="auto-refresh">Авто жаңылоо: 30 сек</p>
      {error && <p className="error-msg">{error}</p>}

      {groups.length > 0 && (
        <div className="card">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Топту тандаңыз</label>
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

      <div className="card table-card">
        <h2>🏆 Рейтинг</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Окуучу</th>
                <th>Бүгүнкү упай</th>
                <th>Жалпы упай</th>
                <th>Күн саны</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r) => (
                <tr key={r.user_id}>
                  <td className={rankClass(r.rank)}>{r.rank}</td>
                  <td>{r.full_name}</td>
                  <td>{r.today_score}</td>
                  <td>{r.total_score}</td>
                  <td>{r.total_days}</td>
                </tr>
              ))}
              {ranking.length === 0 && (
                <tr><td colSpan={5} style={{ color: 'var(--muted)' }}>Дайын маалымат жок</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!token && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button 
            onClick={onShowLogin}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Кирүү
          </button>
        </div>
      )}
    </div>
  )
}
