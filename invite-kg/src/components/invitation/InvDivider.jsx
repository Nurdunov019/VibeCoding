export default function InvDivider({ gem = '✦' }) {
  return (
    <div className="w-inv-divider" aria-hidden>
      <span className="w-inv-divider-line" />
      <span className="w-inv-divider-gem">{gem}</span>
      <span className="w-inv-divider-line" />
    </div>
  )
}
