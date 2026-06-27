export const TILE_2GIS = {
  url: 'https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
  attribution:
    '&copy; <a href="https://2gis.kg/bishkek" target="_blank" rel="noopener noreferrer">2GIS</a>',
  subdomains: ['0', '1', '2', '3'],
  maxZoom: 18,
}

export function maps2gisUrl(lat, lng, zoom = 16) {
  return `https://2gis.kg/bishkek?m=${lng}%2C${lat}%2F${zoom}`
}
