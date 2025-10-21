
import React from 'react';
import { CoinIcon, MenuIcon, BellIcon } from './icons';

interface HeaderProps {
  coins: number;
  onAvatarClick: () => void;
  notificationCount: number;
  onNotificationsClick: () => void;
  onAddCoinsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ coins, onAvatarClick, notificationCount, onNotificationsClick, onAddCoinsClick }) => {
  return (
    <header className="absolute top-0 left-0 p-4 z-20 w-full">
      <div className="flex justify-between items-center">
        {/* Left side: Hamburger Menu */}
        <button 
          className="w-12 h-12 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-full border border-divider/50 shadow-md"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6 text-text-primary" />
        </button>
        
        {/* Right side: Notifications, Coins, Avatar */}
        <div className="flex items-center space-x-3">
            <button 
              onClick={onNotificationsClick}
              className="relative w-12 h-12 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-full border border-divider/50 shadow-md"
              aria-label="View notifications"
            >
              <BellIcon className="w-6 h-6 text-text-primary" />
               {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-surface">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Coins pill */}
            <div className="flex items-center space-x-2 bg-surface/80 backdrop-blur-sm rounded-full pl-3 pr-2 py-1.5 border border-divider/50 shadow-md h-12">
              <CoinIcon className="w-5 h-5 text-primary"/>
              <span className="font-bold text-text-primary text-md tracking-wide">{coins}</span>
              <button
                onClick={onAddCoinsClick}
                className="bg-primary hover:bg-primary-hover text-text-inverse w-5 h-5 rounded-full text-sm leading-5 font-bold transition"
                aria-label="Add coins"
              >
                +
              </button>
            </div>

            {/* Avatar */}
            <button
              onClick={onAvatarClick}
              className="w-12 h-12 bg-surface rounded-full p-1 border-2 border-primary flex-shrink-0 hover:scale-105 hover:opacity-90 transition-transform"
              aria-label="Open profile"
            >
              <img
                src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2005_01_45%20AM.png?updatedAt=1756161114127"
                alt="User Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;