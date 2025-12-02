export type MockUser = {
  id: string
  name: string
  avatar: string
  // Human-readable summary used in the dashboard
  homeZone: string
  daylightHours: string
  // Structured onboarding data
  location: string
  sunlightHoursPerDay: number
  spaceHeightFt: number
  spaceAreaSqFt: number
}

export const mockUser: MockUser = {
  id: 'user-001',
  name: 'Jane Doe',
  avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
  homeZone: 'Mumbai · Balcony garden (65 sq ft, 6 ft height)',
  daylightHours: '4.5 hrs / day',
  location: 'Mumbai, India',
  sunlightHoursPerDay: 4.5,
  spaceHeightFt: 6,
  spaceAreaSqFt: 65,
}

export function simulateFetchUser(): Promise<MockUser> {
  return new Promise((resolve) => {
    const delay = 800 + Math.random() * 600
    setTimeout(() => resolve(mockUser), delay)
  })
}

