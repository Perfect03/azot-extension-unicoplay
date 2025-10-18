const API_KEY = '1M0dbsG37KKfg83wgQGhJaoluenZcqrh' // Android

export const DOMAIN = 'unicoplay.com'

export const API = `https://api.${DOMAIN}`

export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Api-Key': API_KEY
}

export const DEFAULT_FETCH_PARAMS = {
  apikey: API_KEY
}

export const ROUTES = {
  authCheck: (way: 'email'|'phone') => `${API}/auth/${way}/check`,
  authLogin: (way: 'email'|'phone') => `${API}/auth/${way}/login`,
  authRefresh: `${API}/auth/refresh`,
  device: `${API}/auth/device/login`,
  cms: `${API}/web/watch`,
  stream: (content: 'series/episode'|'movie', id: string) => `${API}/stream/options/${content}/${id}`,
};
