
Redux Toolkit integration added (typescript).
Files added:
 - redux/store.ts
 - redux/slices/onboardingSlice.ts
 - redux/slices/uiSlice.ts
 - redux/hooks.ts

Modifications:
 - App.tsx: onboarding step moved to Redux (selector + dispatch). Backup at App.tsx.bak
 - pages/_app.tsx created to wrap the app with Provider.

Next steps you may want to do:
 - Replace other local component state (useState/useEffect) by creating focused slices (auth, profile, shop, quest, ui).
 - Use `useAppSelector` and `useAppDispatch` in components to read/update state.
 - Install dependencies: `npm install @reduxjs/toolkit react-redux`
 - Add persist or middleware if needed.

Automated refactor was applied only to App.tsx as an example. For a full migration I can continue and refactor more files — tell me to proceed.
