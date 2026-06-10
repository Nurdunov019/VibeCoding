import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import ChartBars from './ChartBars'
import GroupChat from './GroupChat'

export default function StudentPanel({ user }) {
  const [tab, setTab] = useState('me')
  const [page, setPage] = useState(1)
  const [reps, setReps] = useState(20)
  const [progress, setProgress] = useState(null)
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [weekly, setWeekly] = useState([])
  const [pages, setPages] = useState([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.myGroups().then((grps) => {
      setGroups(grps)
      if (grps.length > 0) setSelectedGroup((prev) => prev || grps[0].id)
    })
  }, [])

  const load = useCallback(async () => {
    try {
      const [prog, w, p] = await Promise.all([
        api.myProgress(),
        api.weeklyChart(user.id),
        api.pageChart(user.id),
      ])
      setProgress(prog)
      if (prog) {
        setPage(prog.page_number)
        setReps(prog.repetitions)
      }
      setWeekly(w)
      setPages(p)
      if (selectedGroup) {
        const status = await api.groupStatus(selectedGroup)
        setMembers(status)
      }
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [user.id, selectedGroup])

  useAutoRefresh(load, 30000)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    setError('')
    try {
      const result = await api.saveProgress(Number(page), Number(reps))
      setProgress(result)
      setMsg('✅ Сакталды!')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <p className="auto-refresh">Авто жаңылоо: 30 сек</p>

      <div className="tabs">
        <button className={`tab ${tab === 'me' ? 'active' : ''}`} onClick={() => setTab('me')}>
          Мен
        </button>
        <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
          БААРЫ
        </button>
        <button className={`tab ${tab === 'charts' ? 'active' : ''}`} onClick={() => setTab('charts')}>
          Графиктер
        </button>
        <button className={`tab ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
          Чат
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {tab === 'me' && (
        <div className="card">
          <h2>Бүгүнкү прогресс — {user.full_name}</h2>
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label>Бет номери (1–604)</label>
                <input
                  type="number"
                  min={1}
                  max={604}
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Кайталоо саны</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  required
                />
              </div>
            </div>
            {progress && (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Упай: {progress.score}
                {progress.confirmed
                  ? ' · ✅ Устаз ырастады'
                  : ' · ⏳ Ырастоону күтүүдө'}
              </p>
            )}
            {msg && <p className="success-msg">{msg}</p>}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Сакталууда...' : 'Сактоо'}
            </button>
          </form>
        </div>
      )}

      {tab === 'all' && (
        <div className="card">
          <h2>БААРЫ — топтук статус</h2>
          {groups.length > 1 && (
            <div className="form-group">
              <label>Топ</label>
              <select
                value={selectedGroup || ''}
                onChange={(e) => setSelectedGroup(Number(e.target.value))}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th>Окуучу</th>
                <th>Бүгүн</th>
                <th>Кечээ</th>
                <th>Бет / Кайталоо</th>
                <th>Ырастоо</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.user_id}>
                  <td>{m.full_name}</td>
                  <td>
                    <span className={`badge ${m.read_today ? 'badge-ok' : 'badge-no'}`}>
                      {m.read_today ? 'Окуду' : 'Жок'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${m.read_yesterday ? 'badge-ok' : 'badge-no'}`}>
                      {m.read_yesterday ? 'Окуду' : 'Жок'}
                    </span>
                  </td>
                  <td>
                    {m.today_page ? `${m.today_page} / ${m.today_repetitions}` : '—'}
                  </td>
                  <td>
                    {m.read_today ? (
                      <span className={`badge ${m.confirmed ? 'badge-ok' : 'badge-wait'}`}>
                        {m.confirmed ? 'Ырасталды' : 'Күтүүдө'}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'charts' && (
        <div className="grid-2">
          <div className="card">
            <h2>Апталык кайталоолор</h2>
            <ChartBars
              data={weekly.map((w) => ({
                label: w.week_start.slice(5),
                value: w.total_repetitions,
              }))}
            />
          </div>
          <div className="card">
            <h2>Прогресс по беттер</h2>
            <ChartBars
              data={pages.slice(-10).map((p) => ({
                label: `Б.${p.page_number}`,
                value: p.total_repetitions,
              }))}
            />
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div className="card">
          <h2>💬 Топтук чат</h2>
          {groups.length > 1 && (
            <div className="form-group">
              <label>Топ</label>
              <select
                value={selectedGroup || ''}
                onChange={(e) => setSelectedGroup(Number(e.target.value))}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}
          <GroupChat groupId={selectedGroup} user={user} />
        </div>
      )}
    </div>
  )
}
