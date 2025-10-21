

import React, { useState, useEffect } from 'react';
import { PageProps, Notification } from '../types';
import { motion } from 'framer-motion';
import { MissionIcon, PlayTriangleIcon, TeenMutant, CoinIcon, TournamentIcon, SkinsIcon, UsersIcon, XIcon, ShareIcon, TimerIcon, LockIcon } from '../components/icons';
import { BackButton, InfoButton, PageInfoModal } from '../components/PlatformPages';

type MissionCategory = 'starter' | 'rookie' | 'conqueror' | 'legend';

interface Mission {
  id: number;
  title: string;
  reward: string;
  xp: number;
  progress: number;
  isCompleted: boolean;
  category: MissionCategory;
  locked?: boolean;
  timeLimit: number; // in seconds
}

const initialMissionsData: Mission[] = [
    // Starter
    { id: 1, title: "Top-up any amount", reward: "+50 XP & Happiness", xp: 50, progress: 0, isCompleted: false, category: 'starter', timeLimit: 86400 },
    { id: 10, title: "Pay an Internet Bill", reward: "+30 XP & Happiness", xp: 30, progress: 0, isCompleted: false, category: 'starter', timeLimit: 259200 },
    { id: 11, title: "Pay a Postpaid Mobile Bill", reward: "+40 XP & Happiness", xp: 40, progress: 0, isCompleted: false, category: 'starter', timeLimit: 259200 },
    { id: 2, title: "Play 1 Tournament", reward: "+25 XP & Happiness", xp: 25, progress: 0, isCompleted: false, category: 'starter', timeLimit: 86400 },
    { id: 3, title: "Visit the Shop", reward: "+10 XP & Happiness", xp: 10, progress: 0, isCompleted: false, category: 'starter', timeLimit: 259200 },

    // Rookie
    { id: 4, title: "Refer a friend", reward: "+200 XP, +100 Coins", xp: 200, progress: 50, isCompleted: false, category: 'rookie', timeLimit: 604800 },
    { id: 5, title: "Win a PvP Match", reward: "+100 XP, +50 Coins", xp: 100, progress: 0, isCompleted: false, category: 'rookie', timeLimit: 172800, locked: true },
    { id: 6, title: "Make a QR Payment of BDT 100", reward: "+75 XP", xp: 75, progress: 0, isCompleted: false, category: 'rookie', timeLimit: 604800 },

    // Conqueror
    { id: 7, title: "Reach Top 10 in a Leaderboard", reward: "+500 XP, +250 Coins", xp: 500, progress: 0, isCompleted: false, category: 'conqueror', timeLimit: 2592000, locked: true },
    { id: 8, title: "Own 5 Epic items", reward: "+300 XP", xp: 300, progress: 0, isCompleted: false, category: 'conqueror', timeLimit: 2592000, locked: true },
    
    // Legend
    { id: 9, title: "Win a Global Tournament", reward: "+1000 XP, +1000 Coins", xp: 1000, progress: 0, isCompleted: false, category: 'legend', timeLimit: 5184000, locked: true },
];

const useCountdown = (initialSeconds: number) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => {
            setSecondsLeft(s => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    const formatTime = (s: number) => {
        if (s <= 0) return "Expired";
        const d = Math.floor(s / (3600*24));
        s  -= d*3600*24;
        const h = Math.floor(s / 3600);
        s  -= h*3600;
        const m = Math.floor(s / 60);
        s  -= m*60;
        const ss = Math.floor(s);
        if (d > 0) return `${d}d ${String(h).padStart(2, '0')}h`;
        return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(ss).padStart(2, '0')}s`;
    };
    return formatTime(secondsLeft);
};

interface MissionCardProps {
    title: string;
    reward: string;
    progress: number;
    isCompleted: boolean;
    locked?: boolean;
    timeLimit: number;
    onComplete: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ title, reward, progress, isCompleted, locked, timeLimit, onComplete }) => {
    const timeLeft = useCountdown(timeLimit);

    if (locked) {
        return (
            <div className="bg-surface p-4 rounded-lg shadow-md opacity-60 cursor-not-allowed">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md flex-shrink-0">
                            <LockIcon className="w-5 h-5 text-text-disabled" />
                        </div>
                        <div>
                            <p className="font-bold text-text-disabled">{title}</p>
                            <p className="text-sm text-text-disabled">{reward}</p>
                        </div>
                    </div>
                    <button disabled className="bg-disabled-fill text-text-disabled font-bold px-4 py-1 rounded-md text-sm">
                        Locked
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-surface p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                    <MissionIcon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="font-bold text-text-primary">{title}</p>
                        <p className="text-sm text-primary">{reward}</p>
                    </div>
                </div>
                <button 
                    onClick={onComplete}
                    disabled={isCompleted}
                    className="bg-primary text-text-inverse font-bold px-4 py-1 rounded-md text-sm transition-colors disabled:bg-disabled-fill disabled:text-text-disabled disabled:cursor-not-allowed flex-shrink-0 ml-2"
                >
                    {isCompleted ? 'Claimed' : 'Go'}
                </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-end items-center mt-2">
                <div className="flex items-center text-xs text-text-secondary font-semibold bg-gray-100 px-2 py-0.5 rounded-md">
                    <TimerIcon className="w-3 h-3 mr-1" />
                    <span>{timeLeft}</span>
                </div>
            </div>
        </div>
    );
};

const AchievementBadge: React.FC<{ title: string; progress: number; icon: React.ReactNode; isCompleted: boolean; onClick: () => void; }> = ({ title, progress, icon, isCompleted, onClick }) => (
    <button 
        onClick={onClick}
        disabled={!isCompleted}
        className={`relative bg-surface p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-md ${isCompleted ? 'border-2 border-primary cursor-pointer hover:bg-primary-light/50' : 'cursor-default'}`}
    >
        <div className={`w-16 h-16 mb-2 flex items-center justify-center rounded-full ${isCompleted ? 'bg-primary-light text-primary' : 'bg-gray-200 text-text-disabled'}`}>
            {icon}
        </div>
        <p className="font-bold text-text-primary text-sm leading-tight">{title}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-text-secondary mt-1">{progress}%</p>
        {isCompleted && <div className="absolute top-1 right-1 bg-primary text-text-inverse text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">✓</div>}
    </button>
);

const FreePlayModal: React.FC<{ onPlay: () => void; onClose: () => void; }> = ({ onPlay, onClose }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm"
        >
            <img 
                src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2029,%202025,%2010_16_44%20AM.jpg?updatedAt=1756439779322" 
                alt="Flip & Match icon" 
                className="w-24 h-24 mx-auto mb-4 object-cover rounded-xl"
            />
            <h2 className="text-2xl font-extrabold text-primary mb-2">You've Earned a Free Play!</h2>
            <p className="text-text-secondary mb-6">Your mission streak has paid off. Time for a game!</p>
            <div className="flex space-x-4">
                <button 
                    onClick={onClose} 
                    className="w-1/2 bg-gray-200 hover:bg-gray-300 text-text-primary font-bold py-3 rounded-xl transition-colors"
                >
                    Later
                </button>
                <button 
                    onClick={onPlay} 
                    className="w-1/2 bg-primary hover:bg-primary-hover text-text-inverse font-bold py-3 rounded-xl transition-colors"
                >
                    Play
                </button>
            </div>
        </motion.div>
    </div>
);

const ShareAchievementModal: React.FC<{ achievement: any; onClose: () => void; }> = ({ achievement, onClose }) => {
    if (!achievement) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm"
            >
                <div className="flex justify-end">
                    <button onClick={onClose} className="p-1 -mr-2 -mt-2 rounded-full hover:bg-gray-200"><XIcon className="w-6 h-6 text-text-primary" /></button>
                </div>
                <h2 className="text-2xl font-extrabold text-primary mb-2">Achievement Unlocked!</h2>
                <p className="text-text-secondary mb-6">You've mastered: {achievement.title}</p>
                
                <div className="bg-background rounded-lg p-4 flex flex-col items-center justify-center h-32 mb-6">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-primary-light text-primary`}>
                        {achievement.icon}
                    </div>
                </div>
                
                <button 
                    onClick={() => {
                        console.log('Sharing achievement:', achievement.title);
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


interface QuestHubProps extends PageProps {
  onMissionComplete: () => void;
  activeTab: 'missions' | 'achievements';
  setActiveTab: (tab: 'missions' | 'achievements') => void;
  missionStreak: number;
  setMissionStreak: (updater: (prevStreak: number) => number) => void;
  setFreeSpins: (updater: (prevSpins: number) => number) => void;
  setHappiness: (updater: (prev: number) => number) => void;
  addNotification: (message: string, type: Notification['type'], link?: string) => void;
  forcedCategory?: MissionCategory;
  achievementsOnly?: boolean;
}

export const QuestHub: React.FC<QuestHubProps> = ({ onMissionComplete, setActivePage, onBack, activeTab, setActiveTab, missionStreak, setMissionStreak, setFreeSpins, setHappiness, addNotification, forcedCategory, achievementsOnly = false }) => {
  const [missions, setMissions] = useState(initialMissionsData);
  const [showInfo, setShowInfo] = useState(false);
  const [showFreePlayModal, setShowFreePlayModal] = useState(false);
  const [achievementToShare, setAchievementToShare] = useState<any | null>(null);
  const [activeQuestCategory, setActiveQuestCategory] = useState<MissionCategory>(forcedCategory || 'starter');

  const questCategories: MissionCategory[] = ['starter', 'rookie', 'conqueror', 'legend'];
  
  useEffect(() => {
    if (forcedCategory) return;
    const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '{}');
    if (!visitedPages.quest) {
      setShowInfo(true);
      visitedPages.quest = true;
      localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    }
  }, [forcedCategory]);

  useEffect(() => {
    return () => {
      if (!forcedCategory) {
        setActiveTab('missions');
      }
    };
  }, [setActiveTab, forcedCategory]);

  const handleCompleteMission = (missionId: number) => {
    const missionToComplete = missions.find(m => m.id === missionId);
    if (!missionToComplete || missionToComplete.isCompleted || missionToComplete.locked) return;
    
    addNotification(`Mission Complete: ${missionToComplete.title}`, 'mission', 'quest');

    setMissions(prevMissions => 
        prevMissions.map(m => 
            m.id === missionId ? { ...m, isCompleted: true, progress: 100 } : m
        )
    );
    
    onMissionComplete();
    setHappiness(h => Math.min(100, h + 15));

    setMissionStreak(prevStreak => {
        const newStreak = (prevStreak % 10) + 1;
        if (newStreak === 5 || newStreak === 10) {
            setShowFreePlayModal(true);
        }
        return newStreak;
    });
  };
  
  const achievements = [
      { id: 1, title: "Play 10 Games", progress: 70, icon: <PlayTriangleIcon className="w-8 h-8" />, isCompleted: false },
      { id: 2, title: "Reach Teen Stage", progress: 100, icon: <TeenMutant className="w-8 h-8" />, isCompleted: true },
      { id: 3, title: "Spend 1000 Coins", progress: 45, icon: <CoinIcon className="w-8 h-8" />, isCompleted: false },
      { id: 4, title: "Win a Tournament", progress: 0, icon: <TournamentIcon className="w-8 h-8" />, isCompleted: false },
      { id: 5, title: "Own 5 Skins", progress: 100, icon: <SkinsIcon className="w-8 h-8" />, isCompleted: true },
      { id: 6, title: "Refer 1 Friend", progress: 100, icon: <UsersIcon className="w-8 h-8" />, isCompleted: true },
  ];

  const filteredMissions = missions.filter(m => m.category === activeQuestCategory);

  const tabToRender = achievementsOnly ? 'achievements' : activeTab;

  return (
    <div className="p-4 text-text-primary relative">
        {showFreePlayModal && (
            <FreePlayModal 
                onPlay={() => {
                    setShowFreePlayModal(false);
                    setActivePage('dailySpinGame');
                }}
                onClose={() => setShowFreePlayModal(false)}
            />
        )}
        {achievementToShare && (
            <ShareAchievementModal achievement={achievementToShare} onClose={() => setAchievementToShare(null)} />
        )}
        {showInfo && (
            <PageInfoModal title={achievementsOnly ? "Achievements" : "Quest & Achievement Hub"} onClose={() => setShowInfo(false)}>
                {achievementsOnly ? (
                    <>
                        <p>This is your hall of legendary accomplishments. Each achievement represents a major milestone in your journey.</p>
                        <p className="mt-2">Completing these long-term goals will test your dedication and skill, rewarding you with exclusive badges to display on your Trophy Rack. Fulfill your destiny and collect them all!</p>
                    </>
                ) : (
                    <>
                        <p>This is your command center for action and glory! Here you'll find opportunities to prove your skills and earn amazing rewards.</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li><strong>Missions:</strong> Think of these as your daily and weekly challenges. They are the fastest way to earn XP to evolve your Pet, stock up on Coins for the shop, and build your Mission Streak for a free play in the daily <strong>Flip & Match</strong> game!</li>
                            <li><strong>Achievements:</strong> These are your legendary milestones. Completing them signifies true mastery and earns you prestigious badges for your Trophy Rack. Show them off with pride!</li>
                        </ul>
                    </>
                )}
            </PageInfoModal>
        )}
        {!forcedCategory && <InfoButton onClick={() => setShowInfo(true)} />}
        {!forcedCategory && <BackButton onClick={onBack!} variant="dark"/>}
        <h1 className="text-3xl font-extrabold text-center mb-6">{achievementsOnly ? 'Achievements' : 'Quest Hub'}</h1>
        
        {!achievementsOnly && (
          <div className="w-full bg-gray-200 rounded-xl p-1.5 flex mb-6">
              <button onClick={() => setActiveTab('missions')} className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'missions' ? 'bg-primary text-text-inverse' : 'text-text-secondary'}`}>Missions</button>
              <button onClick={() => setActiveTab('achievements')} className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'achievements' ? 'bg-primary text-text-inverse' : 'text-text-secondary'}`}>Achievements</button>
          </div>
        )}

        {tabToRender === 'missions' && (
            <div>
                <div className="bg-surface p-4 rounded-lg mb-6 border border-primary-light shadow-md">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-bold text-secondary-action">Mission Streak</h3>
                        <span className="font-bold text-secondary-action-dark bg-primary-light px-3 py-1 rounded-full text-sm">{missionStreak} / 10</span>
                    </div>
                    <div className="relative pt-6">
                        <div className="flex items-center space-x-1">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className={`h-3 flex-1 rounded-full transition-colors duration-300 ${i < missionStreak ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                        <div className="absolute top-0 text-center" style={{ left: '45%', transform: 'translateX(-50%)' }}>
                            <span role="img" aria-label="gift" className="text-lg">🎁</span>
                            <p className="text-xs text-text-secondary">5</p>
                        </div>
                        <div className="absolute top-0 text-center" style={{ left: '95%', transform: 'translateX(-50%)' }}>
                            <span role="img" aria-label="gift" className="text-lg">🎁</span>
                            <p className="text-xs text-text-secondary">10</p>
                        </div>
                    </div>
                    <p className="text-center text-sm text-text-secondary mt-4">Complete missions to earn free treasure spins!</p>
                </div>

                {!forcedCategory && (
                  <div className="w-full bg-gray-200 rounded-xl p-1 flex mb-6">
                      {questCategories.map(cat => (
                          <button
                              key={cat}
                              onClick={() => setActiveQuestCategory(cat)}
                              className={`w-1/4 py-2 text-sm rounded-lg font-semibold transition-colors ${activeQuestCategory === cat ? 'bg-primary text-text-inverse' : 'text-text-secondary'}`}
                          >
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                      ))}
                  </div>
                )}

                <div className="space-y-4">
                    {filteredMissions.length > 0 ? filteredMissions.map(mission => (
                        <MissionCard
                            key={mission.id}
                            title={mission.title}
                            reward={mission.reward}
                            progress={mission.progress}
                            isCompleted={mission.isCompleted}
                            locked={mission.locked}
                            timeLimit={mission.timeLimit}
                            onComplete={() => handleCompleteMission(mission.id)}
                        />
                    )) : (
                        <p className="text-center text-text-secondary py-8">No missions in this category right now. Check back later!</p>
                    )}
                </div>
            </div>
        )}

        {tabToRender === 'achievements' && (
            <div className="grid grid-cols-3 gap-3">
                {achievements.map(ach => (
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
        )}
    </div>
  );
};