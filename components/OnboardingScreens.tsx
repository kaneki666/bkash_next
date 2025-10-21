import React, { useEffect, useState } from "react";
import {
  AvatarCreationProps,
  FinishScreenProps,
  OnboardingScreenProps,
} from "../types";
import {
  DataIcon,
  EventsIcon,
  LeaderboardIcon,
  MapIcon,
  MissionIcon,
  ShareIcon,
  TopUpIcon,
  VoucherIcon,
} from "./icons";

// A reusable button for the onboarding flow
const OnboardingButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-primary text-text-inverse font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:bg-primary-hover transform hover:scale-105 transition-all duration-300 ease-in-out ${className} disabled:bg-disabled-fill disabled:text-text-disabled disabled:cursor-not-allowed disabled:hover:scale-100`}
  >
    {children}
  </button>
);

// --- Screen 1: Welcome ---
export const WelcomeScreen: React.FC<OnboardingScreenProps> = ({ onNext }) => (
  <div className="flex flex-col h-full text-center text-text-primary justify-between">
    <div className="flex-grow flex flex-col items-center justify-center">
      <img
        src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2028,%202025,%2011_25_18%20PM.jpg?updatedAt=1756402899941"
        alt="Welcome Banner"
        className="w-full max-w-sm mx-auto mb-8"
      />
      <h1 className="text-4xl font-extrabold mb-2">Welcome to </h1>
      <h2 className="text-5xl font-extrabold text-primary mb-4">
        The Jungle Journey!
      </h2>
      <p className="text-text-secondary max-w-xs">Play, Progress, and Earn.</p>
    </div>
    <OnboardingButton onClick={onNext}>Start Your Journey</OnboardingButton>
  </div>
);

// --- Screen 2: Avatar Creation ---
export const AvatarCreationScreen: React.FC<AvatarCreationProps> = ({
  onNext,
  petName,
  setPetName,
}) => {
  const defaultAvatar =
    "https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_58_36%20PM.png?updatedAt=1756276273569";

  return (
    <div className="flex flex-col h-full text-center text-text-primary justify-between">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">
          Name Your Pet
        </h1>
        <img
          src={defaultAvatar}
          alt="Your Pet Avatar"
          className="w-48 h-48 mb-6 drop-shadow-2xl object-contain rounded-full"
        />
        <p className="text-text-secondary mb-6 max-w-xs">
          This is your pet. Give it a unique name to start your journey!
        </p>
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Enter a name..."
          className="w-full bg-gray-200 text-text-primary text-center text-xl p-3 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          autoFocus
        />
      </div>
      <OnboardingButton onClick={onNext} disabled={!petName.trim()}>
        Continue
      </OnboardingButton>
    </div>
  );
};

// --- Screen 3: Currencies ---
export const CurrenciesScreen: React.FC<OnboardingScreenProps> = ({
  onNext,
}) => (
  <div className="flex flex-col h-full text-center text-text-primary justify-between">
    <div className="flex-grow flex flex-col items-center justify-center space-y-10">
      <div className="animate-fade-in">
        <img
          src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2011_29_46%20AM.png?updatedAt=1756276270908"
          alt="Coins Icon"
          className="w-24 h-24 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold">Coins</h2>
        <p className="text-text-secondary max-w-xs mt-1">
          Use Coins to enter tournaments, buy spins, and redeem shop items.
        </p>
      </div>
      <div className="animate-fade-in animation-delay-500">
        <img
          src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2002_12_07%20AM.png?updatedAt=1756150949447"
          alt="XP Icon"
          className="w-24 h-24 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold">XP</h2>
        <p className="text-text-secondary max-w-xs mt-1">
          Earn XP from missions to grow your avatar and unlock rewards.
        </p>
      </div>
    </div>
    <OnboardingButton onClick={onNext}>Got It!</OnboardingButton>
  </div>
);

// --- Screen 4: Journey Hub ---
const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  delay?: string;
}> = ({ icon, title, delay = "0ms" }) => (
  <div className="bg-surface rounded-lg p-4 flex items-center space-x-4 animate-fade-in shadow-md">
    <div className="text-primary">{icon}</div>
    <span className="font-semibold text-lg text-text-primary">{title}</span>
  </div>
);

export const DailyActionsScreen: React.FC<OnboardingScreenProps> = ({
  onNext,
}) => (
  <div className="flex flex-col h-full text-text-primary justify-between">
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-8">Your Journey Hub</h1>
      <div className="w-full space-y-4">
        <ActionCard
          icon={<MapIcon className="w-10 h-10" />}
          title="Explore Champion Levels"
          delay="100ms"
        />
        <ActionCard
          icon={<MissionIcon className="w-10 h-10" />}
          title="Complete Quests"
          delay="300ms"
        />
        <ActionCard
          icon={<EventsIcon className="w-10 h-10" />}
          title="Join Limited-Time Events"
          delay="500ms"
        />
      </div>
      <p className="mt-8 text-text-secondary">
        Travel through different islands, complete unique quests, and
        participate in special events to earn rewards.
      </p>
    </div>
    <OnboardingButton onClick={onNext}>Next</OnboardingButton>
  </div>
);

// --- Screen 5: Progression ---
export const ProgressionScreen: React.FC<OnboardingScreenProps> = ({
  onNext,
}) => {
  const [isExplorer, setIsExplorer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExplorer(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full text-center text-text-primary justify-between">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Evolve & Explore</h1>
        <p className="text-text-secondary max-w-xs mb-8">
          As you earn XP, your Pet evolves, unlocking new Champion Levels and
          islands to explore!
        </p>

        <div className="relative w-48 h-48 mb-6">
          <div
            className={`transition-opacity duration-1000 ${
              isExplorer ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_58_36%20PM.png?updatedAt=1756276273569"
              alt="Nomad Pet"
              className="w-48 h-48 absolute inset-0 object-contain"
            />
          </div>
          <div
            className={`transition-opacity duration-1000 ${
              isExplorer ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2002_29_44%20PM.png?updatedAt=1756314701116"
              alt="Explorer Pet"
              className="w-48 h-48 absolute inset-0 object-contain"
            />
          </div>
        </div>
        <div className="relative">
          <h2 className="text-2xl font-bold text-primary transition-opacity duration-500">
            Watch your Pet progress!
          </h2>
          <div
            className={`absolute -right-10 top-1/2 -translate-y-1/2 transition-all duration-1000 delay-500 ${
              isExplorer ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <MapIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>
      <OnboardingButton onClick={onNext}>Awesome!</OnboardingButton>
    </div>
  );
};

// --- Screen 6: Social & Community ---
export const SocialScreen: React.FC<OnboardingScreenProps> = ({ onNext }) => (
  <div className="flex flex-col h-full text-text-primary justify-between">
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-8">Compete & Connect</h1>
      <div className="w-full space-y-4">
        <ActionCard
          icon={<LeaderboardIcon className="w-10 h-10" />}
          title="Climb the Leaderboards"
          delay="100ms"
        />
        <ActionCard
          icon={<ShareIcon className="w-10 h-10" />}
          title="Share Your Achievements"
          delay="300ms"
        />
      </div>
      <p className="mt-8 text-text-secondary">
        Compete on a global stage and share your greatest achievements with
        friends.
      </p>
    </div>
    <OnboardingButton onClick={onNext}>Next</OnboardingButton>
  </div>
);

// --- Screen 7: Shop Preview ---
export const ShopPreviewScreen: React.FC<OnboardingScreenProps> = ({
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState("skins");
  return (
    <div className="flex flex-col h-full text-text-primary justify-between">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-6">The Canopy Market</h1>
        <p className="text-text-secondary max-w-xs mb-8">
          Redeem your Coins for cool gear or real rewards.
        </p>
        <div className="w-full bg-gray-200 rounded-xl p-1.5 flex mb-4">
          <button
            onClick={() => setActiveTab("skins")}
            className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "skins" ? "bg-primary text-text-inverse" : ""
            }`}
          >
            Pet Gear
          </button>
          <button
            onClick={() => setActiveTab("telco")}
            className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "telco" ? "bg-primary text-text-inverse" : ""
            }`}
          >
            Telco Benefits
          </button>
        </div>
        <div className="w-full h-40 bg-surface shadow-inner rounded-lg flex items-center justify-center p-2">
          {activeTab === "skins" ? (
            <div className="flex items-center justify-center gap-2">
              <img
                src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_09_30%20AM.png?updatedAt=1756157985240"
                alt="Elderwood Crown"
                className="h-32 w-auto object-contain drop-shadow-lg"
              />
              <img
                src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2003_48_03%20AM.png?updatedAt=1756156692520"
                alt="Sunstone Paw Guards"
                className="h-24 w-auto object-contain drop-shadow-lg"
              />
              <img
                src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2003_07_22%20AM.png?updatedAt=1756154279504"
                alt="Sunflare Amulet"
                className="h-28 w-auto object-contain drop-shadow-lg"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <DataIcon className="w-16 h-16 text-primary drop-shadow-lg" />
              <VoucherIcon className="w-20 h-20 text-primary drop-shadow-lg" />
              <TopUpIcon className="w-16 h-16 text-primary drop-shadow-lg" />
            </div>
          )}
        </div>
      </div>
      <OnboardingButton onClick={onNext}>Let's Go!</OnboardingButton>
    </div>
  );
};

// --- Screen 8: Finish ---
export const FinishScreen: React.FC<FinishScreenProps> = ({
  onClaim,
  onRestart,
  petName,
}) => (
  <div className="flex flex-col h-full text-center text-text-primary justify-between">
    <div className="flex-grow flex flex-col items-center justify-center">
      <img
        src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_58_36%20PM.png?updatedAt=1756276273569"
        alt="Your Pet"
        className="w-48 h-48 object-contain mb-6"
      />
      <h1 className="text-4xl font-extrabold text-primary mb-2">
        You're all set, {petName || "Pet"}!
      </h1>
      <p className="text-text-secondary text-lg">
        Your first reward is waiting.
      </p>
    </div>
    <div className="space-y-3">
      <OnboardingButton onClick={onClaim}>
        Claim Your First Daily Reward
      </OnboardingButton>
      <button
        onClick={onRestart}
        className="text-text-secondary text-sm hover:text-text-primary"
      >
        Restart Tutorial
      </button>
    </div>
  </div>
);
