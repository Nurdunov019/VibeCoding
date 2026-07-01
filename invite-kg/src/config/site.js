export const SITE = {
  name: 'chakyruu.kg',
  tagline: 'онлайн чакыруу сайттары',
  eyebrow: 'сүйүү менен, эң тез мөөнөттө',
  whatsapp: '996550858502',
  telegram: '+996550858502',
  phone: '+996550858502',
  phoneDisplay: '+996 550 858 502',
  contactName: 'Chakyruu',
  heroVideo:
    'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4',
  weddingMusic:
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb49e9b8c.mp3?filename=soft-piano-ambient-14049.mp3',
}

export function whatsappUrl(text) {
  const msg = text || 'Chakyruu.kg: Саламатсызбы! Онлайн чакыруу жөнүндө сурам бар.'
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`
}

export function telegramUrl() {
  return `https://t.me/${SITE.telegram}`
}

export function orderWhatsapp(templateName) {
  const text = templateName
    ? `Chakyruu.kg: Саламатсызбы! «${templateName}» макетине заказ бергим келет.`
    : 'Chakyruu.kg: Саламатсызбы! Онлайн чакыруу сайтына заказ бергим келет.'
  return whatsappUrl(text)
}
