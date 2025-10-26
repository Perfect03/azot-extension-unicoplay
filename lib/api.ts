import type { IContent, IStreamOptions } from './types';
import {  DEFAULT_HEADERS, ROUTES } from './constants';
import { auth, exit, registerDevice } from './auth';
import { input } from 'azot';

const request = async <T>(url: string, method: string = 'GET', params?: Record<string, string>) => {
  console.debug(`Getting data from ${url}...`);

  const query = new URLSearchParams({
    ...(params ?? {}),
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
      switch(parsed.message) {
        case 'Device count exceeded':
          console.error('You’ve exceeded the maximum number of devices allowed for your account');
          await input<'confirm'>('Please sign out of some devices in the “Devices” section of the Unico Play mobile app or on the website, then click “Enter”');
          await registerDevice();
          await auth();
          return await request(url, method, params);
        default:
          exit();
          console.error(parsed.message || 'Unexpected Error');
          registerDevice();
          await auth();
          return await request(url, method, params);
      }
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
