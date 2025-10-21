
import React from 'react';
import { CoinIcon, CompassIcon } from './icons';

interface DailyRewardModalProps {
  onClaim: () => void;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClaim }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm shadow-2xl shadow-primary/20">
        <h2 className="text-3xl font-extrabold text-primary">Daily Reward!</h2>
        <p className="text-text-secondary mt-2 mb-6">Welcome! Here's your login bonus for Day 1.</p>
        
        <div className="space-y-4 my-6">
          <div className="bg-background rounded-lg p-4 flex justify-between items-center">
            <span className="font-bold text-lg">Coins</span>
            <div className="flex items-center space-x-2">
              <CoinIcon className="w-6 h-6 text-primary" />
              <span className="font-bold text-primary text-lg">+500</span>
            </div>
          </div>
          <div className="bg-background rounded-lg p-4 flex justify-between items-center">
            <span className="font-bold text-lg">XP</span>
            <div className="flex items-center space-x-2">
              <CompassIcon className="w-6 h-6 text-text-primary" />
              <span className="font-bold text-primary text-lg">+100</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClaim}
          className="w-full bg-primary text-text-inverse font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:bg-primary-hover transform hover:scale-105 transition-all duration-300"
        >
          Claim
        </button>
      </div>
    </div>
  );
};

export default DailyRewardModal;
