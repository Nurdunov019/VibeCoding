const DEFAULT_NEARBY = {
  kindergarten: [
    { name: 'Балапан, балдар бакчасы', walkMin: 3, distanceM: 210 },
    { name: 'Айчүрөк, №12', walkMin: 7, distanceM: 480 },
    { name: 'Нурболот, жеке бакча', walkMin: 5, distanceM: 350 },
  ],
  shop: [
    { name: 'Глобус супермаркет', walkMin: 4, distanceM: 290 },
    { name: 'Narodnyi магазин', walkMin: 2, distanceM: 150 },
    { name: 'Азия молл', walkMin: 12, distanceM: 920 },
  ],
  bus: [
    { name: 'Автобус №12, 25', walkMin: 2, distanceM: 120 },
    { name: 'Автобус №8, 18', walkMin: 5, distanceM: 380 },
    { name: 'Маршрутка №138', walkMin: 3, distanceM: 200 },
  ],
  school: [
    { name: '№59 мектеп-гимназия', walkMin: 8, distanceM: 550 },
    { name: '№23 орто мектеп', walkMin: 11, distanceM: 780 },
  ],
  pharmacy: [
    { name: 'Аптека 24/7', walkMin: 3, distanceM: 180 },
    { name: 'Гиппократ', walkMin: 6, distanceM: 420 },
  ],
}

const BY_SLUG = {
  salkyn: {
    kindergarten: [
      { name: 'Детский сад, Алмедин-1 м-н', lat: 42.876494, lng: 74.68792 },
      { name: 'Баластан №54', lat: 42.870069, lng: 74.697393 },
    ],
    shop: [
      { name: 'АЮ Grand, Чокана Валиханова', lat: 42.858985, lng: 74.678566 },
      { name: 'Сонун, Исакеева', lat: 42.85889, lng: 74.681373 },
      { name: 'Арзаны, Исакеева', lat: 42.858459, lng: 74.68135 },
    ],
    bus: [
      { name: 'Автобус аялдамасы, Чокана Валиханова', lat: 42.855883, lng: 74.674346 },
      { name: 'Аю Гранд Комфорт', lat: 42.861211, lng: 74.675547 },
      { name: 'Университет «Ала-Тоо»', lat: 42.855745, lng: 74.677734 },
    ],
    school: [
      { name: 'Частная школа «Сейтек»', lat: 42.85628, lng: 74.677192 },
      { name: 'Средняя школа № 91', lat: 42.859331, lng: 74.657924 },
    ],
    pharmacy: [
      { name: 'Эдем-Фарм, Исакеева', lat: 42.859022, lng: 74.681655 },
    ],
  },
  'borsan-brown': {
    kindergarten: [
      { name: 'Галилео, частный детский сад, ул. Ауэзова', lat: 42.850862, lng: 74.693373 },
      { name: 'Детский сад №7, мкр. Тунгуч', lat: 42.85284, lng: 74.68612 },
    ],
    shop: [
      { name: 'Globus, ул. Анкара 38', lat: 42.855595, lng: 74.689045 },
      { name: 'Narodnyi, ул. Анкара', lat: 42.85488, lng: 74.68842 },
    ],
    bus: [
      { name: 'Ауэзова и Бейшеналиева', lat: 42.85276, lng: 74.68794 },
      { name: 'Анкара и микрорайон Тунгуч', lat: 42.85418, lng: 74.68762 },
    ],
    school: [
      { name: 'Средняя школа № 73', lat: 42.851677, lng: 74.685991 },
      { name: 'Лицей № 18', lat: 42.851439, lng: 74.686751 },
    ],
    pharmacy: [
      { name: 'Аптека, ул. Ауэзова', lat: 42.854874, lng: 74.692827 },
      { name: 'Аптека, мкр. Тунгуч', lat: 42.854899, lng: 74.691758 },
    ],
  },
  'eliseiskie-polya': {
    kindergarten: [
      { name: 'Детский сад, мкр. Асанбай', lat: 42.814832, lng: 74.632878 },
      { name: 'Детский сад, ул. Жукеева-Пудовкина', lat: 42.82583, lng: 74.61543 },
    ],
    shop: [
      { name: 'Азия, супермаркет', lat: 42.818806, lng: 74.629271 },
      { name: 'Азия, супермаркет', lat: 42.816976, lng: 74.631793 },
    ],
    bus: [
      { name: 'Аалы Токомбаева и мкр. Асанбай', lat: 42.814162, lng: 74.630624 },
      { name: 'Сухэ-Батора и Аалы Токомбаева', lat: 42.820131, lng: 74.618707 },
      { name: 'Куттубаева и Аалы Токомбаева', lat: 42.816823, lng: 74.622997 },
    ],
    school: [
      { name: 'Школа, мкр. Асанбай', lat: 42.821106, lng: 74.625147 },
      { name: 'Спортивная площадка, мкр. Асанбай', lat: 42.820157, lng: 74.615783 },
    ],
    pharmacy: [
      { name: 'Аптека, пр. Токомбаева', lat: 42.818224, lng: 74.615621 },
      { name: 'Аптека, мкр. Асанбай', lat: 42.820334, lng: 74.627857 },
    ],
  },
  'one-ordo-resort': {
    kindergarten: [
      { name: 'Детский сад, с. Кара-Ой', lat: 42.638424, lng: 77.04153 },
    ],
    shop: [
      { name: 'Магазин, ул. Советская', lat: 42.638424, lng: 77.04153 },
      { name: 'Пляж «Солнечный берег»', lat: 42.632658, lng: 77.049812 },
      { name: 'Пляж пансионата Ала-Тоо', lat: 42.626415, lng: 77.082239 },
    ],
    bus: [
      { name: 'Автобусная остановка, ул. Советская', lat: 42.639962, lng: 77.051024 },
    ],
    school: [
      { name: 'Школа, с. Кара-Ой', lat: 42.633625, lng: 77.074123 },
    ],
    pharmacy: [
      { name: 'Аптека, с. Кара-Ой', lat: 42.638907, lng: 77.04044 },
    ],
  },
  siren: {
    kindergarten: [
      { name: 'Детский сад, ж/м Арча-Бешик', lat: 42.826912, lng: 74.553934 },
      { name: 'Частный детский сад', lat: 42.830634, lng: 74.559978 },
    ],
    shop: [
      { name: 'Азия, гипермаркет', lat: 42.828803, lng: 74.556258 },
      { name: 'Narodnyi, ул. Жайыл Баатыра', lat: 42.829901, lng: 74.55289 },
    ],
    bus: [
      { name: 'Жайыл Баатыра / Кара-Кужур', lat: 42.828941, lng: 74.555312 },
      { name: 'Жайыл Баатыра / Мин-Куш', lat: 42.827382, lng: 74.557219 },
    ],
    school: [
      { name: 'Средняя школа, Арча-Бешик', lat: 42.831664, lng: 74.554949 },
      { name: 'Школа-гимназия, Арча-Бешик', lat: 42.824946, lng: 74.560518 },
    ],
    pharmacy: [
      { name: 'Аптека, ул. Жайыл Баатыра', lat: 42.829345, lng: 74.554193 },
      { name: 'Аптека 24/7, Арча-Бешик', lat: 42.827897, lng: 74.558462 },
    ],
  },
  tokio: {
    kindergarten: [
      { name: 'Детский сад, ул. 7 Апреля', lat: 42.859321, lng: 74.633117 },
      { name: 'Частный детский сад, Горького', lat: 42.857144, lng: 74.636206 },
    ],
    shop: [
      { name: 'Азия, гипермаркет', lat: 42.858803, lng: 74.636258 },
      { name: 'ТРЦ Технопарк', lat: 42.856829, lng: 74.633729 },
    ],
    bus: [
      { name: 'Остановка «7 Апреля / Горького»', lat: 42.857761, lng: 74.633906 },
      { name: 'Остановка «7 Апреля»', lat: 42.859017, lng: 74.634691 },
    ],
    school: [
      { name: 'Средняя школа, Октябрьский р-н', lat: 42.861159, lng: 74.631822 },
      { name: 'Школа-гимназия', lat: 42.855986, lng: 74.638101 },
    ],
    pharmacy: [
      { name: 'Аптека, ул. 7 Апреля', lat: 42.858447, lng: 74.633301 },
      { name: 'Аптека, ул. Горького', lat: 42.856911, lng: 74.635912 },
    ],
  },
  'green-line': {
    kindergarten: [
      { name: 'Детский сад, ул. Островского', lat: 42.858419, lng: 74.618229 },
      { name: 'Частный детский сад, Ленинский р-н', lat: 42.860442, lng: 74.621051 },
    ],
    shop: [
      { name: 'Globus, Ленинский р-н', lat: 42.860028, lng: 74.619246 },
      { name: 'Narodnyi, ул. Циолковского', lat: 42.857622, lng: 74.622088 },
    ],
    bus: [
      { name: 'Остановка «Циолковского»', lat: 42.859132, lng: 74.620972 },
      { name: 'Остановка «Островской»', lat: 42.858213, lng: 74.617894 },
    ],
    school: [
      { name: 'Средняя школа, Ленинский р-н', lat: 42.861247, lng: 74.618337 },
      { name: 'Школа-гимназия, Циолковского', lat: 42.857509, lng: 74.623407 },
    ],
    pharmacy: [
      { name: 'Аптека, ул. Циолковского', lat: 42.858976, lng: 74.621638 },
      { name: 'Аптека 24/7, Островской', lat: 42.857848, lng: 74.618625 },
    ],
  },
}

const BEARINGS = [35, 110, 200, 290, 55, 160, 250, 340]

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(a)))
}

function offsetCoords(lat, lng, distanceM, bearingDeg) {
  const R = 6371000
  const brng = (bearingDeg * Math.PI) / 180
  const d = distanceM
  const lat1 = (lat * Math.PI) / 180
  const lng1 = (lng * Math.PI) / 180
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng)
  )
  const lng2 = lng1 + Math.atan2(
    Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
    Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
  )
  return [(lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI]
}

function enrichWithCoords(raw, baseLat, baseLng) {
  const result = {}
  for (const [cat, places] of Object.entries(raw)) {
    result[cat] = places.map((p, i) => {
      if (p.lat != null && p.lng != null) {
        const distanceM =
          p.distanceM ??
          (baseLat && baseLng ? haversineM(baseLat, baseLng, p.lat, p.lng) : 0)
        const walkMin = p.walkMin ?? Math.max(1, Math.round(distanceM / 80))
        return { ...p, distanceM, walkMin }
      }
      const [lat, lng] = baseLat && baseLng
        ? offsetCoords(baseLat, baseLng, p.distanceM, BEARINGS[i % BEARINGS.length])
        : [null, null]
      return { ...p, lat, lng }
    })
  }
  return result
}

export function getNearbyPlaces(slug, baseLat, baseLng) {
  const raw = BY_SLUG[slug] || DEFAULT_NEARBY
  return enrichWithCoords(raw, baseLat, baseLng)
}

export const CATEGORY_COLORS = {
  kindergarten: '#e67e22',
  shop: '#3498db',
  bus: '#9b59b6',
  school: '#2ecc71',
  pharmacy: '#e74c3c',
}
