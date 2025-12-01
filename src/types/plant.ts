export type PlantStyle = 'Fresh herbs' | 'Edible' | 'Aesthetic' | 'Fragrance' | 'Hobby'

export type PlantSize = 'Small' | 'Medium' | 'Large'

export type MaintenanceLevel = 'Very low' | 'Low to moderate' | 'Moderate' | 'High'

export type WateringFrequency = 'Every day' | '2-3 times a week' | 'Once a week' | 'Every 2 weeks' | 'Monthly'

export type BudgetRange = '< $10' | '$10-$20' | '$20-$50' | '$50+'

export type PlantPreferences = {
  style: PlantStyle | null
  size: PlantSize | null
  maintenance: MaintenanceLevel | null
  watering: WateringFrequency | null
  budget: BudgetRange | null
}

export type PlantStage = 'Planting' | 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvesting' | 'Dormant'

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export type PlantTask = {
  id: string
  title: string
  completed: boolean
}

export type PlantDay = {
  day: DayOfWeek
  tasks: PlantTask[]
}

export type PlantWeek = {
  weekNumber: number
  days: PlantDay[]
}

export type PlantCareRoutine = {
  weeks: PlantWeek[]
  totalWeeks: number
}

export type Plant = {
  id: string
  name: string
  image: string
  style: PlantStyle
  size: PlantSize
  maintenance: MaintenanceLevel
  watering: WateringFrequency
  successRate: number // percentage
  sunlightHours: number
  timeToFirstHarvest: string // e.g., "4-6 weeks"
  description: string
  price: number
  // Extended fields for user's plants
  plantedDate?: string // ISO date string
  currentStage?: PlantStage
  progress?: number // percentage 0-100
  careRoutine?: PlantCareRoutine
}

