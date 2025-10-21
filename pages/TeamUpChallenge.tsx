
import React, { useState, useEffect } from 'react';
import { PageProps } from '../types';
import { BackButton, PageInfoModal } from '../components/PlatformPages';
import { UsersIcon, CheckIcon, InfoIcon } from '../components/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface Mission {
    id: number;
    title: string;
    description: string;
    currentProgress: number;
    target: number;
    reward: string;
    participants: number;
    isJoined: boolean;
}

const missions: Mission[] = [
    { id: 1, title: 'Community Payment Spree', description: 'Make 10,000 QR payments as a community.', currentProgress: 7854, target: 10000, reward: '+500 Coins for all participants', participants: 1245, isJoined: true },
    { id: 2, title: 'Top-Up Titans', description: 'Cumulatively top-up BDT 50,000 as a community.', currentProgress: 23150, target: 50000, reward: '+1 Free Treasure Spin', participants: 876, isJoined: false },
    { id: 3, title: 'Friend Fiesta', description: 'Refer 500 new users together.', currentProgress: 450, target: 500, reward: 'Exclusive "Socialite" Badge', participants: 350, isJoined: false },
];

const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => {
    const progressPercent = Math.min((mission.currentProgress / mission.target) * 100, 100);
    const isCompleted = progressPercent >= 100;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-lg p-4 shadow-md border border-divider"
        >
            <h3 className="text-lg font-bold text-primary">{mission.title}</h3>
            <p className="text-sm text-text-secondary mt-1 mb-3">{mission.description}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-4 relative">
                <div className="bg-primary h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
                <span className="absolute inset-0 text-center text-xs font-bold text-white flex items-center justify-center">{Math.round(progressPercent)}%</span>
            </div>
            <p className="text-xs text-right text-text-secondary mt-1">{mission.currentProgress.toLocaleString()} / {mission.target.toLocaleString()}</p>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-center bg-primary-light p-2 rounded-lg">
                    <p className="text-xs font-bold text-secondary-action-dark">REWARD</p>
                    <p className="text-sm font-semibold text-primary">{mission.reward}</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-xl">{mission.participants.toLocaleString()}</p>
                    <p className="text-xs text-text-secondary">Participants</p>
                </div>
            </div>

            <button
                disabled={mission.isJoined || isCompleted}
                className="w-full mt-4 bg-primary text-text-inverse font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 disabled:bg-success disabled:cursor-not-allowed"
            >
                {isCompleted ? <><CheckIcon className="w-5 h-5" /><span>Completed</span></> : 
                 mission.isJoined ? <><UsersIcon className="w-5 h-5" /><span>Joined</span></> : <span>Join Challenge</span>}
            </button>
        </motion.div>
    );
};


export const TeamUpChallenge: React.FC<PageProps> = ({ onBack }) => {
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '{}');
        if (!visitedPages.teamUpChallenge) {
          setShowInfo(true);
          visitedPages.teamUpChallenge = true;
          localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
        }
    }, []);

    return (
        <div className="p-4 text-text-primary h-full flex flex-col">
             <AnimatePresence>
                {showInfo && (
                    <PageInfoModal title="Team Up Challenge" onClose={() => setShowInfo(false)}>
                        <p>Strength in numbers! The Team Up Challenge calls for all champions to unite against colossal goals that no single hero could conquer alone.</p>
                        <p className="mt-2">Every action you take contributes to a shared community objective. If the goal is met before time expires, *every* participant reaps the glorious rewards. Join the collective and let's achieve victory, together!</p>
                    </PageInfoModal>
                )}
            </AnimatePresence>
            <div className="relative flex items-center justify-center flex-shrink-0 mb-4">
                <BackButton onClick={onBack!} />
                <h1 className="text-3xl font-extrabold text-center px-10">Team Up Challenge</h1>
                 <button onClick={() => setShowInfo(true)} aria-label="Page Information" className="absolute right-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <InfoIcon className="w-5 h-5 text-text-secondary" />
                </button>
            </div>
            <p className="text-center text-text-secondary mb-6">Join forces with the community to complete missions and earn exclusive rewards together!</p>
            <div className="space-y-4 overflow-y-auto no-scrollbar flex-grow pr-2">
                {missions.map(mission => <MissionCard key={mission.id} mission={mission} />)}
            </div>
        </div>
    );
};
