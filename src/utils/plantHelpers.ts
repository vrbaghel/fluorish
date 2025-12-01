import type { Plant, PlantCareRoutine, DayOfWeek } from '../types/plant'

export function getCurrentWeek(plantedDate: string, totalWeeks: number): number {
  const planted = new Date(plantedDate)
  const now = new Date()
  const diffTime = now.getTime() - planted.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const week = Math.floor(diffDays / 7) + 1
  return Math.min(Math.max(week, 1), totalWeeks)
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return days[new Date().getDay()]
}

export function calculateProgress(
  plantedDate: string,
  totalWeeks: number,
  currentStage: string
): number {
  const planted = new Date(plantedDate)
  const now = new Date()
  const diffTime = now.getTime() - planted.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const totalDays = totalWeeks * 7
  const progress = Math.min(Math.max((diffDays / totalDays) * 100, 0), 100)
  return Math.round(progress)
}

export function generateCareRoutine(
  plant: Plant,
  totalWeeks: number
): PlantCareRoutine {
  const weeks: PlantCareRoutine['weeks'] = []

  for (let week = 1; week <= totalWeeks; week++) {
    const days: PlantCareRoutine['weeks'][0]['days'] = [
      { day: 'Monday', tasks: [] },
      { day: 'Tuesday', tasks: [] },
      { day: 'Wednesday', tasks: [] },
      { day: 'Thursday', tasks: [] },
      { day: 'Friday', tasks: [] },
      { day: 'Saturday', tasks: [] },
      { day: 'Sunday', tasks: [] },
    ]

    // Add watering tasks based on plant watering frequency
    if (plant.watering === 'Every day') {
      days.forEach((day) => {
        day.tasks.push({
          id: `water-${week}-${day.day}`,
          title: 'Water the plant',
          completed: false,
        })
      })
    } else if (plant.watering === '2-3 times a week') {
      // Water on Monday, Wednesday, Friday
      ;['Monday', 'Wednesday', 'Friday'].forEach((dayName) => {
        const day = days.find((d) => d.day === dayName)
        if (day) {
          day.tasks.push({
            id: `water-${week}-${dayName}`,
            title: 'Water the plant',
            completed: false,
          })
        }
      })
    } else if (plant.watering === 'Once a week') {
      days[0].tasks.push({
        id: `water-${week}-Monday`,
        title: 'Water the plant',
        completed: false,
      })
    } else if (plant.watering === 'Every 2 weeks') {
      if (week % 2 === 1) {
        days[0].tasks.push({
          id: `water-${week}-Monday`,
          title: 'Water the plant',
          completed: false,
        })
      }
    }

    // Add maintenance tasks based on maintenance level
    if (plant.maintenance === 'Moderate' || plant.maintenance === 'High') {
      // Check for pests on Wednesday
      days[2].tasks.push({
        id: `check-${week}-Wednesday`,
        title: 'Check for pests and diseases',
        completed: false,
      })

      // Fertilize on Friday (every other week for moderate, every week for high)
      if (plant.maintenance === 'High' || week % 2 === 0) {
        days[4].tasks.push({
          id: `fertilize-${week}-Friday`,
          title: 'Fertilize the plant',
          completed: false,
        })
      }
    }

    // Add stage-specific tasks
    if (week <= 2) {
      days[0].tasks.push({
        id: `germination-${week}-Monday`,
        title: 'Monitor germination progress',
        completed: false,
      })
    } else if (week <= 4) {
      days[3].tasks.push({
        id: `vegetative-${week}-Thursday`,
        title: 'Prune if needed',
        completed: false,
      })
    } else if (week >= totalWeeks - 2) {
      days[5].tasks.push({
        id: `harvest-${week}-Saturday`,
        title: 'Check if ready to harvest',
        completed: false,
      })
    }

    weeks.push({ weekNumber: week, days })
  }

  return { weeks, totalWeeks }
}

export function getStageFromProgress(progress: number, totalWeeks: number): string {
  if (progress < 10) return 'Planting'
  if (progress < 20) return 'Germination'
  if (progress < 50) return 'Vegetative'
  if (progress < 70) return 'Flowering'
  if (progress < 90) return 'Fruiting'
  if (progress < 100) return 'Harvesting'
  return 'Harvesting'
}

