import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { BackButton } from "../components/PlatformPages";
import {
  BellIcon,
  CheckIcon,
  CoinIcon,
  EventsIcon,
  InfoIcon,
  MissionIcon,
  TrophyIcon,
} from "../components/icons";
import { Notification } from "../types";

// A helper to format time ago
const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const NotificationIcon: React.FC<{ type: Notification["type"] }> = ({
  type,
}) => {
  const iconClass = "w-6 h-6";
  switch (type) {
    case "milestone":
      return <TrophyIcon className={`${iconClass} text-yellow-500`} />;
    case "mission":
      return <MissionIcon className={`${iconClass} text-primary`} />;
    case "event":
      return <EventsIcon className={`${iconClass} text-purple-500`} />;
    case "reward":
      return <CoinIcon className={`${iconClass} text-green-500`} />;
    case "system":
    default:
      return <InfoIcon className={`${iconClass} text-blue-500`} />;
  }
};

interface NotificationsPageProps {
  notifications: Notification[];
  onBack: () => void;
  onNavigate: (notification: Notification) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications = [],
  onBack,
  onNavigate,
  onMarkAllRead,
  onClearAll,
}) => {
  return (
    <div className="h-full flex flex-col bg-background pt-20">
      <header className="p-4 flex items-center border-b border-divider flex-shrink-0 relative h-[68px]">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-bold text-text-primary text-center w-full">
          Notifications
        </h1>
      </header>

      <div className="flex-grow overflow-y-auto p-2 space-y-2">
        {notifications.length > 0 ? (
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                onClick={() => onNavigate(n)}
                className={`p-3 rounded-lg flex items-start space-x-3 cursor-pointer transition-colors ${
                  n.isRead
                    ? "bg-background hover:bg-gray-200"
                    : "bg-primary-light hover:bg-secondary-hover"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <NotificationIcon type={n.type} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-text-primary leading-snug">
                    {n.message}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {timeAgo(n.timestamp)}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text-secondary p-8 text-center">
            <BellIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="font-semibold">All caught up!</p>
            <p className="text-sm">You have no new notifications.</p>
          </div>
        )}
      </div>

      {notifications && notifications?.length > 0 && (
        <footer className="p-3 border-t border-divider flex-shrink-0 flex items-center justify-between space-x-2">
          <button
            onClick={onMarkAllRead}
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <CheckIcon className="w-4 h-4" />
            Mark all as read
          </button>
          <button
            onClick={onClearAll}
            className="text-sm font-semibold text-text-secondary hover:text-error hover:underline"
          >
            Clear all
          </button>
        </footer>
      )}
    </div>
  );
};

export default NotificationsPage;
