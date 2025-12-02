import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import AppLayout from '../components/AppLayout'
import type { Plant, PlantTask } from '../types/plant'
import { getCurrentWeek, getCurrentDayOfWeek, calculateProgressWithTasks, getStageFromProgress } from '../utils/plantHelpers'

type PlantTasks = {
  plant: Plant
  tasks: PlantTask[]
  weekNumber: number
  day: string
}

export default function MyTasks() {
  const { isLoggedIn } = useAppContext()
  const [plantTasks, setPlantTasks] = useState<PlantTasks[]>([])

  useEffect(() => {
    if (!isLoggedIn) return

    const loadTodayTasks = () => {
      const storedPlants = JSON.parse(
        localStorage.getItem('fluorish:plants') || '[]'
      ) as Plant[]

      const currentDay = getCurrentDayOfWeek()
      const todayTasks: PlantTasks[] = []

      storedPlants.forEach((plant) => {
        if (!plant.careRoutine || !plant.plantedDate) return

        const currentWeek = getCurrentWeek(plant.plantedDate, plant.careRoutine.totalWeeks)
        const week = plant.careRoutine.weeks.find((w) => w.weekNumber === currentWeek)
        if (!week) return

        const day = week.days.find((d) => d.day === currentDay)
        if (!day || day.tasks.length === 0) return

        // Only include if there are incomplete tasks
        const incompleteTasks = day.tasks.filter((t) => !t.completed)
        if (incompleteTasks.length > 0) {
          todayTasks.push({
            plant,
            tasks: day.tasks,
            weekNumber: currentWeek,
            day: currentDay,
          })
        }
      })

      setPlantTasks(todayTasks)
    }

    loadTodayTasks()

    // Reload tasks periodically to catch any changes
    const interval = setInterval(loadTodayTasks, 1000)
    return () => clearInterval(interval)
  }, [isLoggedIn])

  const handleToggleTask = (plantId: string, taskId: string) => {
    const storedPlants = JSON.parse(
      localStorage.getItem('fluorish:plants') || '[]'
    ) as Plant[]

    const plant = storedPlants.find((p) => p.id === plantId)
    if (!plant || !plant.careRoutine || !plant.plantedDate) return

    const currentDay = getCurrentDayOfWeek()
    const currentWeek = getCurrentWeek(plant.plantedDate, plant.careRoutine.totalWeeks)
    const week = plant.careRoutine.weeks.find((w) => w.weekNumber === currentWeek)
    if (!week) return

    const day = week.days.find((d) => d.day === currentDay)
    if (!day) return

    const task = day.tasks.find((t) => t.id === taskId)
    if (task) {
      task.completed = !task.completed
    }

    // Recalculate progress
    const totalWeeks = plant.careRoutine.totalWeeks
    const newProgress = calculateProgressWithTasks(
      plant.plantedDate,
      totalWeeks,
      plant.careRoutine
    )
    const newStage = getStageFromProgress(newProgress)

    const updatedPlant: Plant = {
      ...plant,
      careRoutine: plant.careRoutine,
      progress: newProgress,
      currentStage: newStage as Plant['currentStage'],
    }

    // Update localStorage
    const updatedPlants = storedPlants.map((p) => (p.id === plantId ? updatedPlant : p))
    localStorage.setItem('fluorish:plants', JSON.stringify(updatedPlants))

    // Update local state - remove plant if all tasks are complete
    const incompleteTasks = day.tasks.filter((t) => !t.completed)
    if (incompleteTasks.length === 0) {
      setPlantTasks((prev) => prev.filter((pt) => pt.plant.id !== plantId))
    } else {
      setPlantTasks((prev) =>
        prev.map((pt) =>
          pt.plant.id === plantId
            ? {
                ...pt,
                tasks: day.tasks,
                plant: updatedPlant,
              }
            : pt
        )
      )
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const currentDay = getCurrentDayOfWeek()

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            MY TASKS
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Today&apos;s tasks
          </h1>
          <p className="text-base text-muted sm:text-lg">
            Complete your daily care tasks for all your plants.
          </p>
          <p className="text-lg font-semibold text-white mt-8">{currentDay}</p>
        </div>

        {plantTasks.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <p className="text-sm text-muted text-center">
              {currentDay === 'Sunday' || currentDay === 'Saturday'
                ? 'No tasks scheduled for today. Enjoy your weekend! 🌱'
                : 'All tasks completed for today! Great job! 🎉'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plantTasks.map((plantTask) => {
              const completedCount = plantTask.tasks.filter((t) => t.completed).length
              const totalCount = plantTask.tasks.length
              const allCompleted = completedCount === totalCount

              return (
                <div
                  key={plantTask.plant.id}
                  className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm"
                >
                  <Link
                    to={`/plant/${plantTask.plant.id}`}
                    className="block mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={plantTask.plant.image}
                        alt={plantTask.plant.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {plantTask.plant.name}
                        </h3>
                        <p className="text-xs text-muted">
                          Week {plantTask.weekNumber} · {completedCount}/{totalCount} tasks
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-2">
                    {plantTask.tasks.map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer border border-white/5"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(plantTask.plant.id, task.id)}
                          className="w-5 h-5 rounded border-white/20 bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-background"
                        />
                        <span
                          className={`text-sm flex-1 ${
                            task.completed ? 'line-through text-muted' : 'text-foreground'
                          }`}
                        >
                          {task.title}
                        </span>
                      </label>
                    ))}
                  </div>

                  {allCompleted && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-primary font-semibold text-center">
                        ✓ All tasks completed for {plantTask.plant.name}!
                      </p>
                    </div>
                  )}
                </div>
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

