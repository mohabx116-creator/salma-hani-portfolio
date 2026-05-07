import { getCookie, setCookie, deleteCookie } from 'vinxi/http'

export function getAuthToken(): string | undefined {
  return getCookie('auth-token')
}

export function setAuthToken(token: string): void {
  setCookie('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearAuthToken(): void {
  deleteCookie('auth-token')
}
