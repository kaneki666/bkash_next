import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
// ...existing code...
// Fixed imports: pages export default components — import them as defaults.
// Also import Shop as default and LoyaltyExchangePage as a named export.
import Avatar from "../components/Avatar";
import ActivityLogPage from "../pages/ActivityLogPage";
import Championship from "../pages/Championship";
import DailySpinGame from "../pages/DailySpinGame";
import Events from "../pages/Events";
import HallOfFame from "../pages/HallOfFame";
import Leaderboard from "../pages/Leaderboard";
import NotificationsPage from "../pages/NotificationsPage";
import Profile from "../pages/Profile";
import QuestHub from "../pages/QuestHub";
import ReferralPage from "../pages/ReferralPage";
import RewardMap from "../pages/RewardMap";
import Shop, { LoyaltyExchangePage } from "../pages/Shop";
import SummerFestival from "../pages/SummerFestival";
import TeamUpChallenge from "../pages/TeamUpChallenge";
import TreasurePage from "../pages/TreasurePage";
/*...existing code...*/
import { MilestoneData, Notification, PetStage } from "../types";
import BottomNav from "./BottomNav";
import DailyRewardModal from "./DailyRewardModal";
import Header from "./Header";
import { CoinIcon, XPIcon } from "./icons";
import { MilestoneRewardModal } from "./PlatformPages";

const milestonesData: MilestoneData[] = [
  {
    level: 1,
    name: "Welcome Aboard!",
    tasks: [
      { id: "t1-1", description: "Log in for the first time", target: 1 },
      { id: "t1-2", description: "Name your Pet", target: 1 },
      {
        id: "t1-3",
        description: "Complete the onboarding tutorial",
        target: 1,
      },
      { id: "t1-4", description: "Visit the Quest Hub", target: 1 },
      { id: "t1-5", description: "Visit the Shop", target: 1 },
    ],
    reward: { coins: 50, xp: 50 },
  },
  {
    level: 2,
    name: "Payment Pioneer",
    tasks: [
      {
        id: "t2-1",
        description: "Make your first QR payment (min BDT 50)",
        target: 50,
      },
      { id: "t2-2", description: "Send money to a friend", target: 1 },
      {
        id: "t2-3",
        description: "Top-up your mobile with any amount",
        target: 1,
      },
      { id: "t2-4", description: "Pay a utility bill", target: 1 },
      {
        id: "t2-5",
        description: "Save payment details for future use",
        target: 1,
      },
    ],
    reward: { coins: 100 },
  },
  {
    level: 3,
    name: "Digital Cartographer",
    tasks: [
      {
        id: "t3-1",
        description: "Pay BDT 1000 via Swapno website",
        target: 1000,
      },
      {
        id: "t3-2",
        description: "Make a purchase on an e-commerce site",
        target: 1,
      },
      { id: "t3-3", description: "Pay for a food delivery service", target: 1 },
      { id: "t3-4", description: "Buy a movie ticket online", target: 1 },
      {
        id: "t3-5",
        description: "Link your bKash to a merchant website",
        target: 1,
      },
    ],
    reward: { cashback: 50 },
  },
  {
    level: 5,
    name: "Transaction Titan",
    tasks: [
      { id: "t4-1", description: "Make 5 unique transactions", target: 5 },
      { id: "t4-2", description: "Pay 3 different utility bills", target: 3 },
      {
        id: "t4-3",
        description: "Send money to 5 different people",
        target: 5,
      },
      {
        id: "t4-4",
        description: "Complete 10 transactions in a week",
        target: 10,
      },
      { id: "t4-5", description: "Use the 'Request Money' feature", target: 1 },
    ],
    reward: { freeSpins: 1 },
  },
  {
    level: 7,
    name: "Coin Connoisseur",
    tasks: [
      { id: "t5-1", description: "Spend 2000 Coins in the shop", target: 2000 },
      { id: "t5-2", description: "Buy a 'Rare' or 'Epic' item", target: 1 },
      {
        id: "t5-3",
        description: "Redeem a Telco benefit from the shop",
        target: 1,
      },
      { id: "t5-4", description: "Gift an item to a friend", target: 1 },
      { id: "t5-5", description: "Spin the Treasure Wheel 5 times", target: 5 },
    ],
    reward: { coins: 500 },
  },
  {
    level: 10,
    name: "Arena Champion",
    tasks: [
      { id: "t6-1", description: "Win a tournament", target: 1 },
      { id: "t6-2", description: "Reach top 10 in any leaderboard", target: 1 },
      { id: "t6-3", description: "Play 5 PvP matches", target: 5 },
      { id: "t6-4", description: "Join a weekly tournament", target: 1 },
      {
        id: "t6-5",
        description: "Win 3 consecutive single-player games",
        target: 3,
      },
    ],
    reward: { cashback: 100, xp: 100 },
  },
  {
    level: 12,
    name: "Treasury Master",
    tasks: [
      { id: "t7-1", description: "Accumulate 5000 Coins", target: 5000 },
      {
        id: "t7-2",
        description: "Win a prize from Treasure Wheel > 200 Coins",
        target: 1,
      },
      {
        id: "t7-3",
        description: "Complete all daily missions for 3 days",
        target: 3,
      },
      { id: "t7-4", description: "Complete a weekly mission", target: 1 },
      {
        id: "t7-5",
        description: "Hold a balance > 1000 Coins for 24 hours",
        target: 1,
      },
    ],
    reward: { coins: 1000 },
  },
];

const LEVEL_THRESHOLDS = [
  0, 1000, 2500, 5000, 8000, 12000, 17000, 23000, 30000, 40000, 50000,
]; // XP for levels 1-11

interface MainPlatformProps {
  petName: string;
  selectedAvatar: string;
}

const PetRewardToast: React.FC<{
  reward: { type: "coin" | "xp"; value: number } | null;
}> = ({ reward }) => {
  if (!reward) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.5 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-surface/80 backdrop-blur-sm rounded-full shadow-lg p-2 flex items-center space-x-2 border border-primary"
    >
      <span className="text-sm font-semibold">Your pet found something!</span>
      <div className="flex items-center space-x-1 bg-primary-light px-2 py-1 rounded-full">
        {reward.type === "coin" ? (
          <CoinIcon className="w-4 h-4 text-primary" />
        ) : (
          <XPIcon className="w-4 h-4 text-warning" />
        )}
        <span className="text-sm font-bold text-primary">+{reward.value}</span>
      </div>
    </motion.div>
  );
};

const MainPlatform: React.FC<MainPlatformProps> = ({
  petName,
  selectedAvatar,
}) => {
  const [pageHistory, setPageHistory] = useState<string[]>([]);
  const [activePage, setActivePageInternal] = useState("championship"); // Default to Championship page
  const [showRewardModal, setShowRewardModal] = useState(true);

  // User stats
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(100);
  const [loyaltyPoints, setLoyaltyPoints] = useState(5000);
  const [ownedItems, setOwnedItems] = useState<Set<number>>(new Set());
  const [freeSpins, setFreeSpins] = useState(0);
  const [missionStreak, setMissionStreak] = useState(0);

  // Pet Wellbeing Stats
  const [happiness, setHappiness] = useState(80);
  const [petReward, setPetReward] = useState<{
    type: "coin" | "xp";
    value: number;
  } | null>(null);

  // Reward Map State
  const [currentLevel, setCurrentLevel] = useState(1);
  const [claimedMilestones, setClaimedMilestones] = useState<Set<number>>(
    new Set([1])
  );
  const [claimableMilestones, setClaimableMilestones] = useState<Set<number>>(
    new Set()
  );
  const [showMilestoneModal, setShowMilestoneModal] =
    useState<MilestoneData | null>(null);
  const [taskProgress, setTaskProgress] = useState<Record<string, number>>({
    "t2-1": 25,
    "t3-1": 450,
    "t4-1": 2,
    "t4-3": 3,
    "t5-1": 800,
    "t6-3": 1,
    "t7-1": 3200,
  });

  // Quest Hub State
  const [activeQuestTab, setActiveQuestTab] = useState<
    "missions" | "achievements"
  >("missions");

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const prevActivePageRef = useRef<string | null>(null);
  useEffect(() => {
    prevActivePageRef.current = activePage;
  });

  // Initialize with some notifications for demonstration
  useEffect(() => {
    setNotifications([
      {
        id: "2",
        message: "The Summer Festival event has started!",
        type: "event",
        timestamp: new Date(Date.now() - 3600 * 1000 * 5),
        isRead: true,
        link: "events",
      },
      {
        id: "1",
        message: "Welcome to Jungle Journey! Complete your first mission.",
        type: "system",
        timestamp: new Date(),
        isRead: false,
        link: "quest",
      },
    ]);
  }, []);

  // FIX: Moved addXp function before its usage on line 245 and wrapped with useCallback for optimization.
  const addXp = useCallback((amount: number) => {
    setXp((prevXp) => prevXp + amount);
  }, []);

  const addNotification = useCallback(
    (message: string, type: Notification["type"], link?: string) => {
      const newNotification: Notification = {
        id: new Date().toISOString() + Math.random(),
        message,
        type,
        link,
        timestamp: new Date(),
        isRead: false,
      };
      setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications
    },
    []
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navigateTo = (page: string, options?: { isBottomNav?: boolean }) => {
    if (page === activePage) return;

    if (options?.isBottomNav) {
      setPageHistory([]);
    } else {
      setPageHistory((prev) => [...prev, activePage]);
    }
    setActivePageInternal(page);
  };

  const navigateBack = () => {
    if (pageHistory.length === 0) {
      setActivePageInternal("championship");
      return;
    }
    const newHistory = [...pageHistory];
    const lastPage = newHistory.pop();
    setPageHistory(newHistory);
    if (lastPage) {
      setActivePageInternal(lastPage);
    } else {
      setActivePageInternal("championship");
    }
  };

  // Pet happiness decay
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setHappiness((h) => {
        const newHappiness = Math.max(0, h - 1);
        if (h > 50 && newHappiness <= 50) {
          // Notify just once when it drops below threshold
          addNotification(
            "Your pet is feeling sad! It won't find rewards.",
            "system",
            "avatar"
          );
        }
        if (h > 30 && newHappiness <= 30) {
          addNotification(
            "Your pet is very unhappy! XP gain has been halted.",
            "system",
            "avatar"
          );
        }
        return newHappiness;
      });
    }, 30000); // decay 1 point every 30s for demo
    return () => clearInterval(decayInterval);
  }, [addNotification]);

  // Pet random reward drops
  useEffect(() => {
    let rewardInterval: ReturnType<typeof setInterval>;
    if (happiness > 50) {
      rewardInterval = setInterval(() => {
        if (Math.random() < 0.2) {
          // 20% chance every 30s
          const isCoin = Math.random() < 0.7;
          const rewardValue = isCoin
            ? Math.floor(Math.random() * 20) + 5
            : Math.floor(Math.random() * 15) + 5;
          if (isCoin) setCoins((c) => c + rewardValue);
          else addXp(rewardValue);
          setPetReward({ type: isCoin ? "coin" : "xp", value: rewardValue });
          addNotification(
            `Your pet found +${rewardValue} ${isCoin ? "Coins" : "XP"}!`,
            "reward",
            "avatar"
          );
          setTimeout(() => setPetReward(null), 3000);
        }
      }, 30000);
    }
    return () => clearInterval(rewardInterval);
  }, [happiness, addXp, addNotification]);

  const calculateLevel = useCallback((currentXp: number) => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (currentXp >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }, []);

  useEffect(() => {
    const newLevel = calculateLevel(xp);
    if (newLevel > currentLevel) {
      setCurrentLevel(newLevel);
    } else if (newLevel < currentLevel) {
      setCurrentLevel(newLevel);
    }
  }, [xp, currentLevel, calculateLevel]);

  const getPetStage = (level: number): PetStage => {
    if (level >= 11) return "Legendary Lion";
    if (level >= 9) return "Adult Lion";
    if (level >= 6) return "Teen Lion";
    if (level >= 3) return "Young Cub";
    return "Baby Cub";
  };
  const petStage = getPetStage(currentLevel);

  const onMissionComplete = () => {
    const nextLevelIndex = currentLevel;
    if (nextLevelIndex >= LEVEL_THRESHOLDS.length) {
      console.log("Max level reached");
      return;
    }

    const xpForNextLevel = LEVEL_THRESHOLDS[nextLevelIndex];
    const xpForCurrentLevel = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
    const progressInCurrentLevel = xp - xpForCurrentLevel;

    const newXp = xpForNextLevel + progressInCurrentLevel;

    setXp(newXp);
  };

  const handleClaimMilestoneReward = () => {
    if (!showMilestoneModal) return;

    if (showMilestoneModal.reward.coins) {
      setCoins((prev) => prev + (showMilestoneModal.reward.coins || 0));
    }
    if (showMilestoneModal.reward.xp) {
      addXp(showMilestoneModal.reward.xp || 0);
    }
    if (showMilestoneModal.reward.freeSpins) {
      setFreeSpins((prev) => prev + (showMilestoneModal.reward.freeSpins || 0));
    }

    addNotification(
      `Milestone Reached: ${showMilestoneModal.name}`,
      "milestone",
      "home"
    );

    setClaimedMilestones((prev) => new Set(prev).add(showMilestoneModal.level));
    setClaimableMilestones((prev) => {
      const newSet = new Set(prev);
      newSet.delete(showMilestoneModal.level);
      return newSet;
    });
    setShowMilestoneModal(null);
  };

  const onClaimLevel = (level: number) => {
    const milestone = milestonesData.find((m) => m.level === level);
    if (milestone) {
      setShowMilestoneModal(milestone);
    }
  };

  const makeMilestoneClaimable = (level: number) => {
    if (!claimedMilestones.has(level) && !claimableMilestones.has(level)) {
      setClaimableMilestones((prev) => new Set(prev).add(level));
    }
  };

  const updateTaskProgress = (taskId: string, newProgress: number) => {
    setTaskProgress((prev) => ({ ...prev, [taskId]: newProgress }));
  };

  const handleClaimReward = () => {
    addXp(100);
    setCoins((prev) => prev + 500);
    addNotification("Claimed daily reward of 500 Coins and 100 XP!", "reward");
    setShowRewardModal(false);
  };

  const handlePurchase = (itemId: number, cost: number) => {
    if (coins >= cost && !ownedItems.has(itemId)) {
      setCoins((prev) => prev - cost);
      setOwnedItems((prev) => new Set(prev).add(itemId));
    }
  };

  const handleLoyaltyExchange = (pointsToExchange: number) => {
    if (loyaltyPoints >= pointsToExchange && pointsToExchange > 0) {
      const coinsGained = pointsToExchange * 10; // Exchange rate: 1 point = 10 coins
      setLoyaltyPoints((prev) => prev - pointsToExchange);
      setCoins((prev) => prev + coinsGained);
      addNotification(
        `${pointsToExchange} loyalty points exchanged for ${coinsGained} coins!`,
        "reward"
      );
    }
  };

  const navigateToQuestAchievements = () => {
    navigateTo("achievements");
  };

  const navigateToActivityLog = () => {
    navigateTo("activity");
  };

  const navigateToReferral = () => {
    navigateTo("referral");
  };

  const renderPage = () => {
    const pageProps = { setActivePage: navigateTo, onBack: navigateBack };

    const xpForCurrentLevel = LEVEL_THRESHOLDS[currentLevel - 1] ?? 0;
    const xpForNextLevel =
      LEVEL_THRESHOLDS[currentLevel] ??
      LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const xpProgressInLevel = xp - xpForCurrentLevel;
    const totalXpForLevel = xpForNextLevel - xpForCurrentLevel;

    switch (activePage) {
      case "home":
        return (
          <RewardMap
            milestones={milestonesData}
            claimedMilestones={claimedMilestones}
            setActivePage={navigateTo}
            taskProgress={taskProgress}
            updateTaskProgress={updateTaskProgress}
            onClaimLevel={onClaimLevel}
            isDailyRewardModalOpen={showRewardModal}
          />
        );
      case "quest":
        return (
          <QuestHub
            {...pageProps}
            onMissionComplete={onMissionComplete}
            activeTab={activeQuestTab}
            setActiveTab={setActiveQuestTab}
            missionStreak={missionStreak}
            setMissionStreak={setMissionStreak}
            setFreeSpins={setFreeSpins}
            setHappiness={setHappiness}
            addNotification={addNotification}
          />
        );
      case "championship":
        return (
          <Championship
            {...pageProps}
            petStage={petStage}
            milestones={milestonesData}
            claimedMilestones={claimedMilestones}
            claimableMilestones={claimableMilestones}
            taskProgress={taskProgress}
            updateTaskProgress={updateTaskProgress}
            onClaimLevel={onClaimLevel}
            makeMilestoneClaimable={makeMilestoneClaimable}
            onMissionComplete={onMissionComplete}
            missionStreak={missionStreak}
            setMissionStreak={setMissionStreak}
            setFreeSpins={setFreeSpins}
            setHappiness={setHappiness}
            addNotification={addNotification}
          />
        );
      case "shop":
        return (
          <Shop
            {...pageProps}
            coins={coins}
            ownedItems={ownedItems}
            onPurchase={handlePurchase}
          />
        );
      case "loyaltyExchange":
        return (
          <LoyaltyExchangePage
            {...pageProps}
            loyaltyPoints={loyaltyPoints}
            coins={coins}
            onExchange={handleLoyaltyExchange}
          />
        );
      case "avatar":
        return (
          <Avatar
            xp={xp}
            currentLevel={currentLevel}
            petStage={petStage}
            xpProgressInLevel={xpProgressInLevel}
            totalXpForLevel={totalXpForLevel}
            happiness={happiness}
            setHappiness={setHappiness}
            {...pageProps}
          />
        );
      case "treasure":
        return (
          <TreasurePage
            {...pageProps}
            coins={coins}
            setCoins={setCoins}
            xp={xp}
            addXp={addXp}
            onPurchase={handlePurchase}
            freeSpins={freeSpins}
            setFreeSpins={setFreeSpins}
          />
        );
      case "profile":
        return (
          <Profile
            {...pageProps}
            petName={petName}
            avatar={selectedAvatar}
            level={currentLevel}
            xp={xp}
            coins={coins}
            onViewAllAchievements={navigateToQuestAchievements}
            onViewAllActivity={navigateToActivityLog}
            onInvite={navigateToReferral}
          />
        );
      case "activity":
        return <ActivityLogPage {...pageProps} />;
      case "achievements":
        return (
          <QuestHub
            {...pageProps}
            onMissionComplete={onMissionComplete}
            activeTab={"achievements"}
            setActiveTab={setActiveQuestTab}
            missionStreak={missionStreak}
            setMissionStreak={setMissionStreak}
            setFreeSpins={setFreeSpins}
            setHappiness={setHappiness}
            addNotification={addNotification}
            achievementsOnly={true}
          />
        );
      case "referral":
        return <ReferralPage {...pageProps} />;
      case "leaderboard":
        return <Leaderboard {...pageProps} />;
      case "halloffame":
        return <HallOfFame {...pageProps} />;
      case "events":
        return <Events {...pageProps} />;
      case "dailySpinGame":
        return <DailySpinGame {...pageProps} setCoins={setCoins} />;
      case "teamUpChallenge":
        return <TeamUpChallenge {...pageProps} />;
      case "summerFestival":
        return <SummerFestival {...pageProps} />;
      case "notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            onBack={navigateBack}
            onNavigate={(notification) => {
              markNotificationAsRead(notification.id);
              if (notification.link) {
                navigateTo(notification.link);
              }
            }}
            onMarkAllRead={markAllNotificationsAsRead}
            onClearAll={clearAllNotifications}
          />
        );
      default:
        return (
          <Profile
            {...pageProps}
            petName={petName}
            avatar={selectedAvatar}
            level={currentLevel}
            xp={xp}
            coins={coins}
            onViewAllAchievements={navigateToQuestAchievements}
            onViewAllActivity={navigateToActivityLog}
            onInvite={navigateToReferral}
          />
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      {showRewardModal && <DailyRewardModal onClaim={handleClaimReward} />}
      <PetRewardToast reward={petReward} />
      <MilestoneRewardModal
        milestone={showMilestoneModal}
        onClaim={handleClaimMilestoneReward}
      />

      <Header
        coins={coins}
        onAvatarClick={() => navigateTo("profile")}
        notificationCount={unreadCount}
        onNotificationsClick={() => navigateTo("notifications")}
        onAddCoinsClick={() => navigateTo("loyaltyExchange")}
      />
      <main
        className={`flex-grow overflow-y-auto no-scrollbar ${
          activePage !== "championship" &&
          activePage !== "dailySpinGame" &&
          activePage !== "summerFestival"
            ? "pt-20"
            : ""
        } ${activePage === "home" ? "bg-cover bg-center" : "bg-background"}`}
        style={
          activePage === "home"
            ? {
                backgroundImage:
                  "url('https://ik.imagekit.io/erriqyxye/Ipay%20RFP/390%20x%20800.jpg?updatedAt=1756152557533')",
              }
            : {}
        }
      >
        {renderPage()}
      </main>
      <BottomNav
        activePage={activePage}
        setActivePage={(page) => navigateTo(page, { isBottomNav: true })}
      />
    </div>
  );
};

export default MainPlatform;
