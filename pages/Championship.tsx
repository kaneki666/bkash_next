import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  InfoIcon,
  LeftArrowIcon,
  LockIcon,
  RightArrowIcon,
} from "../components/icons";
import { BackButton, PageInfoModal } from "../components/PlatformPages";
import { MilestoneData, Notification, PageProps, PetStage } from "../types";
import Leaderboard from "./Leaderboard";
import QuestHub from "./QuestHub";
import RewardMap from "./RewardMap";

const IslandCard: React.FC<{ island: any; onSelect: () => void }> = ({
  island,
  onSelect,
}) => {
  return (
    <div className="flex-shrink-0 w-full flex flex-col items-center justify-center text-center">
      <div className="relative">
        {/* The wrapping div is kept for the relative positioning of the lock icon */}
        <div
          className={`${island.locked ? "text-text-disabled" : "text-primary"}`}
        >
          {island.icon}
        </div>
        {island.locked && (
          <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
            <LockIcon className="w-12 h-12 text-white" />
          </div>
        )}
      </div>
      <h2 className="mt-4 text-2xl font-bold">{island.name}</h2>
      <button
        onClick={onSelect}
        disabled={island.locked}
        className="mt-4 bg-primary text-text-inverse font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:bg-primary-hover transform hover:scale-105 transition-all duration-300 disabled:bg-disabled-fill disabled:text-text-disabled disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {island.locked ? "Locked" : "Select"}
      </button>
    </div>
  );
};

interface ChampionshipProps extends PageProps {
  petStage: PetStage;
  // RewardMap props
  milestones: MilestoneData[];
  claimedMilestones: Set<number>;
  claimableMilestones: Set<number>;
  taskProgress: Record<string, number>;
  updateTaskProgress: (taskId: string, newProgress: number) => void;
  onClaimLevel: (level: number) => void;
  makeMilestoneClaimable: (level: number) => void;

  // QuestHub props
  onMissionComplete: () => void;
  missionStreak: number;
  setMissionStreak: (updater: (prevStreak: number) => number) => void;
  setFreeSpins: (updater: (prevSpins: number) => number) => void;
  setHappiness: (updater: (prev: number) => number) => void;
  addNotification: (
    message: string,
    type: Notification["type"],
    link?: string
  ) => void;
}

const Championship: React.FC<ChampionshipProps> = (props) => {
  const { setActivePage, petStage, addNotification } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedIslandId, setSelectedIslandId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showIslandInfo, setShowIslandInfo] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "journey" | "quests" | "leaderboard"
  >("journey");
  const [activeQuestHubTab, setActiveQuestHubTab] = useState<
    "missions" | "achievements"
  >("missions");

  const petStageOrder: PetStage[] = [
    "Baby Cub",
    "Young Cub",
    "Teen Lion",
    "Adult Lion",
    "Legendary Lion",
  ];
  const currentStageIndex = petStageOrder.indexOf(petStage);

  const islands = [
    {
      id: "starter",
      name: "Starter Level",
      icon: (
        <img
          src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_58_54%20PM.png?updatedAt=1756276273013"
          alt="Starter Level"
          className="w-24 h-24"
        />
      ),
      locked: false,
    },
    {
      id: "rookie",
      name: "Rookie Level",
      icon: (
        <img
          src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_59_01%20PM.png?updatedAt=1756276271064"
          alt="Rookie Level"
          className="w-24 h-24"
        />
      ),
      locked: currentStageIndex < 1,
    },
    {
      id: "conqueror",
      name: "Conqueror Level",
      icon: (
        <img
          src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_59_14%20PM.png?updatedAt=1756276272635"
          alt="Conqueror Level"
          className="w-24 h-24"
        />
      ),
      locked: currentStageIndex < 2,
    },
    {
      id: "legend",
      name: "Legendary Level",
      icon: (
        <img
          src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2025,%202025,%2011_27_18%20PM.png?updatedAt=1756150921577"
          alt="Legendary Level"
          className="w-24 h-24"
        />
      ),
      locked: currentStageIndex < 3,
    },
  ];

  useEffect(() => {
    const visitedPages = JSON.parse(
      localStorage.getItem("visitedPages") || "{}"
    );

    if (selectedIslandId) {
      // We are in an island view
      if (!visitedPages.islandView) {
        setShowIslandInfo(true);
        visitedPages.islandView = true;
        localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
      }
    } else {
      // We are in the main championship selection view
      if (!visitedPages.championship) {
        setShowInfo(true);
        visitedPages.championship = true;
        localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
      }
    }
  }, [selectedIslandId]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % islands.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + islands.length) % islands.length);
  };

  const handleSelect = () => {
    const selectedIsland = islands[currentIndex];
    if (!selectedIsland.locked) {
      setSelectedIslandId(selectedIsland.id);
    }
  };

  React.useEffect(() => {
    if (activeTab === "journey" && selectedIslandId === "starter") {
      const claimableLevels = Array.from(props.claimableMilestones);
      if (claimableLevels.length > 0) {
        const nextToClaim = Math.min(...claimableLevels);
        props.onClaimLevel(nextToClaim);
      }
    }
  }, [
    activeTab,
    selectedIslandId,
    props.claimableMilestones,
    props.onClaimLevel,
  ]);

  const handleIslandMissionComplete = () => {
    // First, run the original logic to grant XP etc.
    props.onMissionComplete();

    // Now, check if we are on the starter island to progress the map
    if (selectedIslandId === "starter") {
      // Find the next unclaimed and not-yet-claimable milestone
      const nextMilestone = props.milestones
        .filter(
          (m) =>
            !props.claimedMilestones.has(m.level) &&
            !props.claimableMilestones.has(m.level)
        )
        .sort((a, b) => a.level - b.level)[0];

      if (nextMilestone) {
        // Mark it as claimable, but don't show the modal yet
        props.makeMilestoneClaimable(nextMilestone.level);
      }
    }
  };

  if (selectedIslandId) {
    const island = islands.find((i) => i.id === selectedIslandId);

    let journeyTitle = "Champion Map";
    let journeyBg =
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/390%20x%20800.jpg?updatedAt=1756152557533";

    if (selectedIslandId === "starter") {
      journeyTitle = "Starter Journey";
      journeyBg =
        "https://ik.imagekit.io/erriqyxye/Bkash/Group%202.png?updatedAt=1756315177210";
    } else if (selectedIslandId === "rookie") {
      journeyTitle = "Rookie Journey";
      journeyBg =
        "https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2001_24_01%20PM.jpg?updatedAt=1756277773378";
    }

    return (
      <div className="relative h-full flex flex-col bg-background pt-20">
        <AnimatePresence>
          {showIslandInfo && (
            <PageInfoModal
              title={island?.name || "Level Hub"}
              onClose={() => setShowIslandInfo(false)}
            >
              <p className="font-bold">
                You have arrived! Each level is a domain of distinct challenges
                and rewards. Master its three core pillars to claim victory:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>
                  <strong>Journey:</strong> Follow the level's unique story
                  path, completing milestones to earn huge, one-time rewards.
                </li>
                <li>
                  <strong>Quests:</strong> Take on level-specific missions to
                  gather a steady stream of XP and Coins.
                </li>
                <li>
                  <strong>Leaderboard:</strong> Ascend the ranks to dominate the
                  level's leaderboard and seize the ultimate prizes.
                </li>
              </ul>
            </PageInfoModal>
          )}
        </AnimatePresence>
        <div className="p-4 bg-background flex-shrink-0">
          <div className="relative flex items-center justify-center h-10">
            <BackButton
              onClick={() => {
                setSelectedIslandId(null);
                setActiveTab("journey");
              }}
            />
            <h1 className="text-2xl font-bold text-text-primary text-center">
              {island?.name}
            </h1>
            <button
              onClick={() => setShowIslandInfo(true)}
              aria-label="Page Information"
              className="absolute right-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <InfoIcon className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-xl p-1.5 flex mt-4">
            <button
              onClick={() => setActiveTab("journey")}
              className={`w-1/3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                activeTab === "journey"
                  ? "bg-primary text-text-inverse"
                  : "text-text-secondary"
              }`}
            >
              Journey
            </button>
            <button
              onClick={() => setActiveTab("quests")}
              className={`w-1/3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                activeTab === "quests"
                  ? "bg-primary text-text-inverse"
                  : "text-text-secondary"
              }`}
            >
              Quests
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`w-1/3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                activeTab === "leaderboard"
                  ? "bg-primary text-text-inverse"
                  : "text-text-secondary"
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          {activeTab === "journey" && (
            <div
              className="bg-cover bg-center min-h-full"
              style={{ backgroundImage: `url(${journeyBg})` }}
            >
              <RewardMap
                title={journeyTitle}
                milestones={props.milestones}
                claimedMilestones={props.claimedMilestones}
                setActivePage={setActivePage}
                taskProgress={props.taskProgress}
                updateTaskProgress={props.updateTaskProgress}
                onClaimLevel={props.onClaimLevel}
                isDailyRewardModalOpen={false}
                onNavigateToQuestsTab={() => setActiveTab("quests")}
                hideInfoButton={true}
              />
            </div>
          )}
          {activeTab === "quests" && (
            <QuestHub
              onBack={() => setSelectedIslandId(null)}
              setActivePage={setActivePage}
              onMissionComplete={handleIslandMissionComplete}
              activeTab={activeQuestHubTab}
              setActiveTab={setActiveQuestHubTab}
              missionStreak={props.missionStreak}
              setMissionStreak={props.setMissionStreak}
              setFreeSpins={props.setFreeSpins}
              setHappiness={props.setHappiness}
              addNotification={addNotification}
              forcedCategory={selectedIslandId as any}
            />
          )}
          {activeTab === "leaderboard" && (
            <div className="h-full">
              <Leaderboard
                setActivePage={setActivePage}
                onBack={() => setSelectedIslandId(null)}
                isTabbed={true}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 bg-background text-text-primary overflow-hidden pt-20">
      <AnimatePresence>
        {showInfo && (
          <PageInfoModal
            title="Championship Levels"
            onClose={() => setShowInfo(false)}
          >
            <p>
              Your grand adventure unfolds across the Championship Levels! This
              is your path to glory, a series of ever-more-challenging realms
              that unlock as your Pet evolves.
            </p>
            <p className="mt-2">
              Each level is a unique world with its own epic Journey,
              specialized Quests, and fierce Leaderboards. Grow your Pet,
              conquer the levels, and prove you are the ultimate champion.
            </p>
          </PageInfoModal>
        )}
      </AnimatePresence>

      <div className="flex justify-center items-center relative mb-8 flex-shrink-0">
        <h1 className="text-3xl font-extrabold text-text-primary">
          Championship Levels
        </h1>
        <button
          onClick={() => setShowInfo(true)}
          aria-label="Page Information"
          className="absolute right-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <InfoIcon className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <div className="w-full flex-grow flex items-center justify-center">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <LeftArrowIcon className="w-8 h-8 text-text-secondary" />
        </button>

        <div className="w-64 h-80 relative overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ x: direction * 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <IslandCard
                island={islands[currentIndex]}
                onSelect={handleSelect}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <RightArrowIcon className="w-8 h-8 text-text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default Championship;
