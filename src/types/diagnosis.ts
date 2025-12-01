export type HealthStatus = 'healthy' | 'unhealthy'

export type DiagnosisFactor = {
  name: string
  status: 'good' | 'warning' | 'critical'
  description: string
}

export type CareOption = {
  id: string
  title: string
  description: string
  frequency: string
  duration: string // e.g., "2 weeks"
}

export type DiagnosisResult = {
  status: HealthStatus
  summary: string
  factors: DiagnosisFactor[]
  careOptions?: CareOption[]
  image?: string // base64 or URL
}

