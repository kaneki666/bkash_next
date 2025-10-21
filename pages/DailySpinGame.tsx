import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BackButton } from "../components/PlatformPages";
import { CoinIcon } from "../components/icons";
import { PageProps } from "../types";

interface DailySpinGameProps extends PageProps {
  setCoins: (updater: (prevCoins: number) => number) => void;
}

const RewardModal: React.FC<{
  score: number;
  reward: number;
  onClaim: () => void;
}> = ({ score, reward, onClaim }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-full max-w-sm shadow-2xl shadow-primary/30"
      >
        <h2 className="text-3xl font-extrabold text-primary">Reward!</h2>
        <p className="text-lg text-text-secondary my-4">Your score:</p>
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.3,
            },
          }}
          className="text-6xl font-bold text-text-primary mb-6"
        >
          {score.toLocaleString()}
        </motion.p>
        <div className="bg-background rounded-lg p-4 flex justify-between items-center mb-8">
          <span className="font-bold text-lg">Reward Received</span>
          <div className="flex items-center space-x-2">
            <CoinIcon className="w-6 h-6" />
            <span className="font-bold text-primary text-lg">+{reward}</span>
          </div>
        </div>
        <button
          onClick={onClaim}
          className="w-full bg-primary text-text-inverse font-bold py-3 rounded-xl text-lg transform hover:scale-105 transition-transform"
        >
          Claim & Close
        </button>
      </motion.div>
    </div>
  );
};

const DailySpinGame: React.FC<DailySpinGameProps> = ({ setCoins, onBack }) => {
  const [showRewardModal, setShowRewardModal] = useState(false);

  const score = 5000;
  const reward = 150;

  const handleGameClick = () => {
    setShowRewardModal(true);
  };

  const handleClaim = () => {
    setCoins((prev) => prev + reward);
    if (onBack) {
      onBack();
    }
  };

  return (
    <div
      className="relative h-full w-full bg-cover bg-center cursor-pointer"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2010_45_57%20AM%20(1).png?updatedAt=1756268262166')",
      }}
      onClick={!showRewardModal ? handleGameClick : undefined}
      role="button"
      aria-label="Click to get your reward"
    >
      {!showRewardModal && onBack && (
        <BackButton onClick={onBack} variant="light" />
      )}

      <AnimatePresence>
        {showRewardModal && (
          <RewardModal score={score} reward={reward} onClaim={handleClaim} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailySpinGame;
