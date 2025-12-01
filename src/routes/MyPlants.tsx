import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import AppLayout from '../components/AppLayout'
import CircularProgress from '../components/CircularProgress'
import type { Plant } from '../types/plant'
import { getCurrentWeek, calculateProgress, getStageFromProgress, generateCareRoutine } from '../utils/plantHelpers'

export default function MyPlants() {
  const { isLoggedIn } = useAppContext()
  const [plants, setPlants] = useState<Plant[]>([])

  useEffect(() => {
    if (!isLoggedIn) return

    const storedPlants = JSON.parse(
      localStorage.getItem('fluorish:plants') || '[]'
    ) as Plant[]

    // Initialize plants with care routines and progress if needed
    const initializedPlants = storedPlants.map((plant) => {
      const updatedPlant = { ...plant }

      if (!updatedPlant.plantedDate) {
        updatedPlant.plantedDate = new Date().toISOString()
      }

      if (!updatedPlant.careRoutine) {
        const totalWeeks = parseInt(updatedPlant.timeToFirstHarvest.match(/\d+/)?.[0] || '8')
        updatedPlant.careRoutine = generateCareRoutine(updatedPlant, totalWeeks)
      }

      if (!updatedPlant.progress || !updatedPlant.currentStage) {
        const totalWeeks = updatedPlant.careRoutine.totalWeeks
        const progress = calculateProgress(updatedPlant.plantedDate!, totalWeeks, '')
        updatedPlant.progress = progress
        updatedPlant.currentStage = getStageFromProgress(progress, totalWeeks) as Plant['currentStage']
      }

      return updatedPlant
    })

    // Update localStorage with initialized plants
    if (initializedPlants.length > 0 && initializedPlants.some((p, i) => p !== storedPlants[i])) {
      localStorage.setItem('fluorish:plants', JSON.stringify(initializedPlants))
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlants(initializedPlants)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            MY PLANTS
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Your growing garden
          </h1>
          <p className="text-base text-muted sm:text-lg">
            Track the plants you&apos;re currently growing and their progress.
          </p>
        </div>

        {plants.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <p className="text-sm text-muted">No plants yet. Start by adding a new plant!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plants.map((plant) => {
              const currentWeek = plant.plantedDate
                ? getCurrentWeek(plant.plantedDate, plant.careRoutine?.totalWeeks || 8)
                : 1

              return (
                <Link
                  key={plant.id}
                  to={`/plant/${plant.id}`}
                  className="block rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {plant.name}
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        {plant.currentStage || 'Planting'} · Week {currentWeek}
                      </p>
                    </div>
                    <CircularProgress progress={plant.progress || 0} size={60} strokeWidth={6} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <section className="hidden min-h-svh flex-col items-center justify-center gap-4 px-6 text-center lg:flex">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-8 py-10 shadow-2xl shadow-red-900/40">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
            Desktop blocked
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">
            FLUORISH only runs as a PWA on mobile screens
          </h2>
        </div>
      </section>
    </AppLayout>
  )
}

