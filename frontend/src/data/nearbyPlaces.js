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
  'han-teniri': {
    kindergarten: [
      { name: 'Smart Baby, жеке бакча', walkMin: 5, distanceM: 380 },
      { name: 'Әсемгүл, №81', walkMin: 8, distanceM: 620 },
      { name: 'Isma Kids', walkMin: 4, distanceM: 290 },
    ],
    shop: [
      { name: 'Globus, Токтоналиева', walkMin: 3, distanceM: 220 },
      { name: 'Frunze магазин', walkMin: 6, distanceM: 410 },
    ],
    bus: [
      { name: 'Автобус №12, 25, 30', walkMin: 2, distanceM: 90 },
      { name: 'Маршрутка №105', walkMin: 4, distanceM: 260 },
    ],
    school: [{ name: '№78 лицей', walkMin: 10, distanceM: 710 }],
    pharmacy: [{ name: 'Аптека Нур', walkMin: 4, distanceM: 250 }],
  },
  'green-side': {
    kindergarten: [
      { name: 'Балапан, Ахунбаева', walkMin: 2, distanceM: 140 },
      { name: 'Кеңеш, №45', walkMin: 6, distanceM: 400 },
    ],
    shop: [
      { name: 'Bishkek Park жакын', walkMin: 8, distanceM: 600 },
      { name: 'Дордой мини', walkMin: 5, distanceM: 320 },
    ],
    bus: [{ name: 'Автобус №18, 32', walkMin: 1, distanceM: 80 }],
    school: [{ name: '№92 мектеп', walkMin: 7, distanceM: 490 }],
    pharmacy: [{ name: 'Ак Бота аптека', walkMin: 3, distanceM: 190 }],
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
