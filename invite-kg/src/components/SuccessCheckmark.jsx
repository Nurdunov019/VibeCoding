export default function SuccessCheckmark({ className = '' }) {
  return (
    <div className={`success-check${className ? ` ${className}` : ''}`} aria-hidden>
      <svg viewBox="0 0 52 52" fill="none">
        <circle className="success-check-circle" cx="26" cy="26" r="24" />
        <path className="success-check-mark" d="M14 27l8 8 16-16" />
      </svg>
    </div>
  )
}
