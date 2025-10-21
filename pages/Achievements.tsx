import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  CoinIcon,
  PlayTriangleIcon,
  ShareIcon,
  SkinsIcon,
  TeenMutant,
  TournamentIcon,
  UsersIcon,
  XIcon,
} from "../components/icons";
import { PageProps } from "../types";

const AchievementBadge: React.FC<{
  title: string;
  progress: number;
  icon: React.ReactNode;
  isCompleted: boolean;
  onClick: () => void;
}> = ({ title, progress, icon, isCompleted, onClick }) => (
  <button
    onClick={onClick}
    disabled={!isCompleted}
    className={`relative bg-surface p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-md ${
      isCompleted
        ? "border-2 border-primary cursor-pointer hover:bg-primary-light/50"
        : "cursor-default"
    }`}
  >
    <div
      className={`w-16 h-16 mb-2 flex items-center justify-center rounded-full ${
        isCompleted
          ? "bg-primary-light text-primary"
          : "bg-gray-200 text-text-disabled"
      }`}
    >
      {icon}
    </div>
    <p className="font-bold text-text-primary text-sm leading-tight">{title}</p>
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className="bg-primary h-2 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <p className="text-xs text-text-secondary mt-1">{progress}%</p>
    {isCompleted && (
      <div className="absolute top-1 right-1 bg-primary text-text-inverse text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        ✓
      </div>
    )}
  </button>
);

const ShareAchievementModal: React.FC<{
  achievement: any;
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm"
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 -mr-2 -mt-2 rounded-full hover:bg-gray-200"
          >
            <XIcon className="w-6 h-6 text-text-primary" />
          </button>
        </div>
        <h2 className="text-2xl font-extrabold text-primary mb-2">
          Achievement Unlocked!
        </h2>
        <p className="text-text-secondary mb-6">
          You've mastered: {achievement.title}
        </p>

        <div className="bg-background rounded-lg p-4 flex flex-col items-center justify-center h-32 mb-6">
          <div
            className={`w-16 h-16 flex items-center justify-center rounded-full bg-primary-light text-primary`}
          >
            {achievement.icon}
          </div>
        </div>

        <button
          onClick={() => {
            console.log("Sharing achievement:", achievement.title);
            onClose();
          }}
          className="w-full bg-primary hover:bg-primary-hover text-text-inverse font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <ShareIcon className="w-5 h-5" />
          <span>Share</span>
        </button>
      </motion.div>
    </div>
  );
};

const achievements = [
  {
    id: 1,
    title: "Play 10 Games",
    progress: 70,
    icon: <PlayTriangleIcon className="w-8 h-8" />,
    isCompleted: false,
  },
  {
    id: 2,
    title: "Reach Teen Stage",
    progress: 100,
    icon: <TeenMutant className="w-8 h-8" />,
    isCompleted: true,
  },
  {
    id: 3,
    title: "Spend 1000 Coins",
    progress: 45,
    icon: <CoinIcon className="w-8 h-8" />,
    isCompleted: false,
  },
  {
    id: 4,
    title: "Win a Tournament",
    progress: 0,
    icon: <TournamentIcon className="w-8 h-8" />,
    isCompleted: false,
  },
  {
    id: 5,
    title: "Own 5 Skins",
    progress: 100,
    icon: <SkinsIcon className="w-8 h-8" />,
    isCompleted: true,
  },
  {
    id: 6,
    title: "Refer 1 Friend",
    progress: 100,
    icon: <UsersIcon className="w-8 h-8" />,
    isCompleted: true,
  },
];

const Achievements: React.FC<PageProps> = ({ setActivePage, onBack }) => {
  const [achievementToShare, setAchievementToShare] = useState<any | null>(
    null
  );

  return (
    <div className="relative">
      {achievementToShare && (
        <ShareAchievementModal
          achievement={achievementToShare}
          onClose={() => setAchievementToShare(null)}
        />
      )}
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((ach) => (
          <AchievementBadge
            key={ach.id}
            {...ach}
            onClick={() => {
              if (ach.isCompleted) {
                setAchievementToShare(ach);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
