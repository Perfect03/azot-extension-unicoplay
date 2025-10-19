import type { IContent, IStreamOptions } from './types';
import {  DEFAULT_HEADERS, ROUTES } from './constants';
import { auth, exit } from './auth';

const request = async <T>(url: string, method: string = 'GET', params?: Record<string, string>) => {
  console.debug(`Getting data from ${url}...`);

  const query = new URLSearchParams({
    ...(params ?? {}),
    device_id: localStorage.getItem('device_id') || crypto.randomUUID(),
  }).toString();

  console.log(`${url}?${query}`)

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
    console.error(`Unauthorized: ${url}?${query}`);
    console.debug(data);
    exit();
    const login = await auth();
    if (login?.authentication_token) {
      await request(url, method, params);
    }
    return;
  }
  
  response.status === 400 && console.error(`Bad Request: ${url}?${query}`);
  const isSuccess = response.status === 200;
  if (!isSuccess) console.debug(`Request failed. Route: ${url}?${query}. ${data}`);
  try {
    const parsed = JSON.parse(data)
    if (parsed.success === false) {
      exit();
      console.error(parsed.message || 'Unexpected Error');
      await auth();
      await request(url, method, params);
      return;
    }
    return parsed as T;
  } catch (e) {
    console.debug(data);
    console.debug(e as any);
    console.error(`Parsing JSON response failed. Route: ${url}?${query}`);
    process.exit(1);
  }
};

export const fetchContentMetadada = async (title: string) => {
  return request<IContent>(`${ROUTES.cms()}/${title}`);
};

export const fetchStreamOptions = async (content: 'series/episode'|'movie', id: string) => {
  return request<IStreamOptions>(ROUTES.stream(content, id));
};
