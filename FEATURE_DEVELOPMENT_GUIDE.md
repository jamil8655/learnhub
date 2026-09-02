# LearnHub Android Feature Development Guide

## How to Add a New Feature to LearnHub Android

Follow this 18-step contract:
1. **Define Requirement**: Specify the user story and success criteria.
2. **Define Feature Contract**: Define data models and API requirements.
3. **Add Navigation Route**: Add route constant in `com.learnhubplatform.app.core.navigation.NavRoutes`.
4. **Create Data Model**: In `data/models/`.
5. **Create Repository**: In `data/repositories/`.
6. **Create UseCase**: In `domain/usecases/`.
7. **Create ViewModel**: In `presentation/viewmodels/`.
8. **Add UI Screen / Component**: In `presentation/ui/`.
9. **Add Firebase Integration**: Bind to canonical Firestore subcollections.
10. **Add Security Rules**: In `firestore.rules` and `storage.rules`.
11. **Add Loading & Error States**: Provide explicit skeleton loaders and retry handlers.
12. **Add Localization (i18n)**: In `res/values/strings.xml` and `js/i18n.js`.
13. **Add RTL Support**: Support `dir="rtl"` for Urdu/Arabic.
14. **Add Accessibility**: TalkBack content descriptions and 48dp touch targets.
15. **Write Unit Tests**: Test calculations and viewmodel state transitions.
16. **Test Staging**: Verify in development mode.
17. **Release**: Build release artifact.
18. **Verify Production**: Verify against live backend without fake data.
