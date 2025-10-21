

import React from 'react';
import { PageProps } from '../types';
import { LeftArrowIcon, TournamentIcon, MissionIcon, CoinIcon, SkinsIcon, XPIcon, PodiumIcon } from '../components/icons';
import { ActivityItem } from './Profile';

export const ActivityLogPage: React.FC<PageProps> = ({ setActivePage, onBack }) => {
    const fullActivityLog = [
        { icon: <TournamentIcon className="w-6 h-6 text-warning"/>, text: "Won 8,000 Coins in Jungle Race", time: "2 hours ago" },
        { icon: <MissionIcon className="w-6 h-6 text-primary"/>, text: "Completed 'Play 1 Tournament' Mission", time: "2 hours ago" },
        { icon: <CoinIcon className="w-6 h-6 text-warning-dark" />, text: "Spent 100 Coins to enter Jungle Race", time: "3 hours ago" },
        { icon: <SkinsIcon className="w-6 h-6 text-error"/>, text: "Purchased 'Cyber Visor' skin", time: "1 day ago" },
        { icon: <XPIcon className="w-6 h-6 text-warning"/>, text: "Earned 100 XP from Daily Login", time: "1 day ago" },
        { icon: <CoinIcon className="w-6 h-6 text-primary"/>, text: "Earned 500 Coins from Daily Login", time: "1 day ago" },
        { icon: <MissionIcon className="w-6 h-6 text-primary"/>, text: "Completed 'Top-up any amount'", time: "2 days ago" },
        { icon: <PodiumIcon className="w-6 h-6 text-text-secondary"/>, text: "Placed #24 in Vine Puzzle", time: "2 days ago" },
    ];

    return (
        <div className="p-4 text-text-primary relative h-full flex flex-col">
            <button onClick={onBack} className="absolute top-4 left-4 z-10 p-2 -ml-2 rounded-full hover:bg-gray-200" aria-label="Back to profile">
                <LeftArrowIcon className="w-6 h-6 text-text-primary" />
            </button>
            <h1 className="text-3xl font-extrabold text-center mb-6">Activity Log</h1>
            <div className="space-y-3 flex-grow overflow-y-auto no-scrollbar pr-2">
                 {fullActivityLog.map((activity, index) => <ActivityItem key={index} {...activity} />)}
            </div>
        </div>
    );
};