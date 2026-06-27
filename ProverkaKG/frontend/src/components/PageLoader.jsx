import { useLocale } from '../context/LocaleContext'

export default function PageLoader() {
  const { t } = useLocale()
  return <p className="empty page-loader">{t('empty.loading')}</p>
}
