import React from 'react';
import { TournamentIcon, AvatarIcon, ShopIcon, EventsIcon, LeaderboardIcon } from './icons';

interface BottomNavProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
        {isActive && <div className="absolute top-0 h-1 w-8 rounded-b-full bg-primary"></div>}
    </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
    return (
        <nav className="w-full bg-surface/70 backdrop-blur-sm border-t border-divider z-10 h-16">
            <div className="flex justify-around items-center h-full">
                <NavItem 
                    label="Championship"
                    icon={<TournamentIcon className="w-7 h-7" />}
                    isActive={activePage === 'championship'}
                    onClick={() => setActivePage('championship')}
                />
                <NavItem 
                    label="Events"
                    icon={<EventsIcon className="w-7 h-7" />}
                    isActive={activePage === 'events'}
                    onClick={() => setActivePage('events')}
                />
                <NavItem 
                    label="Rankings"
                    icon={<LeaderboardIcon className="w-7 h-7" />}
                    isActive={activePage === 'halloffame'}
                    onClick={() => setActivePage('halloffame')}
                />
                <NavItem 
                    label="My Pet"
                    icon={<AvatarIcon className="w-7 h-7" />}
                    isActive={activePage === 'avatar'}
                    onClick={() => setActivePage('avatar')}
                />
                <NavItem 
                    label="Shop"
                    icon={<ShopIcon className="w-7 h-7" />}
                    isActive={activePage === 'shop'}
                    onClick={() => setActivePage('shop')}
                />
            </div>
        </nav>
    );
};

export default BottomNav;