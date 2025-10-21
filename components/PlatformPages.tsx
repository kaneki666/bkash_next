
import React from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { LeftArrowIcon, InfoIcon, XIcon, CoinIcon, XPIcon } from './icons';
import { MilestoneData } from '../types';

export const BackButton: React.FC<{ onClick: () => void; variant?: 'light' | 'dark' }> = ({ onClick, variant = 'dark' }) => (
    <button onClick={onClick} className={`absolute top-1/2 -translate-y-1/2 left-4 z-30 p-2 -ml-2 rounded-full ${variant === 'dark' ? 'hover:bg-black/10' : 'hover:bg-white/10'}`} aria-label="Back">
        <LeftArrowIcon className={`w-6 h-6 ${variant === 'dark' ? 'text-text-primary' : 'text-text-inverse'}`} />
    </button>
);

export const InfoButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors" aria-label="Page Information">
        <InfoIcon className="w-6 h-6 text-text-inverse" />
    </button>
);

export const PageInfoModal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border-2 border-primary rounded-2xl p-6 text-text-primary w-4/5 max-w-sm"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-extrabold text-primary">{title}</h2>
                <button onClick={onClose} className="p-1 -mr-2 rounded-full hover:bg-gray-200"><XIcon className="w-6 h-6 text-text-primary" /></button>
            </div>
            <div className="text-text-secondary text-left space-y-3 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                {children}
            </div>
            <button onClick={onClose} className="w-full mt-6 bg-primary hover:bg-primary-hover text-text-inverse font-bold py-3 rounded-xl transition-colors">
                Got It!
            </button>
        </motion.div>
    </div>
);


// --- Milestone Reward Modal ---
export const MilestoneRewardModal: React.FC<{ milestone: MilestoneData | null; onClaim: () => void; }> = ({ milestone, onClaim }) => {
    if (!milestone) return null;
    
    const { name, reward } = milestone;
    const hasReward = reward.coins || reward.xp || reward.freeSpins;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <motion.div initial={{scale: 0.7, opacity: 0}} animate={{scale: 1, opacity: 1}} className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm">
                <h2 className="text-3xl font-extrabold text-primary">Milestone Reached!</h2>
                <p className="text-text-secondary mt-2 mb-6">You've unlocked: {name}</p>
                
                {hasReward && (
                    <div className="space-y-4 my-6">
                        {reward.coins && (
                             <div className="bg-background rounded-lg p-4 flex justify-between items-center">
                                <span className="font-bold text-lg text-text-primary">Coins</span>
                                <div className="flex items-center space-x-2">
                                  <CoinIcon className="w-6 h-6 text-primary" />
                                  <span className="font-bold text-primary text-lg">+{reward.coins}</span>
                                </div>
                            </div>
                        )}
                        {reward.xp && (
                             <div className="bg-background rounded-lg p-4 flex justify-between items-center">
                                <span className="font-bold text-lg text-text-primary">XP</span>
                                <div className="flex items-center space-x-2">
                                  <XPIcon className="w-6 h-6 text-warning" />
                                  <span className="font-bold text-primary text-lg">+{reward.xp}</span>
                                </div>
                            </div>
                        )}
                        {reward.freeSpins && (
                             <div className="bg-background rounded-lg p-4 flex justify-between items-center">
                                <span className="font-bold text-lg text-text-primary">Free Spin</span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-primary text-lg">+{reward.freeSpins}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <button
                    onClick={onClaim}
                    className="w-full bg-primary text-text-inverse font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:bg-primary-hover transform hover:scale-105 transition-all duration-300"
                >
                    Claim
                </button>
            </motion.div>
        </div>
    );
};
