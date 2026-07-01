import Reveal from '../Reveal'

export default function PremiumInvite({ data }) {
  const { invitation } = data
  return (
    <section id="pr-invite" className="pr-section pr-panel">
      <Reveal variant="blur">
        <p className="pr-invite-greeting">{invitation.greeting}</p>
      </Reveal>
      {invitation.lines.map((line, i) => (
        <Reveal key={line} variant="fade" delay={i * 100}>
          <p className="pr-invite-line">{line}</p>
        </Reveal>
      ))}
    </section>
  )
}
