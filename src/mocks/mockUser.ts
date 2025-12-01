export type MockUser = {
  id: string
  name: string
  avatar: string
  homeZone: string
  daylightHours: string
}

export const mockUser: MockUser = {
  id: 'user-001',
  name: 'Asha Patel',
  avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
  homeZone: 'Mumbai · Balcony garden (65 sq ft)',
  daylightHours: '4.5 hrs / day',
}

export function simulateFetchUser(): Promise<MockUser> {
  return new Promise((resolve) => {
    const delay = 800 + Math.random() * 600
    setTimeout(() => resolve(mockUser), delay)
  })
}

