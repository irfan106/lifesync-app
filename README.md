# LifeSync

LifeSync is a cross-platform personal productivity and self-management app built with React Native and Expo. It brings together daily task planning, expense tracking, personal analytics, goal visualization, and future-self journaling inside a single mobile-first experience.

## Overview

The app is designed as an all-in-one life management companion for users who want to stay consistent with daily routines, track spending habits, and reflect on long-term growth. It combines cloud-backed data modules with local device persistence to create a smooth, personalized experience.

## Features

- Secure authentication with email/password and Google Sign-In
- Protected app navigation with persistent login state
- Personal dashboard with greeting, motivational quotes, quick stats, and activity summaries
- Task management with create, edit, complete, delete, category tagging, and deadline scheduling
- Task history with search, filters, grouped views, detail modal, and JSON/CSV export
- Expense tracker with categorized entries, notes, date/time logging, and edit/delete flows
- Spending analytics with category distribution, comparison insights, and time-range filters
- Expense history with search, category filters, and grouped ledger views
- Vision board for storing and managing long-term goals
- Time capsule system for sending notes to a future date with mood-based tagging
- Glassmorphic UI with custom cards, blurred inputs, floating action buttons, gradients, and bottom sheets

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Firebase Authentication
- Cloud Firestore
- AsyncStorage
- TanStack Query
- Formik
- Yup
- `@gorhom/bottom-sheet`
- `react-native-chart-kit`
- `react-native-svg`
- Expo Blur
- Expo Linear Gradient

## App Modules

### Dashboard
- Personalized greeting and rotating daily quote
- Today’s task progress
- Daily and weekly spending summaries
- Time capsule shortcut
- Vision board preview

### Tasks
- Schedule tasks by date and time
- Mark tasks as completed
- Track missed and overdue items
- View 7-day efficiency chart
- Browse task history with export support

### Wallet
- Add categorized expenses
- Review same-day spending
- Explore analytics and smart insights
- Search and filter full expense history

### Vision Board
- Add and remove personal goals
- Display goals as stylized progress cards

### Time Capsule
- Write messages to your future self
- Set unlock date and time
- Assign moods such as motivation, reflection, celebration, or random
- Store capsules in a locked vault until release time

## Project Structure

```text
app/             Expo Router screens and navigation
components/      Feature-level UI modules
controllers/     React Query hooks and mutation logic
services/        Firebase and service-layer access
context/         Auth and theme providers
design-system/   Reusable UI primitives
interfaces/      Shared TypeScript contracts
assets/          Images and app branding assets
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo CLI or `npx expo`
- Android Studio, Xcode, or Expo Go for device testing

### Installation

```bash
npm install
```

### Run the App

```bash
npm start
```

Other scripts:

```bash
npm run android
npm run ios
npm run web
```

## Build & Deployment

The project includes Expo Application Services configuration through `eas.json` and `app.json`, making it ready for internal, preview, and production Android builds.

## Why This Project Stands Out

LifeSync is more than a basic tracker. It blends productivity, finance, motivation, and reflection into one cohesive product with a polished mobile interface, modular architecture, and real user-focused flows.
