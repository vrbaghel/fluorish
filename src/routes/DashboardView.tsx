import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import AppLayout from '../components/AppLayout'
import CircularProgress from '../components/CircularProgress'
import type { Plant } from '../types/plant'
import { getCurrentDayOfWeek, getCurrentWeek } from '../utils/plantHelpers'
import { calculateCurrentStreak } from '../utils/streakHelpers'
import { FactBubbleIcon, FireIcon } from '../assets/icons'

export default function DashboardView() {
  const { isLoggedIn, user } = useAppContext()
  const [plants, setPlants] = useState<Plant[]>([])
  const [streak, setStreak] = useState(0)
  const [todayTasksCount, setTodayTasksCount] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) return

    // Load plants from localStorage
    const storedPlants = JSON.parse(
      localStorage.getItem('fluorish:plants') || '[]'
    ) as Plant[]

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlants(storedPlants)

    // Calculate today's tasks count
    const currentDay = getCurrentDayOfWeek()
    let tasksCount = 0

    storedPlants.forEach((plant) => {
      if (!plant.careRoutine || !plant.plantedDate) return

      const currentWeek = getCurrentWeek(plant.plantedDate, plant.careRoutine.totalWeeks)
      const week = plant.careRoutine.weeks.find((w) => w.weekNumber === currentWeek)
      if (!week) return

      const day = week.days.find((d) => d.day === currentDay)
      if (day) {
        tasksCount += day.tasks.filter((t) => !t.completed).length
      }
    })

    setTodayTasksCount(tasksCount)

    // Calculate and set streak
    const currentStreak = calculateCurrentStreak()
    setStreak(currentStreak)

    // Reload periodically to catch changes
    const interval = setInterval(() => {
      const updatedPlants = JSON.parse(
        localStorage.getItem('fluorish:plants') || '[]'
      ) as Plant[]

      setPlants(updatedPlants)

      // Recalculate tasks
      let newTasksCount = 0
      updatedPlants.forEach((plant) => {
        if (!plant.careRoutine || !plant.plantedDate) return
        const currentWeek = getCurrentWeek(plant.plantedDate, plant.careRoutine.totalWeeks)
        const week = plant.careRoutine.weeks.find((w) => w.weekNumber === currentWeek)
        if (!week) return
        const day = week.days.find((d) => d.day === currentDay)
        if (day) {
          newTasksCount += day.tasks.filter((t) => !t.completed).length
        }
      })
      setTodayTasksCount(newTasksCount)

      const newStreak = calculateCurrentStreak()
      setStreak(newStreak)
    }, 2000)

    return () => clearInterval(interval)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const activePlants = plants.filter((p) => (p.progress || 0) < 100)
  const totalPlants = plants.length
  const recentPlants = plants.slice(0, 4) // Show up to 4 most recent plants

  return (
    <AppLayout>
      <div className="min-h-svh bg-background text-foreground">
        <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden">
          {/* Header */}
          <div className="space-y-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                  FLOURISH
                </p>
                <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                  Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}!
                </h1>
              <p className="text-base text-muted sm:text-lg text-center">
                Overview of your garden and daily care tasks.
              </p>
            </div>
            

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Total Plants
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{totalPlants}</p>
              <p className="mt-1 text-xs text-muted">
                {activePlants.length} active
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Today&apos;s Tasks
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{todayTasksCount}</p>
              <p className="mt-1 text-xs text-muted">
                {todayTasksCount === 0 ? 'All done!' : 'pending'}
              </p>
            </div>
          </div>

          {/* Care Streak */}
          <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Daily Care Streak
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-5xl font-semibold text-foreground">{streak}</p>
                <p className="text-xs text-muted">
                  {streak === 0
                    ? 'Start your streak today!'
                    : streak === 1
                    ? 'day in a row'
                    : 'days in a row'}
                </p>
              </div>
              <div className="text-4xl -mt-4"><FireIcon className="w-12 h-12" /></div>
            </div>
            {todayTasksCount > 0 && (
              <Link
                to="/my-tasks"
                className="mt-4 block w-full rounded-lg bg-primary/10 px-4 py-2 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                Complete today&apos;s tasks →
              </Link>
            )}
          </div>

          {/* Fun Fact */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                <FactBubbleIcon className="w-7 h-7" />
              </div>
              <div className="flex-1 mt-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                  Did You Know?
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  Urban gardens can reduce air pollution by up to 30% and help lower city temperatures by several degrees. Your balcony garden is making a real difference! 🌿
                </p>
              </div>
            </div>
          </div>

          {/* Recent Plants */}
          {recentPlants.length > 0 && (
            <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Your Plants
                </p>
                <Link
                  to="/my-plants"
                  className="text-xs font-semibold text-primary hover:text-primary/80"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {recentPlants.map((plant) => (
                  <Link
                    key={plant.id}
                    to={`/plant/${plant.id}`}
                    className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
                  >
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{plant.name}</p>
                      <p className="text-xs text-muted mt-1">
                        {plant.currentStage || 'Planting'} • Week{' '}
                        {plant.plantedDate
                          ? getCurrentWeek(
                              plant.plantedDate,
                              plant.careRoutine?.totalWeeks || 8
                            )
                          : 1}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircularProgress
                        progress={plant.progress || 0}
                        size={48}
                        strokeWidth={4}
                      />
                    </div>
                  </Link>
                ))}
              </div>
              {plants.length > 4 && (
                <Link
                  to="/my-plants"
                  className="mt-4 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                >
                  View all {plants.length} plants
                </Link>
              )}
            </div>
          )}

          {/* Empty State */}
          {plants.length === 0 && (
            <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm text-center">
              <p className="text-lg font-semibold text-foreground">No plants yet</p>
              <p className="mt-2 text-sm text-muted">
                Start your gardening journey by adding your first plant!
              </p>
              <Link
                to="/new-plant"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Add Your First Plant
              </Link>
            </div>
          )}
        </section>

        <section className="hidden min-h-svh flex-col items-center justify-center gap-4 px-6 text-center lg:flex">
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-8 py-10 shadow-2xl shadow-red-900/40">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
              Desktop blocked
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              FLOURISH only runs as a PWA on mobile screens
            </h2>
            <p className="mt-3 text-base text-red-200">
              Install the app as a Progressive Web App on your phone or shrink the viewport to
              continue.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Switch to mobile view to proceed
          </p>
        </section>
      </div>
    </AppLayout>
  )
}
