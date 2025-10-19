export const DEVICE_TYPE = 'android' as 'android'|'web' // or web

export const API_KEY = {
  android: '1M0dbsG37KKfg83wgQGhJaoluenZcqrh',
  web: 'KNnpXL0TCyMm9F0qFqF5vsBzj3O4NGBs'
}

export const DOMAIN = 'unicoplay.com'

export const API = `https://api.${DOMAIN}`

export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Api-Key': API_KEY[DEVICE_TYPE]
}

export const ROUTES = {
  authCheck: (way: 'email'|'phone') => `${API}/auth/${way}/check`,
  authLogin: (way: 'email'|'phone') => `${API}/auth/${way}/login`,
  authRefresh: `${API}/auth/refresh`,
  device: `${API}/auth/device/login`,
  cms: () => `${API}/${DEVICE_TYPE == 'android' ? 'mobile' : 'web'}/watch`,
  stream: (content: 'series/episode'|'movie', id: string) => `${API}/stream/options/${content}/${id}`,
};
