import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            Fluorish
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Urban gardening for compact city spaces
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Plan and track a thriving balcony or window garden, tuned to your
            light, space, and local climate.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted">
            Daily care streak
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-5xl font-semibold text-foreground">{count}</p>
              <p className="text-xs text-muted">days watering on schedule</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="btn-primary"
                onClick={() => setCount((value) => value + 1)}
              >
                Mark today as done
              </button>
              <button
                className="btn-secondary"
                onClick={() => setCount(0)}
              >
                Reset streak
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-muted">
          Built for mobile PWA — perfect for balconies, windowsills, and tiny
          terraces.
        </footer>
      </section>

      <section className="hidden min-h-svh flex-col items-center justify-center gap-4 px-6 text-center lg:flex">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-8 py-10 shadow-2xl shadow-red-900/40">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
            Desktop blocked
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">
            Fluorish only runs as a PWA on mobile screens
          </h2>
          <p className="mt-3 text-base text-red-200">
            Install the app as a Progressive Web App on your phone or shrink the
            viewport to continue.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Switch to mobile view to proceed
        </p>
      </section>
    </main>
  )
}

export default App
