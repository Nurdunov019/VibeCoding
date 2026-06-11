import { LANGS } from '../i18n/translations'
import { useLocale } from '../context/LocaleContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLocale()

  return (
    <select
      className="lang-select"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Language"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  )
}
