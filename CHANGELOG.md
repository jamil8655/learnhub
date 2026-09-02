# Changelog - LearnHub

## [v247.0.0] - 2026-09-02
### Added
- **Android Native Architecture**: Implemented Kotlin Clean Architecture under `com.learnhubplatform.app` (Core, Data, Domain, Presentation).
- **Target SDK 36 (Android 16)**: Upgraded `compileSdk` and `targetSdk` to 36 for Google Play 2026 compliance.
- **QiblaMathUtils**: Unit-testable Great Circle Kaaba bearing calculations ($21.4225^\circ\text{ N}, 39.8262^\circ\text{ E}$).
- **PrayerTimeCalculator**: Astronomical solar calculation engine for 5 daily prayers.
- **Interactive Live Diagnostics Runner**: In-app live testing suite verifying all 8 subsystems in real-time.
- **Docs & Guides**: Created `docs/android-architecture.md` and `FEATURE_DEVELOPMENT_GUIDE.md`.

### Fixed
- Purged all legacy fallback mock IDs (`usr-student-1`, `cloud_usr_admin`).
- Cleaned up mobile viewport by hiding desktop website footer on mobile screens.
