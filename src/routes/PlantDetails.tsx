import { useState, useEffect } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import AppLayout from '../components/AppLayout'
import CircularProgress from '../components/CircularProgress'
import PlantDoctor from '../components/PlantDoctor'
import type { Plant, PlantWeek, PlantDay, PlantTask } from '../types/plant'
import type { CareOption } from '../types/diagnosis'
import {
  getCurrentWeek,
  getCurrentDayOfWeek,
  calculateProgressWithTasks,
  getStageFromProgress,
  generateCareRoutine,
} from '../utils/plantHelpers'

export default function PlantDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn } = useAppContext()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set())
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [showPlantDoctor, setShowPlantDoctor] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !id) return

    // Load plant from localStorage
    const storedPlants = JSON.parse(
      localStorage.getItem('fluorish:plants') || '[]'
    ) as Plant[]

    const foundPlant = storedPlants.find((p) => p.id === id)
    if (!foundPlant) {
      navigate('/my-plants')
      return
    }

    // Initialize plant data if needed
    let plantData = foundPlant
    if (!plantData.plantedDate) {
      plantData = {
        ...plantData,
        plantedDate: new Date().toISOString(),
      }
    }

    if (!plantData.careRoutine) {
      const totalWeeks = parseInt(plantData.timeToFirstHarvest.match(/\d+/)?.[0] || '8')
      plantData.careRoutine = generateCareRoutine(plantData, totalWeeks)
    }

    if (!plantData.progress || !plantData.currentStage) {
      const totalWeeks = plantData.careRoutine.totalWeeks
      const progress = calculateProgressWithTasks(
        plantData.plantedDate!,
        totalWeeks,
        plantData.careRoutine
      )
      plantData.progress = progress
      plantData.currentStage = getStageFromProgress(progress) as Plant['currentStage']
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlant(plantData)

    // Auto-expand current week and day
    if (plantData.careRoutine && plantData.plantedDate) {
      const currentWeek = getCurrentWeek(plantData.plantedDate, plantData.careRoutine.totalWeeks)
      const currentDay = getCurrentDayOfWeek()
      setExpandedWeeks(new Set([currentWeek]))
      setExpandedDays(new Set([`${currentWeek}-${currentDay}`]))
    }
  }, [id, isLoggedIn, navigate])

  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks)
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber)
      // Also collapse all days in this week
      const newExpandedDays = new Set(expandedDays)
      plant?.careRoutine?.weeks
        .find((w) => w.weekNumber === weekNumber)
        ?.days.forEach((day) => {
          newExpandedDays.delete(`${weekNumber}-${day.day}`)
        })
      setExpandedDays(newExpandedDays)
    } else {
      newExpanded.add(weekNumber)
    }
    setExpandedWeeks(newExpanded)
  }

  const toggleDay = (weekNumber: number, day: string) => {
    const key = `${weekNumber}-${day}`
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
      // Also expand the week if not already expanded
      if (!expandedWeeks.has(weekNumber)) {
        setExpandedWeeks(new Set([...expandedWeeks, weekNumber]))
      }
    }
    setExpandedDays(newExpanded)
  }

  const toggleTask = (weekNumber: number, day: string, taskId: string) => {
    if (!plant || !plant.careRoutine || !plant.plantedDate) return

    const updatedRoutine = { ...plant.careRoutine }
    const week = updatedRoutine.weeks.find((w) => w.weekNumber === weekNumber)
    if (!week) return

    const dayData = week.days.find((d) => d.day === day)
    if (!dayData) return

    const task = dayData.tasks.find((t) => t.id === taskId)
    if (task) {
      task.completed = !task.completed
    }

    // Recalculate progress based on task completion
    const totalWeeks = updatedRoutine.totalWeeks
    const newProgress = calculateProgressWithTasks(
      plant.plantedDate,
      totalWeeks,
      updatedRoutine
    )
    const newStage = getStageFromProgress(newProgress) as Plant['currentStage']

    const updatedPlant: Plant = {
      ...plant,
      careRoutine: updatedRoutine,
      progress: newProgress,
      currentStage: newStage,
    }

    // Update localStorage
    const storedPlants = JSON.parse(
      localStorage.getItem('fluorish:plants') || '[]'
    ) as Plant[]
    const updatedPlants = storedPlants.map((p) =>
      p.id === plant.id ? updatedPlant : p
    )
    localStorage.setItem('fluorish:plants', JSON.stringify(updatedPlants))

    setPlant(updatedPlant)
  }

  const handleUpdateCareRoutine = (careOptions: CareOption[]) => {
    if (!plant || !plant.careRoutine) return

    // Add care options as new tasks to the care routine
    const updatedRoutine = { ...plant.careRoutine }
    const currentWeek = plant.plantedDate
      ? getCurrentWeek(plant.plantedDate, plant.careRoutine.totalWeeks)
      : 1

    // Add care options to current and next few weeks
    careOptions.forEach((option, index) => {
      const targetWeek = Math.min(currentWeek + index, updatedRoutine.totalWeeks)
      const week = updatedRoutine.weeks.find((w) => w.weekNumber === targetWeek)
      if (week) {
        // Add to Monday of the target week
        const monday = week.days.find((d) => d.day === 'Monday')
        if (monday) {
          monday.tasks.push({
            id: `care-${option.id}-${targetWeek}`,
            title: option.title,
            completed: false,
          })
        }
      }
    })

    // Extend care routine if needed (add 1-2 more weeks for recovery)
    const additionalWeeks = Math.ceil(careOptions.length / 2)
    if (updatedRoutine.totalWeeks < currentWeek + additionalWeeks) {
      const newTotalWeeks = currentWeek + additionalWeeks
      // Generate additional weeks
      for (let week = updatedRoutine.totalWeeks + 1; week <= newTotalWeeks; week++) {
        updatedRoutine.weeks.push({
          weekNumber: week,
          days: [
            { day: 'Monday', tasks: [] },
            { day: 'Tuesday', tasks: [] },
            { day: 'Wednesday', tasks: [] },
            { day: 'Thursday', tasks: [] },
            { day: 'Friday', tasks: [] },
            { day: 'Saturday', tasks: [] },
            { day: 'Sunday', tasks: [] },
          ],
        })
      }
      updatedRoutine.totalWeeks = newTotalWeeks
    }

    const updatedPlant: Plant = {
      ...plant,
      careRoutine: updatedRoutine,
    }

    // Update localStorage
    const storedPlants = JSON.parse(
      localStorage.getItem('fluorish:plants') || '[]'
    ) as Plant[]
    const updatedPlants = storedPlants.map((p) => (p.id === plant.id ? updatedPlant : p))
    localStorage.setItem('fluorish:plants', JSON.stringify(updatedPlants))

    setPlant(updatedPlant)
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  if (!plant) {
    return (
      <AppLayout>
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 lg:hidden">
          <p className="text-sm text-muted">Loading plant details...</p>
        </div>
      </AppLayout>
    )
  }

  if (showPlantDoctor) {
    return (
      <AppLayout>
        <PlantDoctor
          plant={plant}
          onClose={() => setShowPlantDoctor(false)}
          onUpdateCareRoutine={handleUpdateCareRoutine}
        />
      </AppLayout>
    )
  }

  const currentWeek = plant.plantedDate
    ? getCurrentWeek(plant.plantedDate, plant.careRoutine?.totalWeeks || 8)
    : 1

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 pb-32 lg:hidden relative">
        {/* Back button */}
        <button
          onClick={() => navigate('/my-plants')}
          className="fixed top-4 left-4 self-start text-sm font-semibold text-muted hover:text-foreground transition-colors z-10"
        >
          ← Back
        </button>

        {/* Check Health button */}
        <button
          onClick={() => setShowPlantDoctor(true)}
          className="fixed bottom-30 right-6 btn-primary text-sm px-4 py-2 z-10 drop-shadow-sm drop-shadow-white/30"
        >
          Check Health
        </button>

        {/* Progress and Stage */}
        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-surface-elevated/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Current Stage
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {plant.currentStage || 'Planting'}
            </p>
            <p className="mt-1 text-sm text-muted">Week {currentWeek} of {plant.careRoutine?.totalWeeks || 8}</p>
          </div>
          <CircularProgress progress={plant.progress || 0} />
        </div>

        {/* Image and Basic Info */}
        <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
          <img
            src={plant.image}
            alt={plant.name}
            className="h-64 w-full object-cover"
          />
          <div className="p-5 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{plant.name}</h1>
              <p className="text-sm text-muted mt-1">{plant.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Sunlight
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {plant.sunlightHours} hrs/day
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Watering
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {plant.watering}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Maintenance
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {plant.maintenance}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  First harvest
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {plant.timeToFirstHarvest}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Routine */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Care Routine</h2>
          {plant.careRoutine?.weeks.map((week) => (
            <WeekAccordion
              key={week.weekNumber}
              week={week}
              isExpanded={expandedWeeks.has(week.weekNumber)}
              expandedDays={expandedDays}
              onToggleWeek={() => toggleWeek(week.weekNumber)}
              onToggleDay={(day) => toggleDay(week.weekNumber, day)}
              onToggleTask={(day, taskId) => toggleTask(week.weekNumber, day, taskId)}
            />
          ))}
        </div>
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

function WeekAccordion({
  week,
  isExpanded,
  expandedDays,
  onToggleWeek,
  onToggleDay,
  onToggleTask,
}: {
  week: PlantWeek
  isExpanded: boolean
  expandedDays: Set<string>
  onToggleWeek: () => void
  onToggleDay: (day: string) => void
  onToggleTask: (day: string, taskId: string) => void
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-surface-elevated/80 overflow-hidden">
      <button
        onClick={onToggleWeek}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-foreground">Week {week.weekNumber}</span>
        <span className="text-muted">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && (
        <div className="border-t border-white/10">
          {week.days.map((day) => (
            <DayAccordion
              key={day.day}
              day={day}
              isExpanded={expandedDays.has(`${week.weekNumber}-${day.day}`)}
              onToggleDay={() => onToggleDay(day.day)}
              onToggleTask={(taskId) => onToggleTask(day.day, taskId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DayAccordion({
  day,
  isExpanded,
  onToggleDay,
  onToggleTask,
}: {
  day: PlantDay
  isExpanded: boolean
  onToggleDay: () => void
  onToggleTask: (taskId: string) => void
}) {
  const hasTasks = day.tasks.length > 0

  return (
    <div className="border-t border-white/5">
      <button
        onClick={onToggleDay}
        disabled={!hasTasks}
        className={`w-full flex items-center justify-between p-3 pl-6 text-left transition-colors ${
          hasTasks ? 'hover:bg-white/5' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <span className="text-sm font-medium text-foreground">{day.day}</span>
        {hasTasks && (
          <span className="text-xs text-muted">
            {day.tasks.filter((t) => t.completed).length} / {day.tasks.length}
          </span>
        )}
        {hasTasks && <span className="text-muted ml-2">{isExpanded ? '−' : '+'}</span>}
      </button>
      {isExpanded && hasTasks && (
        <div className="border-t border-white/5 pl-6 pr-3 pb-3">
          <div className="space-y-2 pt-2">
            {day.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TaskItem({
  task,
  onToggle,
}: {
  task: PlantTask
  onToggle: () => void
}) {
  return (
    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="w-4 h-4 rounded border-white/20 bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-background"
      />
      <span
        className={`text-sm flex-1 ${
          task.completed ? 'line-through text-muted' : 'text-foreground'
        }`}
      >
        {task.title}
      </span>
    </label>
  )
}

