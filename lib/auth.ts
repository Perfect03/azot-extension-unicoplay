import type { ILogin } from './types';
import { DEFAULT_FETCH_PARAMS, DEFAULT_HEADERS, ROUTES } from './constants';
import { input } from 'azot';

export const registerDevice = async () => {
  console.debug('Register device...')
  const deviceResponce = await fetch(`${ROUTES.device}?apikey=${DEFAULT_FETCH_PARAMS.apikey}`, {
    method: 'POST',
    body: JSON.stringify({
      device_id: crypto.randomUUID(),
      device_type: 'web'
    }),
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json'
    }
  });

  if (deviceResponce?.status != 200) {
    console.error('Unable to register device. Please try again later.');
    console.debug(await deviceResponce.text());
    return;
  }

  const device = await deviceResponce.json() as ILogin;

  if (!device?.devices) {
    console.error('Device register error. Please try again later.');
    console.debug(device);
    exit();
  }
  else {
    const uid = device.devices[0].uid
    localStorage.setItem('device_id', uid)
    return uid
  }
}

export const refresh = async () => {
  console.debug('Refresh token...');
  const refreshResponce = await fetch(`${ROUTES.authRefresh}?apikey=${DEFAULT_FETCH_PARAMS.apikey}`, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `auth=${localStorage.getItem('authentication_token')}`,
      'Content-Type': 'application/json'
    }
  });

  let profile = await refreshResponce.json() as ILogin;

  if (!profile?.authentication_token) {
    console.error('Authorization token update error. Please try signing in again.');
    console.debug(profile);
    exit();
    const newAuth = await auth();
    if (newAuth?._id) profile = newAuth;
  }
  else saveAuth(profile)

  return profile;
};

export const checkAuth = async () => {
  if (!localStorage.getItem('authentication_token')) {
    await auth();
    registerDevice();
    return;
  }

  console.debug('Refresh token...');
  const authRefresh = await fetch(`${ROUTES.authRefresh}?apikey=${DEFAULT_FETCH_PARAMS.apikey}`, {
    method: 'POST',
    body: JSON.stringify({
      apikey: DEFAULT_FETCH_PARAMS.apikey
    }),
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `auth=${localStorage.getItem('authentication_token')}`,
      'Content-Type': 'application/json'
    }
  })

  const login = await authRefresh.json() as ILogin;

  if (!login?.authentication_token) {
    console.debug(login);
    await exit()
    await auth()
    return;
  }
  
  saveAuth(login)
  localStorage.setItem('device_id', login.devices[0].uid)
};

export const auth = async () => {
  console.debug('Sign in Unico Play...');

  const { answer: check } = await input('E-mail or Phone Number: ');

  const isPhone = (v: string) => /^\+?\d+$/.test(v)

  const way = isPhone(check) ? 'phone' : 'email'

  const authCheck = await fetch(`${ROUTES.authCheck(way)}?apikey=${DEFAULT_FETCH_PARAMS.apikey}`, {
    body: JSON.stringify({
      [way]: check.trim()
    }),
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json'
    }
  })

  if (authCheck?.status != 200) {
    console.error('Unable to login. Please try again later.');
    console.debug(await authCheck.text());
    return;
  }

  const { answer: password } = await input('Password: ');

  const authLogin = await fetch(`${ROUTES.authLogin(way)}?apikey=${DEFAULT_FETCH_PARAMS.apikey}`, {
    body: JSON.stringify({
      password: btoa(password),
      is_encoded: true,
      client_platform: 'start',
      device_type: 'web',
      devide_id: crypto.randomUUID(),
      [way]: check
    }),
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json'
    }
  })

  if (authLogin?.status != 200) {
    console.error('Unable to log in with provided credentials.');
    console.debug(await authLogin.text());
    return;
  }

  const login = await authLogin.json() as ILogin;

  if (!login?.authentication_token) {
    console.error('Unexpected Error. Please, try later.');
    console.debug(login);
    return;
  }

  saveAuth(login)

  return login;
}

const saveAuth = (data: ILogin) => {
  localStorage.setItem('authentication_token', data.authentication_token);
}

export const exit = async () => {
  localStorage.clear();
};
