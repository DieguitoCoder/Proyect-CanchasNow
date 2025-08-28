import { setSession, clearSession, request } from './views/api.js';

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setSession(data);
  return data.user;
}

export async function register(nombre, email, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password })
  });
  setSession(data);
  return data.user;
}

export function logout() { clearSession(); }
