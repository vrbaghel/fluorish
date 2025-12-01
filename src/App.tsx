import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-svh bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
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
    </main>
  )
}

export default App
