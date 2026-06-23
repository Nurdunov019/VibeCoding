import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { statusLabel } from '../utils/translate'

export default function LegalWrittenSection({
  report,
  accessInfo,
  email,
  onEmailChange,
  onRequest,
  variant = 'default',
  hideAccessForm = false,
}) {
  const { t } = useLocale()
  if (!report) return null

  const rootClass = variant === 'showcase' ? 'legal-written legal-written--showcase' : 'legal-written'

  return (
    <div className={rootClass}>
      <div className="legal-written-head">
        <div>
          <p className="legal-written-date">{t('legal.prepared')}: {report.prepared_at}</p>
          <h4>{report.title}</h4>
        </div>
        <span className={`legal-written-risk risk-${report.risk_level}`}>
          {t('legal.risk')}: {statusLabel(t, 'risk', report.risk_level)}
        </span>
      </div>

      {report.summary && <p className="legal-written-summary">{report.summary}</p>}

      <div className="legal-written-body">
        {report.conclusion.split('\n').map((line, i) => (
          line.trim() ? (
            /^[А-ЯA-Z][А-ЯA-Z\s\-]+$/.test(line.trim()) && line.trim().length < 60
              ? <h5 key={i} className="legal-written-section-title">{line.trim()}</h5>
              : <p key={i}>{line}</p>
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
