# Jeremiah AI · Mobile-first and App Store roadmap

## Product direction
Jeremiah is a **mobile-first educational application**, designed for Apple App Store and Google Play distribution. Desktop remains supported; do not treat the phone view as a compressed desktop page.

## Initial implementation
- OG.1 phone layout supports 320–600px screens, including 360px and 390px targets.
- The classroom header preserves navigation, narration toggle, and a visible high-contrast Start over control.
- Main actions and witness reveal controls have touch-sized targets (44–48px).
- Viewport-safe padding respects notches, rounded corners, and bottom home indicators.
- Scripture and commentary remain readable, and inputs use 16px text to avoid iOS focus zoom.
- Keyboard, focus visibility, reduced motion, and landscape views require device checks before release.

## Native strategy (not yet implemented)
Evaluate Capacitor for packaging the existing React/Vite app for iOS and Android. **Do not add the wrapper before addressing server dependencies:** the current narration and teaching APIs depend on a Node server and OpenAI credentials, and must remain server-side behind a secure production endpoint. No API keys can be shipped in the app bundle. Confirm authentication, resume/progress synchronization, cached KJV, offline behavior, deep links, back navigation, and audio interruption behavior before shipping.

## Release gates
1. **Real device QA:** iPhone SE-sized screen (320/375), representative 390px iPhone, Android 360px, larger Android, and tablet. Verify scroll, touch, text sizing, landscape, VoiceOver/TalkBack and 200% text zoom.
2. **Lesson experience:** no horizontal overflow; all required content reachable; narration permission/autoplay failure has a user action; exit/return preserves progress.
3. **Platform readiness:** privacy policy, data collection disclosures, copyright/media permissions, child/teen protections if applicable, account deletion if required, content review, crash/error telemetry.
4. **Engineering:** HTTPS production APIs, secure key storage, staging vs production, authenticated access, retention policy, offline/online recovery, network loss tests.
5. **Publication:** Apple developer and Google Play accounts, app identifiers, icons, screenshots, age/content ratings, store listings and release pipeline.

This first change is **responsive foundation work**, not a claim that a native iOS/Android binary has been created or physically tested.
