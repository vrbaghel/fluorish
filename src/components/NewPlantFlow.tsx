import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Plant, PlantPreferences } from '../types/plant'
import { mockPlants } from '../mocks/mockPlants'
import { generateCareRoutine, calculateProgressWithTasks, getStageFromProgress } from '../utils/plantHelpers'

type Step = 1 | 2 | 3

export default function NewPlantFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [preferences, setPreferences] = useState<PlantPreferences>({
    style: null,
    size: null,
    maintenance: null,
    watering: null,
    budget: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [recommendedPlants, setRecommendedPlants] = useState<Plant[]>([])
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0)

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      // Check if all questions are answered
      const allAnswered = Object.values(preferences).every((value) => value !== null)
      if (!allAnswered) return

      // Show loading screen
      setIsLoading(true)
      setTimeout(() => {
        // Mock recommendation - just return all plants for now
        setRecommendedPlants(mockPlants)
        setIsLoading(false)
        setStep(3)
      }, 3000)
    }
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/dashboard')
    } else if (step === 2) {
      setStep(1)
    }
  }

  const handleClose = () => {
    navigate('/dashboard')
  }

  const handleSelectPlant = () => {
    const selectedPlant = recommendedPlants[selectedPlantIndex]
    if (!selectedPlant) return

    // Initialize plant with care routine and progress
    const plantedDate = new Date().toISOString()
    const totalWeeks = parseInt(selectedPlant.timeToFirstHarvest.match(/\d+/)?.[0] || '8')
    const careRoutine = generateCareRoutine(selectedPlant, totalWeeks)
    const progress = calculateProgressWithTasks(plantedDate, totalWeeks, careRoutine)
    const currentStage = getStageFromProgress(progress)

    const initializedPlant: Plant = {
      ...selectedPlant,
      plantedDate,
      careRoutine,
      progress,
      currentStage: currentStage as Plant['currentStage'],
    }

    // Save to localStorage
    const existingPlants = JSON.parse(
      localStorage.getItem('fluorish:plants') || '[]'
    ) as Plant[]
    const updatedPlants = [...existingPlants, initializedPlant]
    localStorage.setItem('fluorish:plants', JSON.stringify(updatedPlants))

    // Navigate to My Plants page
    navigate('/my-plants')
  }

  // Show loading step if loading
  if (isLoading) {
    return <LoadingStep />
  }

  if (step === 1) {
    return <GuidanceStep onNext={handleNext} onBack={handleBack} />
  }

  if (step === 2) {
    return (
      <PreferencesStep
        preferences={preferences}
        onPreferencesChange={setPreferences}
        onNext={handleNext}
        onBack={handleBack}
      />
    )
  }

  if (step === 3) {
    return (
      <PlantSelectionStep
        plants={recommendedPlants}
        selectedIndex={selectedPlantIndex}
        onIndexChange={setSelectedPlantIndex}
        onSelect={handleSelectPlant}
        onClose={handleClose}
      />
    )
  }

  return null
}

function GuidanceStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 relative lg:hidden">
      <button
        onClick={onBack}
        className="btn-secondary fixed top-4 left-4 z-10"
      >
        ← Back
      </button>
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          NEW PLANT
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          Find your perfect plant
        </h1>
        <p className="text-base text-muted sm:text-lg">
          We&apos;ll ask you a few questions to recommend plants that match your space and preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              1
            </div>
            <div>
              <p className="font-semibold text-foreground">Answer questions</p>
              <p className="text-sm text-muted">
                Tell us about your preferences for plant style, size, and care level.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              2
            </div>
            <div>
              <p className="font-semibold text-foreground">Get recommendations</p>
              <p className="text-sm text-muted">
                We&apos;ll match you with plants that fit your space and lifestyle.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              3
            </div>
            <div>
              <p className="font-semibold text-foreground">Choose your plant</p>
              <p className="text-sm text-muted">
                Browse recommended plants and select one to start growing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button className="btn-primary w-3/4 mx-auto fixed bottom-25 left-0 right-0" onClick={onNext}>
        Get started
      </button>
    </div>
  )
}

function PreferencesStep({
  preferences,
  onPreferencesChange,
  onNext,
  onBack,
}: {
  preferences: PlantPreferences
  onPreferencesChange: (prefs: PlantPreferences) => void
  onNext: () => void
  onBack: () => void
}) {
  const questions = [
    {
      key: 'style' as const,
      question: 'Select a plant style?',
      options: ['Fresh herbs', 'Edible', 'Aesthetic', 'Fragrance', 'Hobby'] as const,
    },
    {
      key: 'size' as const,
      question: 'What plant size do you prefer?',
      options: ['Small', 'Medium', 'Large'] as const,
    },
    {
      key: 'maintenance' as const,
      question: 'How much effort are you comfortable putting in?',
      options: ['Very low', 'Low to moderate', 'Moderate', 'High'] as const,
    },
    {
      key: 'watering' as const,
      question: 'How often can you realistically water this plant?',
      options: ['Every day', '2-3 times a week', 'Once a week', 'Every 2 weeks', 'Monthly'] as const,
    },
    {
      key: 'budget' as const,
      question: "What's your budget?",
      options: ['< $10', '$10-$20', '$20-$50', '$50+'] as const,
    },
  ]

  const currentQuestionIndex = questions.findIndex(
    (q) => preferences[q.key] === null
  )
  const currentQuestion = currentQuestionIndex >= 0 ? questions[currentQuestionIndex] : null
  const allAnswered = Object.values(preferences).every((value) => value !== null)

  // Find the last answered question index for back navigation
  let lastAnsweredIndex = -1
  for (let i = questions.length - 1; i >= 0; i--) {
    if (preferences[questions[i].key] !== null) {
      lastAnsweredIndex = i
      break
    }
  }

  const handleSelect = (key: keyof PlantPreferences, value: string) => {
    onPreferencesChange({
      ...preferences,
      [key]: value as unknown,
    })
  }

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      // First question - go back to step 1
      onBack()
    } else if (lastAnsweredIndex >= 0) {
      // Go back to previous question by clearing the last answered one
      const previousQuestionKey = questions[lastAnsweredIndex].key
      onPreferencesChange({
        ...preferences,
        [previousQuestionKey]: null,
      })
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden relative">
      <button
        onClick={handleBack}
        className="btn-secondary fixed top-4 left-4 z-10"
      >
        ← Back
      </button>
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          STEP 2 OF 3
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {currentQuestion?.question || 'All set!'}
        </h1>
        {!allAnswered && (
          <p className="text-base text-muted sm:text-lg mt-5">
            {currentQuestionIndex + 1} of {questions.length} questions
          </p>
        )}
        {allAnswered && (
          <p className="text-base text-muted sm:text-lg mt-2">
            Ready to find your perfect plant match
          </p>
        )}
      </div>

      {currentQuestion && (
        <div className="flex justify-center flex-wrap gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = preferences[currentQuestion.key] === option
            return (
              <button
                key={option}
                onClick={() => handleSelect(currentQuestion.key, option)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-background'
                    : 'border border-white/20 bg-surface-elevated/80 text-foreground hover:border-white/40'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}

      {allAnswered && (
        <>
          <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl mb-4">✨</div>
                <p className="text-base text-muted">
                  Great! We have all the information we need to find your perfect plant match.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">We&apos;ll analyze your preferences</p>
                    <p className="text-xs text-muted mt-1">
                      Matching your answers with plants that fit your space, lifestyle, and care level.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Browse recommended plants</p>
                    <p className="text-xs text-muted mt-1">
                      Swipe through personalized plant recommendations with detailed information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Start your plant journey</p>
                    <p className="text-xs text-muted mt-1">
                      Select a plant and we&apos;ll create a personalized care routine just for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary w-3/4 fixed bottom-25 left-0 right-0 mx-auto" onClick={onNext}>
            Get recommendations
          </button>
        </>
      )}
    </div>
  )
}

function LoadingStep() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-start gap-6 px-6 py-16 lg:hidden">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          FINDING YOUR PLANTS
        </p>
        <h2 className="text-2xl font-semibold">We&apos;re matching you with perfect plants</h2>
        <div className="flex flex-col items-center justify-center h-[40vh]">
            <p className="text-sm text-muted">
            Analyzing your preferences and space conditions…
            </p>
            <div className="mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-white/10 mx-auto">
            <span className="block h-full w-1/3 animate-pulse bg-primary" />
            </div>
        </div>
      </div>
    </div>
  )
}

function PlantSelectionStep({
  plants,
  selectedIndex,
  onIndexChange,
  onSelect,
  onClose,
}: {
  plants: Plant[]
  selectedIndex: number
  onIndexChange: (index: number) => void
  onSelect: () => void
  onClose: () => void
}) {
  const currentPlant = plants[selectedIndex]
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  if (!currentPlant) return null

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && selectedIndex < plants.length - 1) {
      onIndexChange(selectedIndex + 1)
    }
    if (isRightSwipe && selectedIndex > 0) {
      onIndexChange(selectedIndex - 1)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 pb-32 lg:hidden relative">
    <button
        onClick={onClose}
        className="btn-secondary fixed top-4 left-4 z-10"
    >
        Close
    </button>
      <div className="flex flex-col items-center justify-between">
        <div className="w-16" /> {/* Spacer for centering */}
        <div className="space-y-3 text-center flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            STEP 3 OF 3
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Recommended plants
          </h1>
          <p className="text-base text-muted sm:text-lg">
            Swipe to browse and select your plant
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${selectedIndex * 100}%)`,
          }}
        >
          {plants.map((plant) => (
            <div key={plant.id} className="min-w-full">
              <img
                src={plant.image}
                alt={plant.name}
                className="h-64 w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {plants.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex ? 'w-8 bg-primary' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Swipe buttons */}
        {selectedIndex > 0 && (
          <button
            onClick={() => onIndexChange(selectedIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 py-2 px-3 text-white backdrop-blur-sm"
          >
            ←
          </button>
        )}
        {selectedIndex < plants.length - 1 && (
          <button
            onClick={() => onIndexChange(selectedIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 py-2 px-3 text-white backdrop-blur-sm"
          >
            →
          </button>
        )}
      </div>

      {/* Plant details */}
      <div className="h-[22vh] overflow-y-auto rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{currentPlant.name}</h2>
            <p className="text-sm text-muted">{currentPlant.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Success rate
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {currentPlant.successRate}%
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Sunlight needed
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {currentPlant.sunlightHours} hrs/day
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Watering
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {currentPlant.watering}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                First harvest
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {currentPlant.timeToFirstHarvest}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-25 left-0 right-0 z-40 mx-auto w-3/4 max-w-2xl px-6 lg:hidden">
        <button className="btn-primary w-full" onClick={onSelect}>
          Plant {currentPlant.name}
        </button>
      </div>
    </div>
  )
}

