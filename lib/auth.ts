import type { ILogin } from './types';
import { DEFAULT_HEADERS, ROUTES, DEVICE_TYPE } from './constants';
import { input } from 'azot';

export const checkAuth = async () => {
  if (!localStorage.getItem('authentication_token')) {
    registerDevice();
    await auth();
    return;
  }
  await refresh()
};

export const registerDevice = async () => {
  console.debug('Register device...')
  const deviceResponce = await fetch(ROUTES.device, {
    method: 'POST',
    body: JSON.stringify({
      device_id: crypto.randomUUID(),
      device_type: DEVICE_TYPE
    }),
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json'
    }
  });

  if (deviceResponce?.status != 200) {
    console.debug(await deviceResponce.text());
    exit();
    throw new Error('Unable to register device. Please try again later.');
  }

  const device = await deviceResponce.json() as ILogin;

  if (!device?.devices) {
    console.debug(device);
    exit();
    throw new Error('Device register error. Please try again later.');
  }
  else {
    const uid = device.devices[0].uid
    localStorage.setItem('device_id', uid)
    return uid
  }
}

export const refresh = async () => {
  console.debug('Refresh token...');
  const refreshResponce = await fetch(ROUTES.authRefresh, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      ...DEFAULT_HEADERS,
      //Cookie: auth=${localStorage.getItem('authentication_token')},
      'Authentification-Token': localStorage.getItem('authentication_token') as string,
      'Content-Type': 'application/json'
    }
  });

  let profile
  
  if (refreshResponce?.status != 200) {
    console.error('Authorization token update error. Please try signing in again.');
    console.debug(profile);
    exit();
    const newAuth = await auth();
    if (newAuth?._id) profile = newAuth;
  }
  else {
    profile = await refreshResponce.json() as ILogin;

    if (!profile?.authentication_token) {
      console.error('Authorization token update error. Please try signing in again.');
      console.debug(profile);
      exit();
      const newAuth = await auth();
      if (newAuth?._id) profile = newAuth;
    }
    else saveAuth(profile)
  }

  return profile;
};

export const auth = async () => {
  console.debug('Sign in Unico Play...');

  const { answer: check } = await input('E-mail or Phone Number: ');

  const isPhone = (v: string) => /^\+?\d+$/.test(v)

  const way = isPhone(check) ? 'phone' : 'email'

  const authCheck = await fetch(ROUTES.authCheck(way), {
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

  const authLogin = await fetch(ROUTES.authLogin(way), {
    body: JSON.stringify({
      password: btoa(password),
      is_encoded: true,
      client_platform: 'start',
      device_type: DEVICE_TYPE,
      devide_id: localStorage.getItem('device_id'),
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
