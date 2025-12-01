import type { Plant } from '../types/plant'
import type { DiagnosisResult } from '../types/diagnosis'

export function generateMockDiagnosis(plant: Plant, image: string): DiagnosisResult {
  // Randomly determine if plant is healthy (70% chance healthy for demo)
  const isHealthy = Math.random() > 0.5

  if (isHealthy) {
    return {
      status: 'healthy',
      summary: `Your ${plant.name} appears to be in excellent health! The leaves show vibrant color, proper structure, and no visible signs of disease or pest infestation.`,
      image,
      factors: [
        {
          name: 'Leaf Color',
          status: 'good',
          description: 'Leaves display healthy green coloration with no discoloration or yellowing.',
        },
        {
          name: 'Leaf Structure',
          status: 'good',
          description: 'Leaves are properly formed with no signs of wilting or deformation.',
        },
        {
          name: 'Stem Health',
          status: 'good',
          description: 'Stems appear strong and healthy with no visible damage.',
        },
        {
          name: 'Pest Presence',
          status: 'good',
          description: 'No visible signs of pests or insect damage detected.',
        },
      ],
    }
  }

  // Unhealthy plant diagnosis
  const issues = [
    {
      name: 'Leaf Discoloration',
      status: 'warning' as const,
      description: 'Some leaves show signs of yellowing, which may indicate nutrient deficiency or overwatering.',
    },
    {
      name: 'Pest Infestation',
      status: 'critical' as const,
      description: 'Visible signs of pest activity detected. Immediate treatment recommended.',
    },
    {
      name: 'Leaf Spots',
      status: 'warning' as const,
      description: 'Small brown spots observed, possibly indicating fungal infection.',
    },
  ]

  return {
    status: 'unhealthy',
    summary: `Your ${plant.name} shows signs of health issues that need attention. We've identified several factors that may be affecting your plant's growth and vitality.`,
    image,
    factors: [
      {
        name: 'Leaf Color',
        status: 'warning',
        description: 'Some discoloration detected. May need nutrient adjustment.',
      },
      ...issues.slice(0, 2),
      {
        name: 'Overall Condition',
        status: 'warning',
        description: 'Plant shows signs of stress but can recover with proper care.',
      },
    ],
    careOptions: [
      {
        id: 'care-1',
        title: 'Apply Neem Oil Treatment',
        description: 'Spray neem oil solution on leaves to treat pest infestation. Apply in the evening to avoid sunburn.',
        frequency: 'Every 3 days',
        duration: '2 weeks',
      },
      {
        id: 'care-2',
        title: 'Adjust Watering Schedule',
        description: 'Reduce watering frequency to prevent root rot. Check soil moisture before watering.',
        frequency: 'As needed',
        duration: '1 week',
      },
      {
        id: 'care-3',
        title: 'Apply Balanced Fertilizer',
        description: 'Feed plant with balanced NPK fertilizer to address nutrient deficiency.',
        frequency: 'Once a week',
        duration: '3 weeks',
      },
    ],
  }
}

