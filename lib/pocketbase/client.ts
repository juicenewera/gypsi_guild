import PocketBase from 'pocketbase'

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

let pbInstance: PocketBase | null = null

export function getClient(): PocketBase {
  if (typeof window === 'undefined') {
    return new PocketBase(POCKETBASE_URL)
  }

  if (!pbInstance) {
    pbInstance = new PocketBase(POCKETBASE_URL)

    pbInstance.autoCancellation(false)

    const stored = localStorage.getItem('pocketbase_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        pbInstance.authStore.save(parsed.token, parsed.record)
      } catch {
        localStorage.removeItem('pocketbase_auth')
      }
    }

    pbInstance.authStore.onChange((token, record) => {
      if (token && record) {
        localStorage.setItem('pocketbase_auth', JSON.stringify({ token, record }))
      } else {
        localStorage.removeItem('pocketbase_auth')
      }
    })
  }

  return pbInstance
}

export function clearAuth() {
  const pb = getClient()
  pb.authStore.clear()
  localStorage.removeItem('pocketbase_auth')
  pbInstance = null
}

export const pb = typeof window !== 'undefined' ? getClient() : null
