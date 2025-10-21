"use client";
import { ChevronLeft } from "lucide-react";
import React, { useCallback } from "react";
import MainPlatform from "./components/MainPlatform";
import {
  AvatarCreationScreen,
  CurrenciesScreen,
  DailyActionsScreen,
  FinishScreen,
  ProgressionScreen,
  ShopPreviewScreen,
  SocialScreen,
  WelcomeScreen,
} from "./components/OnboardingScreens";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  nextStep,
  prevStep,
  resetOnboarding,
  setAppState,
  setPetName,
  setStep,
} from "./redux/slices/onboardingSlice";

const TOTAL_STEPS = 8;

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { step, appState, petName, selectedAvatar } = useAppSelector(
    (state) => state.onboarding
  );

  const restartOnboarding = useCallback(() => {
    dispatch(resetOnboarding());
  }, [dispatch]);

  const completeOnboarding = useCallback(() => {
    if (petName.trim() === "") {
      dispatch(setPetName("Kai"));
    }
    dispatch(setAppState("main"));
  }, [dispatch, petName]);

  const renderOnboardingStep = () => {
    switch (step) {
      case 1:
        return <WelcomeScreen onNext={() => dispatch(nextStep())} />;
      case 2:
        return (
          <AvatarCreationScreen
            onNext={() => dispatch(nextStep())}
            petName={petName}
            setPetName={(name) => dispatch(setPetName(name))}
          />
        );
      case 3:
        return <CurrenciesScreen onNext={() => dispatch(nextStep())} />;
      case 4:
        return <DailyActionsScreen onNext={() => dispatch(nextStep())} />;
      case 5:
        return <ProgressionScreen onNext={() => dispatch(nextStep())} />;
      case 6:
        return <SocialScreen onNext={() => dispatch(nextStep())} />;
      case 7:
        return <ShopPreviewScreen onNext={() => dispatch(nextStep())} />;
      case 8:
        return (
          <FinishScreen
            onClaim={completeOnboarding}
            onRestart={restartOnboarding}
            petName={petName}
          />
        );
      default:
        return <WelcomeScreen onNext={() => dispatch(nextStep())} />;
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {appState === "main" ? (
        <MainPlatform petName={petName} selectedAvatar={selectedAvatar} />
      ) : (
        <>
          {/* Progress Bar */}
          <div className="w-full bg-gray-300 h-2.5">
            <div
              className="bg-primary h-2.5 transition-all duration-500 ease-out"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
                minWidth: "6px", // ensures a visible rounded edge at very small values
                borderTopRightRadius: "9999px",
                borderBottomRightRadius: "9999px",
              }}
            />
          </div>

          <div className="flex-grow p-6 flex flex-col">
            {renderOnboardingStep()}
          </div>

          {step > 1 && (
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => dispatch(prevStep())}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm font-semibold flex items-center"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
          )}

          {step < TOTAL_STEPS && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => dispatch(setStep(TOTAL_STEPS))}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm font-semibold"
              >
                Skip
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
