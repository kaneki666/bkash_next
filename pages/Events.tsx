
import React, { useState, useEffect } from 'react';
import { PageProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayTriangleIcon, UsersIcon, StarIcon, TimerIcon, InfoIcon } from '../components/icons';
import { PageInfoModal } from '../components/PlatformPages';

// Countdown hook
const useCountdown = (targetDate: number) => {
    const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(targetDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);
    
    if (timeLeft < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isFinished: false };
};

const EventBanner: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  backgroundImage: string;
  glowColor: string;
  onClick: () => void;
  countdown?: string;
}> = ({ title, description, icon, backgroundImage, glowColor, onClick, countdown }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full h-40 rounded-2xl overflow-hidden cursor-pointer border-2 border-white/20"
      style={{ boxShadow: `0 0 25px -5px ${glowColor}, 0 0 10px -5px ${glowColor}` }}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent p-4 flex flex-col justify-end">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{title}</h3>
            <p className="text-sm text-white/80" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{description}</p>
          </div>
        </div>
      </div>
      {countdown && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center space-x-1.5 z-10">
            <TimerIcon className="w-4 h-4" />
            <span>{countdown}</span>
        </div>
      )}
    </motion.div>
  );
};

export const Events: React.FC<PageProps> = ({ setActivePage, onBack }) => {
    const [showInfo, setShowInfo] = useState(false);
    const now = new Date().getTime();
    const teamChallengeEndDate = now + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000; // 3 days 5 hours
    const summerFestivalEndDate = now + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000; // 10 days 2 hours

    const teamChallengeTime = useCountdown(teamChallengeEndDate);
    const summerFestivalTime = useCountdown(summerFestivalEndDate);
    
    useEffect(() => {
        const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '{}');
        if (!visitedPages.events) {
          setShowInfo(true);
          visitedPages.events = true;
          localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
        }
    }, []);

    const formatCountdown = (time: ReturnType<typeof useCountdown>) => {
        if (time.isFinished) return "Event Over";
        if (time.days > 0) return `${time.days}d ${String(time.hours).padStart(2, '0')}h left`;
        if (time.hours > 0) return `${String(time.hours).padStart(2, '0')}h ${String(time.minutes).padStart(2, '0')}m left`;
        return `${String(time.minutes).padStart(2, '0')}m ${String(time.seconds).padStart(2, '0')}s left`;
    };

  return (
    <div className="p-4 text-text-primary h-full">
      <AnimatePresence>
        {showInfo && (
            <PageInfoModal title="Events Hub" onClose={() => setShowInfo(false)}>
                <p>Welcome to the Events Hub, the vibrant heart of the jungle! This is your gateway to dynamic, limited-time challenges offering rare rewards and exclusive experiences.</p>
                <p className="mt-2">From daily games with instant prizes to massive community crusades and festive seasonal celebrations, there's always a new adventure calling. Check back often—glory awaits!</p>
            </PageInfoModal>
        )}
      </AnimatePresence>
      <div className="flex justify-center items-center relative mb-6">
        <h1 className="text-3xl font-extrabold text-text-primary">Events</h1>
        <button onClick={() => setShowInfo(true)} aria-label="Page Information" className="absolute right-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
            <InfoIcon className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <div className="space-y-6">
        <EventBanner
          title="Flip & Match"
          description="A chance to win prizes every day!"
          icon={<PlayTriangleIcon className="w-7 h-7 text-white" />}
          backgroundImage="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2029,%202025,%2010_16_44%20AM.jpg?updatedAt=1756439779322"
          glowColor="rgba(239, 68, 68, 0.6)" // primary color glow
          onClick={() => setActivePage('dailySpinGame')}
        />
        <EventBanner
          title="Team Up Challenge"
          description="Work together to earn group rewards."
          icon={<UsersIcon className="w-7 h-7 text-white" />}
          backgroundImage="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2029,%202025,%2010_35_26%20AM.jpg?updatedAt=1756440377558"
          glowColor="rgba(59, 130, 246, 0.6)" // blue glow
          onClick={() => setActivePage('teamUpChallenge')}
          countdown={formatCountdown(teamChallengeTime)}
        />
        <EventBanner
          title="Summer Festival"
          description="Celebrate with special seasonal events!"
          icon={<StarIcon className="w-7 h-7 text-white" />}
          backgroundImage="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2029,%202025,%2010_47_12%20AM.jpg?updatedAt=1756441175043"
          glowColor="rgba(234, 179, 8, 0.6)" // yellow glow
          onClick={() => setActivePage('summerFestival')}
          countdown={formatCountdown(summerFestivalTime)}
        />
      </div>
    </div>
  );
};
