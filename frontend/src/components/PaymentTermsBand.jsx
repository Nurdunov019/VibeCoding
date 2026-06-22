import { useLocale } from '../context/LocaleContext'

export default function PaymentTermsBand({ complex }) {
  const { t } = useLocale()

  const items = [
    complex.price_per_sqm_usd != null && {
      label: t('catalog.price'),
      value: `$${complex.price_per_sqm_usd} / м²`,
    },
    complex.initial_payment_percent != null && {
      label: t('catalog.initialPayment'),
      value: `${complex.initial_payment_percent}%`,
    },
    complex.installment_months != null && {
      label: t('catalog.installment'),
      value: `${complex.installment_months} ${t('catalog.months')}`,
    },
    complex.barter_extra_usd_sqm != null && {
      label: t('catalog.barter'),
      value: `+$${complex.barter_extra_usd_sqm}/м²${complex.barter_min_payment_percent ? ` (${t('catalog.minPayment')} ${complex.barter_min_payment_percent}%)` : ''}`,
    },
  ].filter(Boolean)

  if (!items.length && !complex.has_red_book) return null

  return (
    <section className="showcase-payment" aria-label={t('catalog.paymentTerms')}>
      {complex.has_red_book && (
        <p className="showcase-redbook">📕 {t('catalog.redBook')}</p>
      )}
      {items.length > 0 && (
        <div className="showcase-payment-grid">
          {items.map((item) => (
            <div key={item.label} className="showcase-payment-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
