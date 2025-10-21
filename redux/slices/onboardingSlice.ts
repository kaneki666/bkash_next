import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  step: number;
  appState: "onboarding" | "main";
  petName: string;
  selectedAvatar: string;
}

const initialState: OnboardingState = {
  step: 1,
  appState: "onboarding",
  petName: "",
  selectedAvatar:
    "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2005_01_45%20AM.png?updatedAt=1756161114127",
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    nextStep: (state) => {
      if (state.step < 8) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    setPetName: (state, action: PayloadAction<string>) => {
      state.petName = action.payload;
    },
    setAppState: (state, action: PayloadAction<"onboarding" | "main">) => {
      state.appState = action.payload;
    },
    resetOnboarding: (state) => {
      state.step = 1;
      state.appState = "onboarding";
      state.petName = "";
    },
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  setPetName,
  setAppState,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
