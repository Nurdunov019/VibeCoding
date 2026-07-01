export const eventTypes = [
  { id: 'all', label: 'Баары', icon: '✦' },
  { id: 'wedding', label: 'Үйлөнүү', icon: '💍' },
  { id: 'birthday', label: 'Туулган күн', icon: '🎂' },
  { id: 'corporate', label: 'Корпоратив', icon: '🏢' },
  { id: 'gender', label: 'Gender party', icon: '🎀' },
]

const styles = [
  'rose-garden', 'ivory-minimal', 'forest-botanic', 'noir-gold', 'blush-floral',
  'linen-classic', 'midnight-pearl', 'champagne-dream', 'terracotta', 'sage-elegant',
  'velvet-wine', 'ocean-mist', 'golden-hour', 'lavender-soft', 'charcoal-luxe',
  'peach-bloom', 'emerald-night', 'snow-white',
]

const sizes = ['tall', 'medium', 'compact']

function makeTemplate(id, price, event = 'wedding', preview = null) {
  return {
    id,
    name: `Макет ${id}`,
    price,
    style: styles[(id - 1) % styles.length],
    size: sizes[id % sizes.length],
    event,
    preview: id === 1 ? '/demo' : preview,
    featured: id === 1,
  }
}

export const templates = [
  makeTemplate(1, 2500, 'wedding', '/demo'),
  { ...makeTemplate(2, 3500), preview: '/demo2', featured: true, name: 'Макет 2 — Premium' },
  makeTemplate(3, 2750),
  makeTemplate(4, 3150),
  makeTemplate(5, 2500),
  makeTemplate(6, 2500),
  makeTemplate(7, 2500, 'birthday'),
  makeTemplate(8, 2750),
  makeTemplate(9, 2500),
  makeTemplate(10, 2500),
  makeTemplate(11, 2500),
  makeTemplate(12, 2950),
  makeTemplate(13, 2500),
  makeTemplate(14, 2500),
  makeTemplate(15, 2500, 'corporate'),
  makeTemplate(16, 2750),
  makeTemplate(17, 2750),
  makeTemplate(18, 2950),
]

export const introBlocks = [
  { id: 'intro-1', name: 'Кирүү 1', price: 400, style: 'envelope' },
  { id: 'intro-2', name: 'Кирүү 2', price: 300, style: 'curtain' },
  { id: 'intro-3', name: 'Кирүү 3', price: 300, style: 'fade' },
  { id: 'intro-4', name: 'Кирүү 4 + музыка', price: 550, style: 'music' },
  { id: 'confetti', name: 'Конфетти', price: 200, style: 'confetti' },
]

export function chunkTemplates(list, size = 3) {
  const rows = []
  for (let i = 0; i < list.length; i += size) {
    rows.push(list.slice(i, i + size))
  }
  return rows
}
