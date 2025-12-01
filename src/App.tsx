import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-svh bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
            Fluorish
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            React + Vite + Tailwind CSS 4 starter
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Tailwind utilities are ready to go out of the box. Edit{' '}
            <code className="rounded bg-slate-900 px-2 py-1 text-slate-100">
              src/App.tsx
            </code>{' '}
            and save to start building.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Counter demo
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-6xl font-semibold text-white">{count}</p>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                onClick={() => setCount((value) => value + 1)}
              >
                Increment
              </button>
              <button
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                onClick={() => setCount(0)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500">
          Built with Vite, React, Tailwind CSS 4, and first-class PWA support.
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
