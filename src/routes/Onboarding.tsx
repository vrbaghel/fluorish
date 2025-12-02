import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'

export default function Onboarding() {
  const { isLoggedIn, user, completeOnboarding } = useAppContext()
  const navigate = useNavigate()

  const [location, setLocation] = useState('')
  const [sunlightHoursPerDay, setSunlightHoursPerDay] = useState('')
  const [spaceHeightFt, setSpaceHeightFt] = useState('')
  const [spaceAreaSqFt, setSpaceAreaSqFt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Guard: if user somehow lands here without being logged in or already has a profile,
  // send them to the appropriate screen.
  if (!isLoggedIn) {
    navigate('/', { replace: true })
    return null
  }

  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    const parsedSunlight = Number(sunlightHoursPerDay)
    const parsedHeight = Number(spaceHeightFt)
    const parsedArea = Number(spaceAreaSqFt)

    if (!location.trim() || Number.isNaN(parsedSunlight) || Number.isNaN(parsedHeight) || Number.isNaN(parsedArea)) {
      // Basic guard; you can replace this with inline validation messages.
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      completeOnboarding({
        location: location.trim(),
        sunlightHoursPerDay: parsedSunlight,
        spaceHeightFt: parsedHeight,
        spaceAreaSqFt: parsedArea,
      })
      navigate('/dashboard', { replace: true })
    }, 1200)
  }

  if (isSubmitting) {
    return (
      <main className="min-h-svh bg-background text-foreground">
        <div className="mx-auto flex min-h-svh max-w-sm flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.55em] text-primary">
            FLUORISH
          </p>
          <h2 className="mt-4 text-2xl font-semibold">We&apos;re setting up your preferences</h2>
          <p className="mt-2 text-sm text-muted">
            Tuning recommendations to your climate, light, and available space…
          </p>
          <div className="mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full w-1/3 animate-pulse bg-primary" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-primary">
            FLUORISH
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground">
            Let&apos;s get to know your space
          </h1>
          <p className="text-sm text-muted">
            We&apos;ll use this to tailor plant recommendations to your climate, light, and layout.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Location
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-surface-elevated/80 px-3 py-2 text-sm outline-none ring-primary/40 focus:ring"
              placeholder="City, country (e.g. Mumbai, India)"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <p className="text-xs text-muted">
              Helps us understand your climate and growing season.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Sunlight per day
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-xl border border-white/10 bg-surface-elevated/80 px-3 py-2 text-sm outline-none ring-primary/40 focus:ring"
                type="number"
                min="0"
                max="16"
                step="0.5"
                placeholder="e.g. 4.5"
                value={sunlightHoursPerDay}
                onChange={(event) => setSunlightHoursPerDay(event.target.value)}
              />
              <span className="text-xs text-muted">hrs / day</span>
            </div>
            <p className="text-xs text-muted">
              Estimate how many hours of direct or bright light your space gets.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Space height
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-xl border border-white/10 bg-surface-elevated/80 px-3 py-2 text-sm outline-none ring-primary/40 focus:ring"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 6"
                value={spaceHeightFt}
                onChange={(event) => setSpaceHeightFt(event.target.value)}
              />
              <span className="text-xs text-muted">ft</span>
            </div>
            <p className="text-xs text-muted">
              Tall plants and trellises need enough vertical clearance.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Base area
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-xl border border-white/10 bg-surface-elevated/80 px-3 py-2 text-sm outline-none ring-primary/40 focus:ring"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 40"
                value={spaceAreaSqFt}
                onChange={(event) => setSpaceAreaSqFt(event.target.value)}
              />
              <span className="text-xs text-muted">sq ft</span>
            </div>
            <p className="text-xs text-muted">
              We&apos;ll size containers and plant counts to your available floor or railing space.
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary mt-4 w-3/4 mx-auto"
          >
            Continue to dashboard
          </button>
        </form>
      </div>
    </main>
  )
}


