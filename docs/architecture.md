# GharConnect Architecture

GharConnect is organized around feature modules with shared domain contracts and Firebase-facing adapters.

## Top-level source folders

- `src/features`: user-facing product areas from the requirements.
- `src/domain`: app-wide data models and permission helpers.
- `src/firebase`: Firebase configuration, collection names, and backend path helpers.
- `src/navigation`: app shell and typed navigation contracts.
- `src/shared`: reusable components and helpers that are not tied to one feature.
- `src/components`, `src/hooks`, `src/theme`, `src/localization`, `src/storage`: existing app foundations.

## Feature modules

- `auth`: session, signup, login, password reset, and family onboarding state.
- `home`: attention feed, quick actions, smart search entry, birthday and reminder highlights.
- `vault`: private/public vault, documents, finance, properties, secure items, and sharing rules.
- `family`: members, roles, join requests, announcements, health records, and emergency details.
- `calendar`: monthly/weekly views and the unified reminder engine.
- `profile`: account settings, family QR code, member settings, and logout.
- `search`: cross-module search for vault items, members, and reminders.
- `notifications`: push registration, reminder scheduling, and in-app fallback alerts.

Each feature can grow with the same internal shape:

- `screens`: route-level screens.
- `components`: feature-only UI pieces.
- `hooks`: feature-only state hooks.
- `services`: Firebase repositories and side-effect boundaries.
- `types`: feature-specific type definitions.

## Firebase data boundaries

Private vault data should be stored under a user-owned path and guarded by Firebase security rules so it is never queryable by other members. Public family data should be stored under family-scoped paths and checked against approved family membership.

Suggested collections:

- `users`
- `families`
- `joinRequests`
- `families/{familyId}/vaultItems`
- `users/{userId}/privateVault`
- `families/{familyId}/reminders`
- `families/{familyId}/healthRecords`
- `families/{familyId}/announcements`

The repository interfaces in each feature describe the app contracts before committing to a specific Firebase SDK implementation.
