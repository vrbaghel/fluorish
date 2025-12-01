import { useState, useRef } from 'react'
import type { Plant } from '../types/plant'
import type { DiagnosisResult, CareOption } from '../types/diagnosis'
import { generateMockDiagnosis } from '../mocks/mockDiagnosis'

type Step = 1 | 2 | 3 | 4

type PlantDoctorProps = {
  plant: Plant
  onClose: () => void
  onUpdateCareRoutine: (careOptions: CareOption[]) => void
}

export default function PlantDoctor({ plant, onClose, onUpdateCareRoutine }: PlantDoctorProps) {
  const [step, setStep] = useState<Step>(1)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleStartCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setImageSource('camera')
      setStep(2)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please try uploading a photo instead.')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
    setImageSource('upload')
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result as string)
        setStep(2)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        // Stop camera stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
          setStream(null)
        }
      }
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    if (imageSource === 'camera') {
      handleStartCamera()
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleContinue = () => {
    if (!capturedImage) return

    setIsAnalyzing(true)
    setStep(3)

    // Simulate analysis (3-5 seconds)
    setTimeout(() => {
      const mockDiagnosis = generateMockDiagnosis(plant, capturedImage)
      setDiagnosis(mockDiagnosis)
      setIsAnalyzing(false)
      setStep(4)
    }, 3000 + Math.random() * 2000)
  }

  const handleUpdateCareRoutine = () => {
    if (diagnosis?.careOptions) {
      onUpdateCareRoutine(diagnosis.careOptions)
      onClose()
    }
  }

  // Cleanup camera stream on unmount
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    onClose()
  }

  if (step === 1) {
    return <GuidanceStep onStartCamera={handleStartCamera} onUpload={handleUploadClick} onClose={handleClose} />
  }

  if (step === 2) {
    return (
      <PhotoCaptureStep
        imageSource={imageSource}
        capturedImage={capturedImage}
        videoRef={videoRef as React.RefObject<HTMLVideoElement>}
        onCapture={handleCapturePhoto}
        onRetake={handleRetake}
        onContinue={handleContinue}
        onUpload={handleUploadClick}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        onFileSelect={handleFileSelect}
        onClose={handleClose}
      />
    )
  }

  if (step === 3) {
    return <AnalysisStep />
  }

  if (step === 4 && diagnosis) {
    return (
      <DiagnosisResultsStep
        diagnosis={diagnosis}
        onUpdateCareRoutine={handleUpdateCareRoutine}
        onClose={handleClose}
      />
    )
  }

  return null
}

function GuidanceStep({
  onStartCamera,
  onUpload,
  onClose,
}: {
  onStartCamera: () => void
  onUpload: () => void
  onClose: () => void
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden relative">
      <button
        onClick={onClose}
        className="fixed top-4 left-4 text-sm font-semibold text-muted hover:text-foreground transition-colors"
      >
        ← Close
      </button>

      <div className="space-y-3 text-center mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          PLANT DOCTOR
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          Check your plant&apos;s health
        </h1>
        <p className="text-base text-muted sm:text-lg">
          Take or upload a photo of your plant to get an AI-powered health diagnosis.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              1
            </div>
            <div>
              <p className="font-semibold text-foreground">Take or upload a photo</p>
              <p className="text-sm text-muted">
                Capture a clear image of your plant, focusing on leaves and stems.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              2
            </div>
            <div>
              <p className="font-semibold text-foreground">AI analysis</p>
              <p className="text-sm text-muted">
                Our system analyzes the image for signs of disease, pests, or nutrient issues.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              3
            </div>
            <div>
              <p className="font-semibold text-foreground">Get diagnosis</p>
              <p className="text-sm text-muted">
                Receive detailed health analysis and personalized care recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button className="btn-primary w-full" onClick={onStartCamera}>
          📷 Click Photo
        </button>
        <button className="btn-secondary w-full" onClick={onUpload}>
          📁 Upload Photo
        </button>
      </div>
    </div>
  )
}

function PhotoCaptureStep({
  imageSource,
  capturedImage,
  videoRef,
  onCapture,
  onRetake,
  onContinue,
  onUpload,
  fileInputRef,
  onFileSelect,
  onClose,
}: {
  imageSource: 'camera' | 'upload' | null
  capturedImage: string | null
  videoRef: React.RefObject<HTMLVideoElement>
  onCapture: () => void
  onRetake: () => void
  onContinue: () => void
  onUpload: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden relative">
      <button
        onClick={onClose}
        className="fixed top-4 left-4 text-sm font-semibold text-muted hover:text-foreground transition-colors z-10"
      >
        ← Close
      </button>

      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          CAPTURE PHOTO
        </p>
        <h1 className="text-2xl font-semibold leading-tight text-foreground">
          {capturedImage ? 'Review your photo' : imageSource === 'camera' ? 'Position your plant' : 'Upload photo'}
        </h1>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-black">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured plant" className="w-full h-64 object-cover" />
        ) : imageSource === 'camera' ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-muted">
            <p>No image selected</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />

      <div className="flex flex-col gap-3">
        {capturedImage ? (
          <>
            <button className="btn-primary w-full" onClick={onContinue}>
              Continue to analysis
            </button>
            <button className="btn-secondary w-full" onClick={onRetake}>
              {imageSource === 'camera' ? 'Retake Photo' : 'Reupload Photo'}
            </button>
          </>
        ) : imageSource === 'camera' ? (
          <button className="btn-primary w-full" onClick={onCapture}>
            Capture Photo
          </button>
        ) : (
          <button className="btn-primary w-full" onClick={onUpload}>
            Select Photo
          </button>
        )}
      </div>
    </div>
  )
}

function AnalysisStep() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 lg:hidden">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          ANALYZING
        </p>
        <h2 className="text-2xl font-semibold">Analyzing your plant&apos;s health</h2>
        <p className="text-sm text-muted">
          Examining leaves, stems, and overall plant condition…
        </p>
        <div className="mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-white/10 mx-auto">
          <span className="block h-full w-1/3 animate-pulse bg-primary" />
        </div>
      </div>
    </div>
  )
}

function DiagnosisResultsStep({
  diagnosis,
  onUpdateCareRoutine,
  onClose,
}: {
  diagnosis: DiagnosisResult
  onUpdateCareRoutine: () => void
  onClose: () => void
}) {
  const isHealthy = diagnosis.status === 'healthy'

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 pb-32 lg:hidden relative">
      <button
        onClick={onClose}
        className="fixed top-4 left-4 text-sm font-semibold text-muted hover:text-foreground transition-colors"
      >
        ← Close
      </button>

      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          DIAGNOSIS RESULTS
        </p>
        <h1
          className={`text-2xl font-semibold leading-tight ${
            isHealthy ? 'text-primary' : 'text-red-400'
          }`}
        >
          {isHealthy ? 'Your plant is fully healthy' : "Your plant doesn't look healthy"}
        </h1>
      </div>

      {diagnosis.image && (
        <div className="rounded-2xl overflow-hidden">
          <img src={diagnosis.image} alt="Diagnosed plant" className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3">Summary</h2>
        <p className="text-sm text-muted">{diagnosis.summary}</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Health Analysis</h2>
        <div className="space-y-3">
          {diagnosis.factors.map((factor, index) => (
            <div key={index} className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{factor.name}</p>
                  <p className="text-xs text-muted mt-1">{factor.description}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    factor.status === 'good'
                      ? 'bg-green-500/20 text-green-400'
                      : factor.status === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {factor.status === 'good' ? 'Good' : factor.status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isHealthy && diagnosis.careOptions && (
        <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recommended Care</h2>
          <div className="space-y-4">
            {diagnosis.careOptions.map((option) => (
              <div key={option.id} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                <p className="text-sm font-semibold text-foreground">{option.title}</p>
                <p className="text-xs text-muted mt-1">{option.description}</p>
                <p className="text-xs text-muted mt-2">
                  Frequency: {option.frequency} · Duration: {option.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-2xl px-6 lg:hidden">
        {isHealthy ? (
          <button className="btn-primary w-full" onClick={onClose}>
            Back to Plant Details
          </button>
        ) : (
          <button className="btn-primary w-full" onClick={onUpdateCareRoutine}>
            Update Care Routine
          </button>
        )}
      </div>
    </div>
  )
}

