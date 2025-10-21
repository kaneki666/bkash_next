import React, { useEffect, useState } from "react";
import { BackButton } from "../components/PlatformPages";
import { CoinIcon, TimerIcon } from "../components/icons";
import { PageProps } from "../types";

const Leaderboard: React.FC<PageProps & { isTabbed?: boolean }> = ({
  setActivePage,
  onBack,
  isTabbed = false,
}) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Set a fixed end date 6 days, 10 hours from now for demo purposes
    const countdownDate =
      new Date().getTime() + 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = `${String(timeLeft.d).padStart(2, "0")}d ${String(
    timeLeft.h
  ).padStart(2, "0")}h ${String(timeLeft.m).padStart(2, "0")}m ${String(
    timeLeft.s
  ).padStart(2, "0")}s`;

  const players = [
    {
      rank: 1,
      name: "Cybeast",
      avatar:
        "https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Avatar%202.png?updatedAt=1755762266819",
      score: "1.2M",
      reward: 15000,
    },
    {
      rank: 2,
      name: "Rox",
      avatar:
        "https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Avatar%203.png?updatedAt=1755762266009",
      score: "1.1M",
      reward: 8000,
    },
    {
      rank: 3,
      name: "Volt",
      avatar:
        "https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Avatar%201.png?updatedAt=1755762265754",
      score: "980K",
      reward: 4000,
    },
    {
      rank: 4,
      name: "PlayerX",
      avatar: "https://i.pravatar.cc/150?u=playerX",
      score: "850K",
      reward: 2000,
    },
    {
      rank: 5,
      name: "Gamer123",
      avatar: "https://i.pravatar.cc/150?u=Gamer123",
      score: "720K",
      reward: 1000,
    },
    {
      rank: 15,
      name: "You (Kai)",
      avatar:
        "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2005_01_45%20AM.png?updatedAt=1756161114127",
      score: "450K",
      reward: 100,
    },
  ];

  const top3 = players.slice(0, 3);
  const theRest = players.slice(3);

  const podiumData = {
    first: top3.find((p) => p.rank === 1),
    second: top3.find((p) => p.rank === 2),
    third: top3.find((p) => p.rank === 3),
  };

  const PodiumPlace: React.FC<{
    player?: (typeof players)[0];
    rank: number;
  }> = ({ player, rank }) => {
    if (!player) return <div className="w-1/4 h-[85%]"></div>;

    const styles =
      {
        1: {
          container: "w-1/3 h-full bg-primary-light border-primary",
          avatar: "w-20 h-20 border-primary",
          rankText: "text-primary",
        },
        2: {
          container: "w-1/4 h-[85%] bg-gray-100 border-gray-400",
          avatar: "w-16 h-16 border-gray-400",
          rankText: "text-text-secondary",
        },
        3: {
          container: "w-1/4 h-[85%] bg-warning-light border-warning",
          avatar: "w-16 h-16 border-warning",
          rankText: "text-warning-dark",
        },
      }[rank as 1 | 2 | 3] || {};

    return (
      <div
        className={`flex flex-col items-center justify-end p-2 rounded-t-lg border-2 border-b-0 ${styles.container}`}
      >
        <div className="relative">
          <img
            src={player.avatar}
            className={`rounded-full object-cover border-4 mb-2 ${styles.avatar}`}
            alt={player.name}
          />
          {rank === 1 && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl">
              👑
            </span>
          )}
        </div>
        <p className="font-bold text-text-primary text-sm truncate">
          {player.name}
        </p>
        <p className={`font-extrabold text-lg ${styles.rankText}`}>
          {player.score}
        </p>
      </div>
    );
  };

  return (
    <div
      className={`p-4 text-text-primary relative h-full flex flex-col ${
        isTabbed ? "pt-0" : ""
      }`}
    >
      {!isTabbed && <BackButton onClick={onBack!} variant="dark" />}
      {!isTabbed && (
        <h1 className="text-3xl font-extrabold text-center mb-4">
          Global Leaderboard
        </h1>
      )}

      <div className="flex justify-center mb-4">
        <div className="bg-gray-200 p-1 rounded-full flex space-x-1">
          <button className="px-6 py-2 text-sm font-semibold bg-primary text-text-inverse rounded-full">
            All Time
          </button>
          <button className="px-6 py-2 text-sm font-semibold text-text-secondary">
            Weekly
          </button>
          <button className="px-6 py-2 text-sm font-semibold text-text-secondary">
            Friends
          </button>
        </div>
      </div>

      <div className="bg-surface p-2 rounded-lg text-center mb-4 shadow-sm">
        <p className="text-sm text-text-secondary flex items-center justify-center">
          <TimerIcon className="w-4 h-4 mr-2" />
          Season ends in:{" "}
          <span className="font-bold text-primary ml-2 tracking-wider">
            {formattedTime}
          </span>
        </p>
      </div>

      <div className="flex items-end justify-center gap-2 h-48 mb-6">
        <PodiumPlace player={podiumData.second} rank={2} />
        <PodiumPlace player={podiumData.first} rank={1} />
        <PodiumPlace player={podiumData.third} rank={3} />
      </div>

      <div className="space-y-2 flex-grow overflow-y-auto no-scrollbar pr-2">
        {theRest.map((p) => (
          <div
            key={p.rank}
            className={`flex items-center p-2 rounded-lg justify-between ${
              p.name.includes("You")
                ? "bg-primary-light border-2 border-primary"
                : "bg-surface shadow-sm"
            }`}
          >
            <div className="flex items-center">
              <span className="w-8 text-center font-bold text-lg">
                {p.rank}
              </span>
              <img
                src={p.avatar}
                className="w-10 h-10 rounded-full mx-2 object-cover"
              />
              <span className="font-semibold text-md">{p.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-primary text-md mr-4">
                {p.score}
              </span>
              <div className="flex items-center text-yellow-600 font-bold">
                <CoinIcon className="w-5 h-5 mr-1" />
                <span>{p.reward.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
