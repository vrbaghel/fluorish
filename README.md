# Fluorish PWA Starter

A React + TypeScript + Vite project that ships with an opinionated progressive web app setup out of the box. Service workers are registered automatically in every environment so the app works offline by default and updates itself when new builds are deployed.

## Getting started

```bash
npm install
npm run dev
```

### Useful scripts

- `npm run dev` – start the local dev server with the PWA enabled.
- `npm run build` – type-check and create a production build, including the service worker and precache manifest.
- `npm run preview` – preview the production build locally.

## PWA details

- Uses [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) with auto-update registration.
- Generates web manifest metadata (name, icons, colors) from `vite.config.ts`.
- Provides ready-made icons under `public/` plus an Apple touch icon and maskable icon.
- Registers the service worker via `virtual:pwa-register` so users get offline support by default.

You can customize the manifest, icons, caching strategy, or service worker behavior inside `vite.config.ts`. Refer to the plugin documentation for advanced options such as custom Workbox routes or runtime caching.

## Tailwind CSS 4

- Tailwind v4 is wired through the official Vite plugin (`@tailwindcss/vite`) following the steps in the Tailwind docs for Vite integrations, so there’s no standalone config file to maintain.[^tailwind-vite]
- Global styles import Tailwind directly via `@import 'tailwindcss';` inside `src/index.css`, making every utility available immediately.
- Update the UI by editing `src/App.tsx` and using utility classes; the example counter screen demonstrates gradients, blur, and responsive typography out of the box.

[^tailwind-vite]: https://tailwindcss.com/docs/installation/using-vite
