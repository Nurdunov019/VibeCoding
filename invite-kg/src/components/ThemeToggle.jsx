import { useWeddingTheme } from '../context/WeddingThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useWeddingTheme()

  return (
    <button
      type="button"
      className={`theme-toggle${className ? ` ${className}` : ''}`}
      onClick={toggleTheme}
      aria-label={theme === 'day' ? 'Түнкү тема' : 'Күндүзгү тема'}
      title={theme === 'day' ? 'Night wedding' : 'Day wedding'}
    >
      <span className="theme-toggle-icon" aria-hidden>
        {theme === 'day' ? '🌙' : '☀️'}
      </span>
      <span className="theme-toggle-label">
        {theme === 'day' ? 'Night' : 'Day'}
      </span>
    </button>
  )
}
