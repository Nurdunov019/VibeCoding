export default function ChartBars({ data }) {
  if (!data.length) {
    return <p style={{ color: 'var(--muted)' }}>Дайын маалымат жок</p>
  }

  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div>
      {data.map((d, i) => (
        <div className="chart-bar" key={i}>
          <span className="label">{d.label}</span>
          <div className="bar-wrap">
            <div className="bar" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="value">{d.value}</span>
        </div>
      ))}
    </div>
  )
}
