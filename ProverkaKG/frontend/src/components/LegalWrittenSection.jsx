import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { statusLabel } from '../utils/translate'
import { localizeLegalReport, translatePhrase } from '../utils/translateContent'

export default function LegalWrittenSection({
  report,
  slug,
  accessInfo,
  email,
  onEmailChange,
  onRequest,
  variant = 'default',
  hideAccessForm = false,
}) {
  const { t, lang } = useLocale()
  if (!report) return null

  const localized = localizeLegalReport(report, slug, lang)

  const rootClass = variant === 'showcase' ? 'legal-written legal-written--showcase' : 'legal-written'

  return (
    <div className={rootClass}>
      <div className="legal-written-head">
        <div>
          <p className="legal-written-date">{t('legal.prepared')}: {localized.prepared_at}</p>
          <h4>{localized.title}</h4>
        </div>
        <span className={`legal-written-risk risk-${localized.risk_level}`}>
          {t('legal.risk')}: {statusLabel(t, 'risk', localized.risk_level)}
        </span>
      </div>

      {localized.summary && <p className="legal-written-summary">{localized.summary}</p>}

      <div className="legal-written-body">
        {localized.conclusion.split('\n').map((line, i) => (
          line.trim() ? (
            /^[А-ЯA-ZӨҮҢ][А-ЯA-ZӨҮҢ\s\-«»]+$/u.test(line.trim()) && line.trim().length < 80
              ? <h5 key={i} className="legal-written-section-title">{translatePhrase(line.trim(), lang)}</h5>
              : <p key={i}>{translatePhrase(line.trim(), lang)}</p>
          ) : <br key={i} />
        ))}
      </div>

      <div className="legal-written-foot">
        {!hideAccessForm && (
          <ul className="legal-written-rules">
            <li>✓ {t('legal.viewOnly')}</li>
            <li>✓ {t('legal.watermark')}</li>
            <li>✕ {t('legal.noDownload')}</li>
          </ul>
        )}

        {!hideAccessForm && !accessInfo ? (
          <form onSubmit={onRequest} className="legal-form">
            <input
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={onEmailChange}
              required
            />
            <button type="submit" className="btn-primary">{t('legal.getAccess')}</button>
          </form>
        ) : !hideAccessForm ? (
          <div className="access-granted">
            <p>{t('legal.accessGranted')}</p>
            <Link to={accessInfo.view_url} className="btn-primary">{t('legal.open')}</Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
