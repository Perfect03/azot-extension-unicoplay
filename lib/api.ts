import type { IContent, IStreamOptions } from './types';
import { DEFAULT_FETCH_PARAMS, DEFAULT_HEADERS, ROUTES } from './constants';
import { refresh } from './auth';

const request = async <T>(url: string, method: string = 'GET', params?: Record<string, string>) => {
  console.debug(`Getting data from ${url}...`);

  const query = new URLSearchParams({
    ...(params ?? {}),
    ...DEFAULT_FETCH_PARAMS,
    device_id: localStorage.getItem('device_id') || crypto.randomUUID(),
  }).toString();

  const response = await fetch(`${url}?${query}`, {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': method == 'GET' ? '*/*' : 'application/json',
      Cookie: `auth=${localStorage.getItem('authentication_token') || ''}`
    },
  });
  const data = (await response.text()) || '';
  if (response.status === 401) {
    const user = await refresh()
    if (user?.authentication_token) {
      await request(url, method, params);
      return;
    }
    console.error(`Unauthorized: ${url}?${query}`);
  }
  
  response.status === 400 && console.error(`Bad Request: ${url}?${query}`);
  const isSuccess = response.status === 200;
  if (!isSuccess) console.debug(`Request failed. Route: ${url}?${query}. ${data}`);
  try {
    return (data ? JSON.parse(data) : data) as T;
  } catch (e) {
    console.debug(data);
    console.debug(e as any);
    console.error(`Parsing JSON response failed. Route: ${url}?${query}`);
    process.exit(1);
  }
};

export const fetchContentMetadada = async (title: string) => {
  return request<IContent>(`${ROUTES.cms}/${title}`);
};

export const fetchStreamOptions = async (content: 'series/episode'|'movie', id: string) => {
  return request<IStreamOptions>(ROUTES.stream(content, id));
};
