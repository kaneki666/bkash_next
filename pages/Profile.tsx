import React, { useEffect, useState } from "react";
import {
  BackButton,
  InfoButton,
  PageInfoModal,
} from "../components/PlatformPages";
import {
  MissionIcon,
  SkinsIcon,
  TeenMutant,
  TournamentIcon,
  UsersIcon,
} from "../components/icons";
import { PageProps } from "../types";

interface ProfileProps extends PageProps {
  petName: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  onViewAllAchievements: () => void;
  onViewAllActivity: () => void;
  onInvite: () => void;
}

export const ActivityItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  time: string;
}> = ({ icon, text, time }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-text-primary text-sm leading-tight">
        {text}
      </p>
      <p className="text-xs text-text-secondary">{time}</p>
    </div>
  </div>
);

const Profile: React.FC<ProfileProps> = ({
  petName,
  avatar,
  level,
  xp,
  coins,
  setActivePage,
  onBack,
  onViewAllAchievements,
  onViewAllActivity,
  onInvite,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const visitedPages = JSON.parse(
      localStorage.getItem("visitedPages") || "{}"
    );
    if (!visitedPages.profile) {
      setShowInfo(true);
      visitedPages.profile = true;
      localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
    }
  }, []);

  const earnedBadges = [
    {
      id: 2,
      title: "Reach Teen Stage",
      icon: <TeenMutant className="w-8 h-8" />,
    },
    { id: 5, title: "Own 5 Skins", icon: <SkinsIcon className="w-8 h-8" /> },
    { id: 6, title: "Refer 1 Friend", icon: <UsersIcon className="w-8 h-8" /> },
  ];

  const recentActivity = [
    {
      icon: <TournamentIcon className="w-6 h-6 text-warning" />,
      text: "Won 8,000 Coins in Jungle Race",
      time: "2 hours ago",
    },
    {
      icon: <MissionIcon className="w-6 h-6 text-primary" />,
      text: "Completed 'Play 1 Tournament' Mission",
      time: "2 hours ago",
    },
    {
      icon: <SkinsIcon className="w-6 h-6 text-error" />,
      text: "Purchased 'Sunflare Amulet'",
      time: "1 day ago",
    },
  ];

  return (
    <div className="p-4 text-text-primary relative">
      {showInfo && (
        <PageInfoModal
          title="Player Profile"
          onClose={() => setShowInfo(false)}
        >
          <p>
            This is your legend's ledger, a testament to your journey and
            accomplishments.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Trophy Rack:</strong> More than just rewards, these are
              symbols of your mastery. Display the prestigious badges earned
              from completing your greatest Achievements.
            </li>
            <li>
              <strong>Activity Log:</strong> A chronicle of your adventures,
              from stunning tournament victories to daily quests conquered.
              Every significant moment is etched here.
            </li>
            <li>
              <strong>Refer a Friend:</strong> The greatest journeys are shared!
              Use your unique code to invite friends and allies. When they
              answer the call, you both receive a hero's welcome with bonus
              Coins and XP.
            </li>
          </ul>
        </PageInfoModal>
      )}
      <InfoButton onClick={() => setShowInfo(true)} />
      <BackButton onClick={onBack!} variant="dark" />
      <h1 className="text-3xl font-extrabold text-center mb-6">Profile</h1>
      <div className="bg-surface shadow-md p-4 rounded-lg mb-4 flex items-center space-x-4">
        <img
          src={avatar}
          alt={petName}
          className="w-20 h-20 rounded-full border-2 border-primary object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{petName}</h2>
          <p className="text-text-secondary">Level {level}</p>
          <p className="text-sm text-primary font-semibold">
            {xp?.toLocaleString() ?? 0} XP
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-surface shadow-md p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-bold">Trophy Rack</p>
            <button
              onClick={onViewAllAchievements}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-background p-3 rounded-lg flex flex-col items-center justify-center text-center"
                title={badge.title}
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-full bg-primary-light text-primary">
                  {badge.icon}
                </div>
                <p className="font-semibold text-text-primary text-xs leading-tight truncate">
                  {badge.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface shadow-md p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-bold">Activity Log</p>
            <button
              onClick={onViewAllActivity}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            Refer a Friend!
          </h2>
          <p className="text-yellow-700 mb-4">
            Invite friends to get exclusive rewards!
          </p>
          <button
            onClick={onInvite}
            className="bg-primary text-text-inverse font-bold py-2 px-6 rounded-lg"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
