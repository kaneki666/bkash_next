import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CoinIcon,
  LeftArrowIcon,
  PlayTriangleIcon,
  PodiumIcon,
  RightArrowIcon,
  TimerIcon,
  UsersIcon,
  XPIcon,
} from "../components/icons";
import {
  BackButton,
  InfoButton,
  PageInfoModal,
} from "../components/PlatformPages";
import { PageProps } from "../types";

// --- Page-level component interfaces ---
interface PlayPageProps extends PageProps {
  coins: number;
  setCoins: (updater: (prevCoins: number) => number) => void;
  xp: number;
  addXp: (amount: number) => void;
  selectedAvatar: string;
  petName: string;
}

interface LobbyScreenProps {
  userCoins: number;
  setCoins: (updater: (prevCoins: number) => number) => void;
  addXp: (amount: number) => void;
  onBack: () => void;
  selectedAvatar: string;
  petName: string;
}

// --- Mutant Puzzle Game Flow Components (Previously Mutant Runner) ---
const ResultsScreen: React.FC<{
  players: any[];
  prize: number;
  onContinue: () => void;
  userAvatar: string;
}> = ({ players, prize, onContinue, userAvatar }) => {
  const winner = players[0];

  return (
    <div className="p-4 text-text-primary h-full flex flex-col animate-fade-in bg-background">
      <header className="text-center mb-4">
        <h1 className="text-4xl font-extrabold text-primary">Match Over!</h1>
      </header>

      <div className="flex flex-col items-center justify-center bg-surface rounded-2xl p-6 border-2 border-yellow-400 shadow-lg">
        <div className="relative mb-4">
          <img
            src={winner.avatar}
            alt={winner.name}
            className="w-28 h-28 rounded-full border-4 border-yellow-400 object-cover"
          />
          <span
            className="absolute -top-4 text-5xl"
            role="img"
            aria-label="crown"
          >
            👑
          </span>
        </div>
        <h2 className="text-2xl font-bold">{winner.name}</h2>
        <p className="text-text-secondary">is the winner!</p>

        <div className="mt-4 bg-yellow-100 rounded-lg px-4 py-2 flex items-center space-x-2">
          <CoinIcon className="w-6 h-6 text-yellow-600" />
          <span className="font-bold text-yellow-700 text-lg">
            Winner gets {Math.round(prize)} Coins
          </span>
        </div>
      </div>

      <div className="mt-6 flex-grow overflow-y-auto no-scrollbar">
        <h3 className="text-xl font-bold text-center mb-3">Final Rankings</h3>
        <div className="space-y-2">
          {players.map((player, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.avatar === userAvatar
                  ? "bg-primary-light border border-primary"
                  : "bg-surface shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-bold w-6 text-center text-lg">
                  {index + 1}
                </span>
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold">{player.name}</span>
              </div>
              <span className="font-bold text-primary">{player.score}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full mt-6 h-14 bg-primary text-text-inverse font-bold rounded-xl text-lg shadow-[0_0px_20px_theme(colors.primary/0.3)] transform hover:scale-105 transition-transform"
      >
        Continue
      </button>
    </div>
  );
};

const PVPRewardModal: React.FC<{
  coins: number;
  xp: number;
  onClaim: () => void;
}> = ({ coins, xp, onClaim }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm"
    >
      <h2 className="text-3xl font-extrabold text-primary">Match Reward!</h2>
      <div className="space-y-4 my-6">
        <div className="bg-background rounded-lg p-4 flex justify-between items-center">
          <span className="font-bold text-lg">Coins Won</span>
          <div className="flex items-center space-x-2">
            <CoinIcon className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary text-lg">+{coins}</span>
          </div>
        </div>
        <div className="bg-background rounded-lg p-4 flex justify-between items-center">
          <span className="font-bold text-lg">XP Gained</span>
          <div className="flex items-center space-x-2">
            <XPIcon className="w-6 h-6 text-warning" />
            <span className="font-bold text-primary text-lg">+{xp}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClaim}
        className="w-full bg-primary text-text-inverse font-bold py-3 rounded-xl text-lg transform hover:scale-105 transition-transform"
      >
        Claim
      </button>
    </motion.div>
  </div>
);

const LobbyScreen: React.FC<LobbyScreenProps> = ({
  userCoins,
  setCoins,
  addXp,
  onBack,
  selectedAvatar,
  petName,
}) => {
  const ENTRY_FEE = 100;
  const [joinedPlayers, setJoinedPlayers] = useState(2);
  const [timeLeft, setTimeLeft] = useState(135); // 2 minutes 15 seconds
  const [hasJoined, setHasJoined] = useState(false);
  const [autoJoin, setAutoJoin] = useState(false);
  const [matchState, setMatchState] = useState<
    "lobby" | "splash" | "results" | "reward"
  >("lobby");
  const poolSize = joinedPlayers * ENTRY_FEE;
  const [rewards, setRewards] = useState({ coins: 0, xp: 0 });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const joinInterval = setInterval(() => {
      if (timeLeft > 5 && matchState === "lobby")
        setJoinedPlayers((prev) => prev + Math.floor(Math.random() * 3));
    }, 3500);
    return () => clearInterval(joinInterval);
  }, [timeLeft, matchState]);

  useEffect(() => {
    if (matchState === "splash") {
      const timer = setTimeout(() => {
        const prize = poolSize * 0.85;
        const xpWon = 150;
        setCoins((prev) => prev + Math.round(prize));
        addXp(xpWon);
        setRewards({ coins: Math.round(prize), xp: xpWon });
        setMatchState("results");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [matchState, poolSize, setCoins, addXp]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const handleJoin = () => {
    if (userCoins >= ENTRY_FEE && !hasJoined) {
      setCoins((prev) => prev - ENTRY_FEE);
      setHasJoined(true);
      setJoinedPlayers((prev) => prev + 1);
      setMatchState("splash");
    }
  };

  if (matchState === "splash") {
    return (
      <div className="w-full h-full relative bg-black">
        <img
          src="https://ik.imagekit.io/erriqyxye/Mutant%20Axis/ChatGPT%20Image%20Aug%2021,%202025,%2010_14_17%20PM%20(1).jpg?updatedAt=1755791482275"
          alt="Mutant Puzzle loading screen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end text-center p-8">
          <h2
            className="text-5xl font-extrabold text-error drop-shadow-lg animate-pulse"
            style={{ textShadow: "3px 3px 10px rgba(0,0,0,0.8)" }}
          >
            ENTERING ARENA...
          </h2>
          <p className="mt-4 text-text-inverse text-xl drop-shadow-md">
            Get ready to puzzle!
          </p>
        </div>
      </div>
    );
  }

  if (matchState === "results") {
    const players = [
      { name: petName, avatar: selectedAvatar, score: 1850 },
      {
        name: "Rox",
        avatar:
          "https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Avatar%203.png?updatedAt=1755762266009",
        score: 1230,
      },
      {
        name: "Cybeast",
        avatar:
          "https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Avatar%202.png?updatedAt=1755762266819",
        score: 980,
      },
      {
        name: "Player4",
        avatar: "https://i.pravatar.cc/150?u=player4",
        score: 640,
      },
    ].sort((a, b) => b.score - a.score);
    return (
      <ResultsScreen
        players={players}
        prize={poolSize * 0.85}
        onContinue={() => setMatchState("reward")}
        userAvatar={selectedAvatar}
      />
    );
  }

  if (matchState === "reward") {
    return (
      <PVPRewardModal coins={rewards.coins} xp={rewards.xp} onClaim={onBack} />
    );
  }

  return (
    <div className="p-4 text-text-primary h-full flex flex-col animate-fade-in">
      <header className="relative flex items-center justify-center mb-6 h-10">
        <button
          onClick={onBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 -ml-2 rounded-full hover:bg-gray-200"
          aria-label="Back to play menu"
        >
          <LeftArrowIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-2xl font-extrabold">Match Lobby</h1>
      </header>
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-extrabold tracking-widest text-primary"
          style={{
            fontFamily: "Poppins, sans-serif",
            textShadow: "1px 1px 4px rgba(239, 68, 68, 0.2)",
          }}
        >
          VINE PUZZLE
        </h2>
      </div>
      <div className="space-y-4 flex-grow">
        <div className="bg-surface rounded-lg p-4 flex justify-between items-center border border-primary/20 shadow-sm">
          <h3 className="font-bold text-lg">Entry Fee</h3>
          <div className="flex items-center space-x-2 text-primary font-bold text-lg">
            <CoinIcon className="w-6 h-6" />
            <span>{ENTRY_FEE}</span>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 flex justify-between items-center border border-divider shadow-sm">
          <h3 className="font-bold text-lg">Current Pool</h3>
          <div className="text-right">
            <p className="flex items-center justify-end space-x-2 text-yellow-600 font-bold text-lg">
              <CoinIcon className="w-6 h-6" />
              <span>{poolSize}</span>
            </p>
            <p className="text-sm text-text-secondary mt-1 flex items-center justify-end space-x-1.5">
              <UsersIcon className="w-4 h-4" />
              <span>{joinedPlayers} Players Joined</span>
            </p>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 flex justify-between items-center border border-divider shadow-sm">
          <h3 className="font-bold text-lg">Lobby closes in</h3>
          <div className="flex items-center space-x-2 text-text-primary font-bold text-lg">
            <TimerIcon className="w-6 h-6" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-center mb-4">
          <label
            htmlFor="auto-join-toggle"
            className="flex items-center cursor-pointer"
          >
            <span className="mr-3 text-text-secondary">
              Auto-join next round
            </span>
            <div className="relative">
              <input
                id="auto-join-toggle"
                type="checkbox"
                className="sr-only"
                checked={autoJoin}
                onChange={() => setAutoJoin(!autoJoin)}
              />
              <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                  autoJoin ? "transform translate-x-full bg-primary" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
        <button
          onClick={handleJoin}
          disabled={hasJoined || userCoins < ENTRY_FEE || timeLeft <= 0}
          className="w-full h-16 bg-primary text-text-inverse font-bold rounded-xl text-xl shadow-[0_0px_20px_theme(colors.primary/0.3)] transform hover:scale-105 transition-all duration-300 disabled:bg-disabled-fill disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
        >
          {timeLeft <= 0
            ? "Lobby Closed"
            : hasJoined
            ? "Joined Match!"
            : userCoins < ENTRY_FEE
            ? "Not Enough Coins"
            : "Join Match"}
        </button>
      </div>
    </div>
  );
};

// --- Mutant Race Game Flow Components ---
const MutantRaceLobby: React.FC<any> = ({
  onJoin,
  onBack,
  userCoins,
  setCoins,
}) => {
  const ENTRY_FEE = 100;
  const [players, setPlayers] = useState(128);
  const [pool, setPool] = useState(128 * ENTRY_FEE);
  const [timeLeft, setTimeLeft] = useState(8130); // 02:15:30

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((p) => (p > 0 ? p - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 3600)
      .toString()
      .padStart(2, "0")}:${Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const handleJoin = () => {
    if (userCoins >= ENTRY_FEE) {
      setCoins((p: number) => p - ENTRY_FEE);
      onJoin();
    }
  };

  return (
    <div className="p-4 text-text-primary h-full flex flex-col animate-fade-in bg-background">
      <header className="relative flex items-center justify-center mb-4 h-10">
        <button
          onClick={onBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 -ml-2"
          aria-label="Back"
        >
          <LeftArrowIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-2xl font-extrabold">Jungle Race Tournament</h1>
      </header>
      <div className="bg-surface rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-center text-center">
          <div>
            <p className="text-sm text-text-secondary">Prize Pool</p>
            <p className="font-bold text-lg text-yellow-600 flex items-center justify-center">
              <CoinIcon className="w-5 h-5 mr-1" />
              {pool.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Players</p>
            <p className="font-bold text-lg">{players}/200</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Ends In</p>
            <p className="font-bold text-lg">{formatTime(timeLeft)}</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleJoin}
        disabled={userCoins < ENTRY_FEE}
        className="w-full h-14 bg-primary text-text-inverse font-bold rounded-xl text-lg disabled:bg-disabled-fill"
      >
        Join Now ({ENTRY_FEE} Coins)
      </button>
      <div className="flex items-center justify-between my-4">
        <span className="text-text-secondary">Auto-Join Next Round</span>
        <div className="relative">
          <input type="checkbox" className="sr-only" />
          <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
        </div>
      </div>
      <div className="flex-grow bg-surface rounded-xl p-4 flex flex-col shadow-sm">
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-full flex space-x-1">
            <button className="px-4 py-1 text-sm font-semibold bg-primary text-text-inverse rounded-full">
              Ranking
            </button>
            <button className="px-4 py-1 text-sm font-semibold text-text-secondary">
              Friends
            </button>
          </div>
        </div>
        <div className="space-y-2 mt-3 flex-grow">
          {[
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
          ].map((p) => (
            <div
              key={p.rank}
              className="flex items-center bg-background p-2 rounded-lg justify-between"
            >
              <div className="flex items-center">
                <span className="w-6 font-bold">{p.rank}</span>
                <img src={p.avatar} className="w-8 h-8 rounded-full mx-2" />
                <span className="font-semibold text-sm">{p.name}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-primary text-sm">
                  {p.score}
                </span>
                <div className="flex items-center text-yellow-600 ml-3">
                  <CoinIcon className="w-4 h-4 mr-1" />
                  <span>{p.reward.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="text-center text-primary font-semibold text-sm mt-2">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
};

const DesertRaceGameplay: React.FC<{ onGameEnd: () => void }> = ({
  onGameEnd,
}) => {
  return (
    <div
      className="w-full h-full bg-cover bg-center cursor-pointer animate-fade-in"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2006_44_26%20AM.jpg?updatedAt=1756167331966')",
      }}
      onClick={onGameEnd}
      role="button"
      aria-label="Click to end the race"
    />
  );
};

const PostMatchScore: React.FC<{
  onNext: () => void;
  onReturnToLobby: () => void;
  petName: string;
  selectedAvatar: string;
}> = ({ onNext, onReturnToLobby, petName, selectedAvatar }) => {
  const userAvatarUrl =
    "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2005_01_45%20AM.png?updatedAt=1756161114127";
  const leaderboardData = [
    {
      rank: 1,
      name: "Cybeast",
      avatar:
        "https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Avatar%202.png?updatedAt=1755762266819",
      score: "1.2M",
    },
    { rank: 2, name: petName, avatar: userAvatarUrl, score: "1.05M" },
    {
      rank: 3,
      name: "Rox",
      avatar:
        "https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Avatar%203.png?updatedAt=1755762266009",
      score: "980K",
    },
  ];

  return (
    <div className="p-6 text-text-primary h-full flex flex-col bg-background">
      <h1 className="text-center text-4xl font-extrabold mb-6">Final Score</h1>

      <div className="bg-surface rounded-2xl p-6 text-center border-2 border-primary shadow-lg mb-6">
        <img
          src={userAvatarUrl}
          alt="Your Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-primary object-cover"
        />
        <p className="font-bold text-5xl tracking-tight text-primary">1.05M</p>
        <p className="text-text-secondary mt-1">Rank 2 of 200</p>
      </div>

      <div className="mb-6 flex-grow">
        <h2 className="text-center font-bold text-xl mb-3">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboardData.map((p) => (
            <div
              key={p.rank}
              className={`flex items-center p-3 rounded-lg justify-between ${
                p.name === petName
                  ? "bg-primary text-text-inverse"
                  : p.rank === 1
                  ? "bg-primary-light"
                  : "bg-surface shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-6 font-bold text-lg ${
                    p.name === petName
                      ? "text-text-inverse"
                      : "text-text-primary"
                  }`}
                >
                  {p.rank}
                </span>
                <img
                  src={p.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold">{p.name}</span>
              </div>
              <span
                className={`font-bold ${
                  p.name === petName ? "text-text-inverse" : "text-primary"
                }`}
              >
                {p.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex space-x-3">
          <button className="w-1/2 h-14 bg-primary text-text-inverse rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors">
            Share Result
          </button>
          <button
            onClick={onReturnToLobby}
            className="w-1/2 h-14 bg-gray-300 text-text-primary rounded-xl font-bold text-lg hover:bg-gray-400 transition-colors"
          >
            Return to Lobby
          </button>
        </div>
        <button
          onClick={onNext}
          className="w-full h-16 bg-primary text-text-inverse font-extrabold rounded-xl text-xl hover:bg-primary-hover transition-colors"
        >
          Claim Rewards & Join Next
        </button>
      </div>
    </div>
  );
};

const RewardsModal: React.FC<any> = ({ onClaim }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5"
    >
      <h2 className="text-3xl font-extrabold text-primary">Reward Received!</h2>
      <div className="space-y-4 my-6">
        <div className="bg-background rounded-lg p-4 flex justify-between items-center">
          <span className="font-bold text-lg">XP Gained</span>
          <div className="flex items-center space-x-2">
            <XPIcon className="w-6 h-6 text-warning" />
            <span className="font-bold text-primary text-lg">+750</span>
          </div>
        </div>
        <div className="bg-background rounded-lg p-4 flex justify-between items-center">
          <span className="font-bold text-lg">Coins Awarded</span>
          <div className="flex items-center space-x-2">
            <CoinIcon className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary text-lg">+8000</span>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          30 Coins burned from entry fee.
        </p>
      </div>
      <button
        onClick={onClaim}
        className="w-full bg-primary text-text-inverse font-bold py-3 rounded-xl text-lg"
      >
        Claim
      </button>
      <p className="text-sm mt-4 text-text-secondary">
        Play again to climb higher!
      </p>
    </motion.div>
  </div>
);

// --- New Single Player Game Flow Components ---
const EntryConfirmationPopup: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm"
    >
      <h2 className="text-xl font-bold mb-4">Confirm Entry</h2>
      <p className="text-text-secondary mb-6">
        5 Coins will be deducted to play.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-text-primary font-bold py-3 rounded-xl transition-colors"
        >
          ❌ Cancel
        </button>
        <button
          onClick={onConfirm}
          className="w-1/2 bg-primary hover:bg-primary-hover text-text-inverse font-bold py-3 rounded-xl transition-colors"
        >
          ✅ Confirm & Start
        </button>
      </div>
    </motion.div>
  </div>
);

const GameplayScreen: React.FC<{ onGameOver: (score: number) => void }> = ({
  onGameOver,
}) => {
  const [score, setScore] = useState(0);
  const finalScore = 2500;
  const gameEndedRef = useRef(false);

  const endGame = useCallback(() => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;
    onGameOver(finalScore);
  }, [onGameOver, finalScore]);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setScore((prev) => {
        const nextScore = prev + Math.floor(Math.random() * 150) + 50;
        if (nextScore >= finalScore) {
          clearInterval(scoreInterval);
          endGame();
          return finalScore;
        }
        return nextScore;
      });
    }, 150);

    const gameTimer = setTimeout(() => {
      clearInterval(scoreInterval);
      endGame();
    }, 3000);

    return () => {
      clearInterval(scoreInterval);
      clearTimeout(gameTimer);
    };
  }, [endGame, finalScore]);

  return (
    <div
      onClick={endGame}
      className="absolute inset-0 bg-cover bg-center z-40 flex flex-col justify-between p-4 cursor-pointer"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2006_44_26%20AM.jpg?updatedAt=1756167331966')",
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full absolute inset-0 bg-black/30"
        />
      </AnimatePresence>
      <div className="relative flex justify-between items-start">
        <div>
          <p className="font-bold text-4xl text-text-inverse drop-shadow-lg">
            {score.toLocaleString()}
          </p>
          <p className="text-sm text-error font-semibold">SCORE</p>
        </div>
        <button className="p-2 bg-black/40 rounded-full text-text-inverse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </button>
      </div>
      <div className="relative w-full bg-black/40 rounded-full h-4 border border-primary/50 p-0.5">
        <div
          className="bg-gradient-to-r from-primary to-warning h-full rounded-full transition-all duration-150 ease-linear"
          style={{ width: `${(score / finalScore) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const SinglePlayerGameOverModal: React.FC<{
  score: number;
  onPlayAgain: () => void;
  onClaimAndClose: () => void;
}> = ({ score, onPlayAgain, onClaimAndClose }) => {
  const xpEarned = Math.floor(score / 125);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-full max-w-sm"
      >
        <h1 className="text-4xl font-extrabold text-primary mb-2">Game Over</h1>

        <p className="text-lg text-text-secondary mb-4">Your final score:</p>
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.3,
            },
          }}
          className="text-6xl font-bold text-text-primary mb-6"
        >
          {score.toLocaleString()}
        </motion.p>

        <div className="bg-background rounded-lg p-4 flex justify-between items-center mb-8">
          <span className="font-bold text-lg">XP Gained</span>
          <div className="flex items-center space-x-2">
            <XPIcon className="w-6 h-6" />
            <span className="font-bold text-primary text-lg">+{xpEarned}</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full h-14 bg-primary text-text-inverse font-bold rounded-xl text-lg flex items-center justify-center space-x-2 transform hover:scale-105 transition-transform"
          >
            <span>🔄 Play Again (5 Coins)</span>
          </button>
          <button
            onClick={onClaimAndClose}
            className="w-full h-14 bg-gray-600 text-text-inverse font-bold rounded-xl text-lg transform hover:scale-105 transition-transform"
          >
            ✅ Claim & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main UI Components ---
const GameCard: React.FC<{
  title: string;
  imgSrc: string;
  onClick?: () => void;
}> = ({ title, imgSrc, onClick }) => (
  <div className="rounded-2xl overflow-hidden shadow-lg bg-surface">
    <div
      className="w-full h-32 bg-cover bg-center"
      style={{ backgroundImage: `url(${imgSrc})` }}
    ></div>
    <div className="p-3 bg-surface flex justify-between items-center">
      <p className="font-semibold text-text-primary">{title}</p>
      <button
        onClick={onClick}
        className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center hover:bg-primary-hover shadow-md disabled:bg-disabled-fill disabled:cursor-not-allowed"
        disabled={!onClick}
      >
        <PlayTriangleIcon className="w-6 h-6 text-text-inverse" />
      </button>
    </div>
  </div>
);

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
      isActive
        ? "bg-primary text-text-inverse shadow-lg"
        : "bg-gray-200 text-text-secondary"
    }`}
  >
    {label}
  </button>
);

const Play: React.FC<PlayPageProps> = ({
  coins,
  setCoins,
  xp,
  addXp,
  selectedAvatar,
  petName,
  setActivePage,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState("leaderboard");
  // State for Mutant Puzzle (lobby-based game)
  const [puzzleView, setPuzzleView] = useState<"main" | "lobby">("main");
  // State for Mutant Race (multi-stage tournament)
  const [raceView, setRaceView] = useState<
    "none" | "lobby" | "gameplay" | "score" | "rewards"
  >("none");
  // State for Mutant Runner (single-player game)
  const [singlePlayerState, setSinglePlayerState] = useState<
    "none" | "confirm" | "playing" | "gameOver"
  >("none");
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const visitedPages = JSON.parse(
      localStorage.getItem("visitedPages") || "{}"
    );
    if (!visitedPages.play) {
      setShowInfo(true);
      visitedPages.play = true;
      localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
    }
  }, []);

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

  // --- Handler Functions ---
  const handleClaimRaceRewards = () => {
    addXp(750);
    setCoins((prev) => prev + 8000); // Rank 2 prize
    setRaceView("none");
  };

  const handleStartSinglePlayer = () => {
    if (coins >= 5) {
      setCoins((prev) => prev - 5);
      setSinglePlayerState("playing");
    }
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setSinglePlayerState("gameOver");
  };

  const handleClaimAndClose = () => {
    const xpReward = Math.floor(finalScore / 125);
    addXp(xpReward);
    setSinglePlayerState("none");
  };

  const handleReplay = () => {
    setSinglePlayerState("none");
    setTimeout(() => {
      if (coins >= 5) {
        setSinglePlayerState("confirm");
      }
    }, 100);
  };

  // --- Render Logic ---
  if (puzzleView === "lobby") {
    return (
      <LobbyScreen
        userCoins={coins}
        setCoins={setCoins}
        addXp={addXp}
        onBack={() => setPuzzleView("main")}
        selectedAvatar={selectedAvatar}
        petName={petName}
      />
    );
  }

  if (raceView === "lobby") {
    return (
      <MutantRaceLobby
        onJoin={() => setRaceView("gameplay")}
        onBack={() => setRaceView("none")}
        userCoins={coins}
        setCoins={setCoins}
      />
    );
  }
  if (raceView === "gameplay") {
    return <DesertRaceGameplay onGameEnd={() => setRaceView("score")} />;
  }
  if (raceView === "score") {
    return (
      <PostMatchScore
        onNext={() => setRaceView("rewards")}
        onReturnToLobby={() => setRaceView("none")}
        petName={petName}
        selectedAvatar={selectedAvatar}
      />
    );
  }

  // --- Main Play Screen ---
  const formattedTime = `${String(timeLeft.d).padStart(2, "0")}d ${String(
    timeLeft.h
  ).padStart(2, "0")}h ${String(timeLeft.m).padStart(2, "0")}m`;
  const leaderboardGames: {
    title: string;
    imgSrc: string;
    onClick?: () => void;
  }[] = [
    {
      title: "Jungle Race",
      imgSrc:
        "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2001_51_01%20AM.png?updatedAt=1756150922731",
      onClick: () => setRaceView("lobby"),
    },
    {
      title: "Lagoon Sports",
      imgSrc:
        "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2001_51_04%20AM.png?updatedAt=1756150922816",
    },
  ];
  const pvpGames: { title: string; imgSrc: string; onClick?: () => void }[] = [
    {
      title: "Vine Puzzle",
      imgSrc:
        "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2002_13_00%20AM.png?updatedAt=1756150989106",
      onClick: () => setPuzzleView("lobby"),
    },
    {
      title: "Canopy Quiz",
      imgSrc:
        "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2001_52_08%20AM.png?updatedAt=1756150922794",
    },
  ];

  return (
    <div className="bg-background text-text-primary min-h-full pb-8 relative">
      {showInfo && (
        <PageInfoModal title="Play Zone" onClose={() => setShowInfo(false)}>
          <p>It's game time! This is where you compete to earn rewards.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Single Player:</strong> Challenge yourself in games like
              Jaguar Dash to earn XP.
            </li>
            <li>
              <strong>Leaderboard Games:</strong> Compete in global tournaments
              over a season for a massive prize pool.
            </li>
            <li>
              <strong>PVP Matches:</strong> Go head-to-head against other
              players in real-time games to win their entry fee.
            </li>
          </ul>
        </PageInfoModal>
      )}
      <BackButton onClick={onBack!} />
      <InfoButton onClick={() => setShowInfo(true)} />

      <AnimatePresence>
        {raceView === "rewards" && (
          <RewardsModal onClaim={handleClaimRaceRewards} />
        )}
        {singlePlayerState === "confirm" && (
          <EntryConfirmationPopup
            onConfirm={handleStartSinglePlayer}
            onCancel={() => setSinglePlayerState("none")}
          />
        )}
        {singlePlayerState === "playing" && (
          <GameplayScreen onGameOver={handleGameOver} />
        )}
        {singlePlayerState === "gameOver" && (
          <SinglePlayerGameOverModal
            score={finalScore}
            onPlayAgain={handleReplay}
            onClaimAndClose={handleClaimAndClose}
          />
        )}
      </AnimatePresence>

      <div className="p-4 relative h-[420px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-b-3xl"
          style={{
            backgroundImage:
              "url('https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2001_50_57%20AM.png?updatedAt=1756150922702')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="relative flex flex-col justify-end h-full text-center">
          <div className="flex items-center justify-center space-x-4">
            <button className="text-white/50 hover:text-white">
              <LeftArrowIcon className="w-8 h-8" />
            </button>
            <h1
              className="text-4xl font-extrabold tracking-widest text-text-inverse"
              style={{
                fontFamily: "Poppins, sans-serif",
                textShadow: "2px 2px 8px rgba(239, 68, 68, 0.5)",
              }}
            >
              JAGUAR DASH
            </h1>
            <button className="text-white/50 hover:text-white">
              <RightArrowIcon className="w-8 h-8" />
            </button>
          </div>
          <div className="flex items-center justify-center text-gray-200 font-semibold px-8 mt-4">
            <div className="flex items-center space-x-2">
              <TimerIcon className="w-5 h-5" />
              <span>24:59:59</span>
            </div>
          </div>
          <div className="mt-6 px-4">
            <button
              onClick={() =>
                coins >= 5 ? setSinglePlayerState("confirm") : null
              }
              disabled={coins < 5}
              className="w-full h-16 bg-primary text-text-inverse font-bold rounded-xl text-xl shadow-[0_0px_20px_theme(colors.primary/0.4)] flex items-center justify-center space-x-2 transition-all disabled:bg-disabled-fill disabled:text-text-disabled disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105"
            >
              <CoinIcon className="w-7 h-7" />
              <span>5 Coins</span>
            </button>
          </div>
          <div className="w-full h-1.5 bg-black/20 rounded-full mt-6 mx-auto max-w-xs">
            <div className="w-1/3 h-full bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="p-4 mt-2">
        <button
          onClick={() => setActivePage("leaderboard")}
          className="w-full bg-gradient-to-br from-secondary-action via-primary to-primary p-4 rounded-xl mb-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
        >
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="font-extrabold text-text-inverse text-lg tracking-wider drop-shadow-md">
                Global Leaderboard
              </p>
              <p className="text-white/90 text-sm mt-1 drop-shadow-md">
                Top Prize: 15,000 Coins
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-text-inverse">Your Rank: #15</p>
              <p className="text-xs text-primary/70 font-mono flex items-center justify-end">
                <TimerIcon className="w-4 h-4 mr-1" />
                {formattedTime}
              </p>
            </div>
          </div>
          <PodiumIcon className="absolute -right-2 -bottom-4 w-20 h-20 text-white/10 transform transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Multiplayer</h2>
        <div className="flex items-center justify-center space-x-2 bg-gray-200 p-1 rounded-full mb-4">
          <TabButton
            label="Leaderboard"
            isActive={activeTab === "leaderboard"}
            onClick={() => setActiveTab("leaderboard")}
          />
          <TabButton
            label="PVP"
            isActive={activeTab === "pvp"}
            onClick={() => setActiveTab("pvp")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(activeTab === "leaderboard" ? leaderboardGames : pvpGames).map(
            (game) => (
              <GameCard
                key={game.title}
                title={game.title}
                imgSrc={game.imgSrc}
                onClick={game.onClick}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Play;
