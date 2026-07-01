export const weddingInvitation = {
  slug: 'demo3',
  templateId: 3,
  templateName: 'Макет 3 — Classic',
  groom: 'Айбек',
  bride: 'Малика',
  date: '2026-09-20T15:00:00',
  dateDisplay: '20 сентябрь 2026',
  dateShort: '20 · 09 · 2026',
  coverImage:
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1400',
  heroSubtitle: 'Сүйүүбүздү сиз менен бөлүшкүбүз келет',
  storyPhotos: [
    {
      src: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=500',
      caption: 'Биринчи жолугушуу',
      rotate: -6,
    },
    {
      src: 'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=500',
      caption: 'Бирге саякат',
      rotate: 4,
    },
    {
      src: 'https://images.pexels.com/photos/3772630/pexels-photo-3772630.jpeg?auto=compress&cs=tinysrgb&w=500',
      caption: 'Сүйүү сунушу',
      rotate: -3,
    },
  ],
  timeline: [
    { year: '2019', title: 'Биринчи таанышуу', text: 'Достордун кечесинде тааныштык' },
    { year: '2020', title: 'Биринчи жолугушуу', text: 'Кофе үйүндө узак сүйлөшүү' },
    { year: '2022', title: 'Сүйүү сунушу', text: 'Тоо чокусунда «ооба» деди' },
    { year: '2026', title: 'Үйлөнүү', text: 'Эң сонун күнүбүз!' },
  ],
  program: [
    { time: '14:30', title: 'Конокторду тосуп алуу', icon: '🥂' },
    { time: '15:00', title: 'Нике азаматы', icon: '💍' },
    { time: '16:30', title: 'Фотосессия', icon: '📸' },
    { time: '18:00', title: 'Банкет', icon: '🍽' },
    { time: '20:00', title: 'Биринчи бий', icon: '💃' },
    { time: '22:30', title: 'Торт жана кече', icon: '🎂' },
  ],
  venue: {
    name: 'Банкетный зал «Grand Palace»',
    address: 'г. Бишкек, ул. Московская, 45',
    mapUrl: 'https://maps.google.com/?q=Bishkek+Grand+Palace',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2925.0!2d74.6!3d42.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDUyJzEyLjAiTiA3NMKwMzYnMDAuMCJF!5e0!3m2!1sru!2skg!4v1',
  },
  dressColors: ['#f5e6dc', '#e8d4b0', '#d4a5a5', '#9aab8c', '#b8926a'],
  dressNote: 'Кара түстү тандабаңыз. Кремовый, алтын жана жашыл палитрага ылайык келиңиз.',
  gallery: [
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/3772630/pexels-photo-3772630.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=700',
  ],
  contacts: {
    phone: '+996 550 858 502',
    whatsapp: '996550858502',
    telegram: '+996550858502',
    instagram: 'https://instagram.com/',
  },
  rsvpStorageKey: 'chakyruu-rsvp-demo3',
}

export const WEDDING_NAV = [
  { id: 'wd-hero', label: 'Башталыш' },
  { id: 'wd-countdown', label: 'Таймер' },
  { id: 'wd-story', label: 'Окуя' },
  { id: 'wd-program', label: 'Программа' },
  { id: 'wd-venue', label: 'Орун' },
  { id: 'wd-gallery', label: 'Галерея' },
  { id: 'wd-rsvp', label: 'RSVP' },
]
