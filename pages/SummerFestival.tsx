import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { PageInfoModal } from "../components/PlatformPages";
import {
  CheckIcon,
  CoinIcon,
  DiceIcon,
  InfoIcon,
  LockIcon,
  MissionIcon,
  StarIcon,
  XIcon,
  XPIcon,
} from "../components/icons";
import { MilestoneData, MilestoneTaskDef, PageProps } from "../types";

// --- Summer Festival Data ---
const summerFestivalMilestones: MilestoneData[] = [
  {
    level: 1,
    name: "Beach Day Bonanza",
    tasks: [{ id: "sf1-1", description: "Play 3 games", target: 3 }],
    reward: { coins: 50, xp: 50 },
  },
  {
    level: 2,
    name: "Ice Cream Social",
    tasks: [{ id: "sf2-1", description: "Spend 200 Coins", target: 200 }],
    reward: { freeSpins: 1 },
  },
  {
    level: 3,
    name: "Tiki Torch Trials",
    tasks: [{ id: "sf3-1", description: "Win a PvP Match", target: 1 }],
    reward: { coins: 150 },
  },
  {
    level: 4,
    name: "Sunset Celebration",
    tasks: [
      { id: "sf4-1", description: "Complete 5 daily missions", target: 5 },
    ],
    reward: { xp: 200 },
  },
  {
    level: 5,
    name: "Fireworks Finale",
    tasks: [
      {
        id: "sf5-1",
        description: "Reach top 50 in any leaderboard",
        target: 1,
      },
    ],
    reward: { coins: 500, special: <p>Exclusive Summer '25 Badge</p> },
  },
];

// --- Helper Components ---
const ModalTaskItem: React.FC<{ task: MilestoneTaskDef; progress: number }> = ({
  task,
  progress,
}) => {
  const progressPercent =
    task.target > 0
      ? Math.min((progress / task.target) * 100, 100)
      : progress > 0
      ? 100
      : 0;
  const isCompleted = progressPercent >= 100;

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-1">
        <p
          className={`text-sm font-semibold ${
            isCompleted
              ? "text-text-secondary line-through"
              : "text-text-primary"
          }`}
        >
          {task.description}
        </p>
        {isCompleted && (
          <CheckIcon className="w-5 h-5 text-success flex-shrink-0" />
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${
            isCompleted ? "bg-success" : "bg-yellow-500"
          } h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-right text-text-secondary mt-1">
        {Math.min(progress, task.target).toLocaleString()} /{" "}
        {task.target.toLocaleString()}
      </p>
    </div>
  );
};

const RewardItem: React.FC<{
  icon: React.ReactNode;
  label: string | React.ReactNode;
}> = ({ icon, label }) => (
  <div className="bg-background rounded-lg p-3 flex items-center space-x-3">
    <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
    <span className="font-bold text-text-primary">{label}</span>
  </div>
);

const MilestoneDetailModal: React.FC<{
  milestone: MilestoneData;
  onClose: () => void;
  taskProgress: Record<string, number>;
  setActivePage: (page: string) => void;
}> = ({ milestone, onClose, taskProgress, setActivePage }) => {
  const { reward } = milestone;
  const hasRewards =
    reward.coins || reward.freeSpins || reward.xp || reward.special;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-surface rounded-2xl p-5 text-text-primary w-full max-w-sm border-2 border-yellow-500"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-yellow-500">
              {milestone.name}
            </h2>
            <p className="font-bold text-text-secondary">
              Festival Milestone {milestone.level}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 -mr-2 -mt-1 rounded-full hover:bg-gray-200"
          >
            <XIcon className="w-6 h-6 text-text-primary" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-lg text-text-primary mb-2">
            Tasks to Complete
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2 -mr-2 no-scrollbar border-t border-b border-divider py-1">
            {milestone.tasks.map((task) => (
              <ModalTaskItem
                key={task.id}
                task={task}
                progress={taskProgress[task.id] || 0}
              />
            ))}
          </div>
        </div>

        {hasRewards && (
          <div>
            <h3 className="font-bold text-lg text-text-primary mb-2">
              Completion Rewards
            </h3>
            <div className="space-y-2">
              {reward.coins && (
                <RewardItem
                  icon={<CoinIcon className="w-6 h-6 text-primary" />}
                  label={`${reward.coins.toLocaleString()} Coins`}
                />
              )}
              {reward.xp && (
                <RewardItem
                  icon={<XPIcon className="w-6 h-6" />}
                  label={`${reward.xp.toLocaleString()} XP`}
                />
              )}
              {reward.freeSpins && (
                <RewardItem
                  icon={<DiceIcon className="w-6 h-6 text-warning" />}
                  label={`${reward.freeSpins} Free Treasure Spin`}
                />
              )}
              {reward.special && (
                <RewardItem
                  icon={<StarIcon className="w-6 h-6 text-yellow-500" />}
                  label={reward.special}
                />
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => {
            setActivePage("quest");
            onClose();
          }}
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <MissionIcon className="w-5 h-5" />
          <span>View Quests</span>
        </button>
      </motion.div>
    </div>
  );
};

const MilestoneCard: React.FC<{
  milestone: MilestoneData;
  status: "completed" | "active" | "locked";
  side: "left" | "right";
  onClick: () => void;
}> = ({ milestone, status, side, onClick }) => {
  return (
    <div
      className={`relative w-full flex ${
        side === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`w-1/2 flex ${
          side === "left" ? "justify-end pr-8" : "justify-start pl-8"
        }`}
      >
        <div
          onClick={onClick}
          className={`relative text-white p-4 rounded-xl w-48 transition-all duration-300 backdrop-blur-sm border-2 cursor-pointer hover:scale-105 hover:border-white
                    ${
                      status === "completed"
                        ? "bg-green-500/30 border-green-400"
                        : status === "active"
                        ? "bg-yellow-500/30 border-yellow-400"
                        : "bg-black/30 border-white/20"
                    }`}
        >
          <h3 className="font-extrabold text-lg">{milestone.name}</h3>
          <p
            className={`text-xs font-bold mb-3 ${
              status === "completed" ? "text-green-300" : "text-yellow-300/80"
            }`}
          >
            Milestone {milestone.level}
          </p>

          {status === "locked" && (
            <div className="text-center py-4">
              {" "}
              <LockIcon className="w-8 h-8 mx-auto text-white/50" />{" "}
              <p className="text-sm mt-2 text-white/60">
                Complete previous step
              </p>{" "}
            </div>
          )}
          {status === "completed" && (
            <div className="text-center py-4 flex items-center justify-center space-x-2">
              {" "}
              <CheckIcon className="w-8 h-8 text-green-300" />{" "}
              <span className="font-bold text-green-300">Completed</span>{" "}
            </div>
          )}
          {status === "active" && (
            <div className="text-center py-4">
              {" "}
              <p className="text-sm text-white/80">
                Click to view tasks and claim your reward!
              </p>{" "}
            </div>
          )}
        </div>
      </div>
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          side === "left"
            ? "right-1/2 translate-x-1/2"
            : "left-1/2 -translate-x-1/2"
        } w-6 h-6 rounded-full border-4 transition-colors duration-500 
                ${
                  status === "active"
                    ? "border-yellow-300 bg-white animate-pulse"
                    : status === "completed"
                    ? "border-green-400 bg-green-400"
                    : "border-white/30 bg-white/20"
                }`}
      ></div>
    </div>
  );
};

const SummerFestival: React.FC<PageProps> = ({ setActivePage, onBack }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneData | null>(null);

  // For demonstration, we'll manage progress state locally.
  const [claimedMilestones] = useState<Set<number>>(new Set([1]));
  const [taskProgress] = useState<Record<string, number>>({
    "sf2-1": 150,
    "sf4-1": 2,
  });

  useEffect(() => {
    const visitedPages = JSON.parse(
      localStorage.getItem("visitedPages") || "{}"
    );
    if (!visitedPages.summerFestival) {
      setShowInfo(true);
      visitedPages.summerFestival = true;
      localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
    }
  }, []);

  const activeLevel = summerFestivalMilestones.find(
    (m) => !claimedMilestones.has(m.level)
  )?.level;
  const completedCount = summerFestivalMilestones.filter((m) =>
    claimedMilestones.has(m.level)
  ).length;
  const progressPercentage =
    completedCount > 1
      ? ((completedCount - 1) / (summerFestivalMilestones.length - 1)) * 100
      : 0;

  return (
    <div
      className="h-full w-full bg-cover bg-center overflow-y-auto no-scrollbar"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2003_11_44%20PM.png?updatedAt=1756439461128')",
      }}
    >
      <AnimatePresence>
        {selectedMilestone && (
          <MilestoneDetailModal
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
            taskProgress={taskProgress}
            setActivePage={setActivePage}
          />
        )}
      </AnimatePresence>
      {showInfo && (
        <PageInfoModal
          title="Summer Festival"
          onClose={() => setShowInfo(false)}
        >
          <p>
            The sun is high and the rewards are hot! Welcome to the Summer
            Festival, a seasonal bash featuring a unique progression map filled
            with sun-drenched challenges and exclusive, limited-time loot.
          </p>
          <p className="mt-2">
            Make your way through the festival milestones to unlock rare items,
            huge currency bonuses, and the coveted Summer '25 Badge. Don't miss
            the biggest party of the year!
          </p>
        </PageInfoModal>
      )}

      <div className="pt-20 text-white relative">
        {/* Header section */}
        <div className="relative flex items-center justify-center h-10 px-4 mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={onBack}
              className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          <h1 className="text-3xl font-extrabold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Summer Festival
          </h1>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => setShowInfo(true)}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors"
              aria-label="Page Information"
            >
              <InfoIcon className="w-6 h-6 text-text-inverse" />
            </button>
          </div>
        </div>

        {/* Map content */}
        <div className="relative flex flex-col items-center space-y-8 py-4 px-4">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-white/30 rounded-full">
            <div
              className="w-full bg-yellow-500 transition-all duration-700 ease-out rounded-full"
              style={{ height: `${progressPercentage}%` }}
            ></div>
          </div>

          {summerFestivalMilestones.map((milestone, index) => {
            const isClaimed = claimedMilestones.has(milestone.level);
            const status = isClaimed
              ? "completed"
              : milestone.level === activeLevel
              ? "active"
              : "locked";
            return (
              <MilestoneCard
                key={milestone.level}
                milestone={milestone}
                status={status}
                side={index % 2 === 0 ? "left" : "right"}
                onClick={() => setSelectedMilestone(milestone)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummerFestival;
