## Flourish – Urban Gardening Companion (PWA)

Flourish is a mobile‑first web app that helps city dwellers plan, grow, and care for plants in compact spaces like balconies, windowsills, and small terraces. It runs best as a PWA on mobile, with a layout and navigation style that feel familiar to modern apps.

---

## Problem This App Solves

- **Limited space & light**: Urban homes often have very little space and inconsistent sunlight, making it hard to know which plants will actually thrive.
- **Overwhelm from information**: Most gardening advice is generic or scattered across articles and videos, not tailored to a specific person’s space, time, and effort.
- **Inconsistent care routines**: People forget when to water, fertilize, or check for pests, which leads to stressed or dead plants.
- **Lack of feedback**: It’s hard for beginners to know whether their plants are on track, healthy, or falling behind.

Flourish focuses on **simple, guided flows** and **clear daily actions**, so someone with zero gardening experience can still succeed.

---

## High‑Level Overview

Flourish is structured around a few key experiences:

- A **Dashboard** that gives a quick overview of your garden: how many plants you have, how many tasks you have today, and your current care streak.
- A **New Plant flow** that asks you about your preferences (space, care effort, watering frequency, budget) and then recommends suitable plants.
- A detailed **Plant Details screen** for each plant, showing progress, growth stage, and a week‑by‑week care routine.
- A **My Tasks view** that centralizes today’s care tasks across all plants.
- A **Plant Doctor** that lets you upload or capture a photo to get a friendly health “diagnosis” and suggested care actions.
- A **Profile area** for basic account info and logout, so all plant and onboarding data can be persisted and re‑used.

Everything is designed to be **glanceable**, **actionable**, and **friendly for beginners**.

---

## Core Features (Non‑Technical)

### 1. Onboarding & Preferences

- **Guided first‑time setup**: Walks new users through a short onboarding flow to capture basic context (e.g., light availability, home zone).
- **Preference questions for new plants**: When adding a plant, the app asks:
  - What plant style you like (herbs, edible, aesthetic, fragrance, hobby, etc.).
  - What plant size you prefer (small, medium, large).
  - How much maintenance you’re willing to commit to.
  - How often you can realistically water.
  - Your budget range.
- **Personalized recommendations**: Based on these answers, the app surfaces a curated list of recommended plants instead of making you search through a catalog.

### 2. Dashboard Overview

- **Welcome panel**: Greets the user by name and reinforces that this is “their” garden hub.
- **Key stats at a glance**:
  - Total plants and how many are still “active” (not finished/harvested).
  - Number of tasks you have to complete today.
- **Daily care streak**:
  - Shows how many days in a row you’ve completed all tasks.
  - Updates automatically when today’s tasks are all done.
  - Encourages consistent care through a simple, gamified metric.
- **Recent plants**:
  - A short list of your most recent plants with their current stage and progress.
  - Tapping takes you straight into that plant’s details.
- **Urban gardening fun fact**:
  - A small “Did you know?” card to keep users engaged and teach them the environmental impact of urban planting.

### 3. New Plant Flow

- **Step 1 – Guidance**:
  - Explains what will happen: answer questions → get recommendations → choose a plant.
  - Sets expectations before asking for input.
- **Step 2 – Questions with pill‑style choices**:
  - Each question is displayed full‑screen with tappable “pills” for the options.
  - Only one question is shown at a time to reduce cognitive load.
  - Shows progress through the questionnaire (e.g., “3 of 5 questions”).
  - When all answers are in, an “All set” screen explains:
    - That the app will match their preferences.
    - That they’ll be able to swipe through recommendations.
    - That a personalized care routine will be created for the plant they choose.
- **Step 3 – Recommended plants**:
  - Horizontal “carousel” of recommended plants you can swipe through.
  - Each plant shows:
    - Success rate.
    - Sunlight needed.
    - Watering frequency.
    - Time to first harvest.
  - A fixed “Plant” button at the bottom confirms your choice and saves the plant to “My Plants”.

### 4. My Plants

- **List of all user plants**:
  - Each card shows an image, name, and key info like sunlight needs and watering style.
  - Progress and current stage are shown so you know where each plant is in its lifecycle.
- **Automatic care routine setup**:
  - When you add a plant, the app generates a multi‑week care routine with tasks like watering, checking for pests, fertilizing, pruning, and monitoring harvest readiness.
  - The routine adapts to the plant’s watering and maintenance profile.

### 5. Plant Details Screen

- **Progress & stage at the top**:
  - A circular progress ring shows how far along the plant is (0–100%).
  - The current stage (e.g., Planting, Germination, Vegetative, Flowering, Fruiting, Harvesting) is clearly labeled.
- **Hero image & essentials**:
  - Large plant photo.
  - Description, sunlight hours, watering style, maintenance level, and time to first harvest.
- **Week‑by‑week care routine**:
  - Accordion‑style layout for weeks → days → tasks.
  - The current week and current day auto‑expand when you open the screen.
  - Tasks are simple checkboxes you can tick off as you complete them.
  - Marking tasks as done updates the plant’s progress and stage in real time.
- **Integrated Plant Doctor access**:
  - A prominent “Check Health” button is fixed at the bottom right, always available while viewing the plant.

### 6. My Tasks (Daily View)

- **Today‑only focus**:
  - Shows only the tasks that matter for *today* across all plants.
  - Groups tasks under each plant so you understand context (e.g., “Basil – Water the plant”).
- **Live sync with plant routines**:
  - Ticking a task here updates that task in the plant’s own care routine.
  - Once all tasks for a plant are done, that plant disappears from today’s list to reduce noise.
- **Weekend friendliness**:
  - If there are no tasks, the screen shows a friendly rest message (“Enjoy your weekend!” vs. “All tasks completed!”).
- **Streak integration**:
  - Completing all tasks for the day contributes to the daily care streak shown on the dashboard.

### 7. Plant Doctor

- **Step 1 – Guidance**:
  - Explains how to check plant health and what the feature does.
- **Step 2 – Photo capture/upload**:
  - Two clear options:
    - “Click Photo” (uses the camera).
    - “Upload Photo” (choose from gallery/files).
  - After capturing or uploading:
    - Shows a preview of the image.
    - Provides “Continue” and “Retake/Reupload” options so the user feels in control.
  - A short “analysis” loading screen simulates diagnosis.
- **Step 3 – Diagnosis results**:
  - Clear header:
    - “Your plant is fully healthy” **or**
    - “Your plant doesn’t look healthy”.
  - Shows the captured photo and a friendly text summary.
  - **Health analysis** section:
    - Breaks down factors (e.g., leaf color, pests, watering) with simple labels like “Good”, “Warning”, or “Critical”.
  - **If healthy**:
    - A single primary action to close and go back to the plant details page.
  - **If not healthy**:
    - A list of care options (e.g., increase watering frequency, apply neem oil, extra fertilizing).
    - An “Update Care Routine” button that extends or augments the plant’s existing routine with those corrective tasks.

### 8. Profile & Persistence

- **My Profile**:
  - Simple screen to view profile metadata and log out.
- **Session and data persistence**:
  - Login status, onboarding completion, user preferences, and planted plants all persist between sessions.
  - The user doesn’t have to redo onboarding or re‑add plants every time they open the app.

### 9. Mobile‑First PWA Experience

- **Bottom navigation bar**:
  - Five tabs: Dashboard, My Plants, New Plant, My Tasks, My Profile.
  - Icons + labels, with a clear highlight on the active tab.
  - Slightly elevated and blurred background so it’s visually separated from content while still feeling integrated.
- **Single‑column layout**:
  - All screens are optimized for small viewports.
  - Desktop view nudges users to try the app as a PWA on mobile.

---

## Tone & UX Principles

- **Beginner‑friendly**: Avoids jargon; uses clear labels like “Water the plant” instead of technical horticulture terms.
- **Guided, not overwhelming**: Breaks complex flows into small, digestible steps (onboarding, new plant, plant doctor).
- **Actionable at a glance**: Surfaces “what do I need to do today?” rather than just static information.
- **Encouraging**: Uses small touches (streaks, fun facts, celebratory messages) to make plant care feel rewarding, not like a chore.

Overall, Flourish is designed to be the **everyday companion for urban gardeners**, turning scattered tasks into a simple, guided routine that fits into busy city life.


