import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { InfoButton, PageInfoModal } from "../components/PlatformPages";
import {
  CashIcon,
  CheckIcon,
  CoinIcon,
  DiceIcon,
  LockIcon,
  MissionIcon,
  XIcon,
  XPIcon,
} from "../components/icons";
import { MilestoneData, MilestoneTaskDef, PageProps } from "../types";

// --- Helper Components for Modal ---
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
            isCompleted ? "bg-success" : "bg-primary"
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

const RewardItem: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
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
  onNavigateToQuestsTab?: () => void;
}> = ({
  milestone,
  onClose,
  taskProgress,
  setActivePage,
  onNavigateToQuestsTab,
}) => {
  const { reward } = milestone;
  const hasRewards =
    reward.coins || reward.cashback || reward.freeSpins || reward.xp;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-surface rounded-2xl p-5 text-text-primary w-full max-w-sm border-2 border-primary"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">
              {milestone.name}
            </h2>
            <p className="font-bold text-text-secondary">
              Level {milestone.level}
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
            {milestone.tasks.length > 0 ? (
              milestone.tasks.map((task) => (
                <ModalTaskItem
                  key={task.id}
                  task={task}
                  progress={taskProgress[task.id] || 0}
                />
              ))
            ) : (
              <p className="text-text-secondary text-sm py-4 text-center">
                No specific tasks for this milestone.
              </p>
            )}
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
              {reward.cashback && (
                <RewardItem
                  icon={<CashIcon className="w-6 h-6 text-success" />}
                  label={`BDT ${reward.cashback.toLocaleString()} Cashback`}
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
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (onNavigateToQuestsTab) {
              onNavigateToQuestsTab();
            } else {
              setActivePage("quest");
            }
            onClose();
          }}
          className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <MissionIcon className="w-5 h-5" />
          <span>View Quests</span>
        </button>
      </motion.div>
    </div>
  );
};

// --- RewardMap Page (Home) ---
interface RewardMapProps extends PageProps {
  milestones: MilestoneData[];
  claimedMilestones: Set<number>;
  taskProgress: Record<string, number>;
  updateTaskProgress: (taskId: string, newProgress: number) => void;
  onClaimLevel: (level: number) => void;
  isDailyRewardModalOpen: boolean;
  onNavigateToQuestsTab?: () => void;
  hideInfoButton?: boolean;
  title?: string;
}

const TaskItem: React.FC<{
  task: MilestoneTaskDef;
  progress: number;
  onSimulate: () => void;
}> = ({ task, progress, onSimulate }) => {
  const progressPercent =
    task.target > 0
      ? Math.min((progress / task.target) * 100, 100)
      : progress > 0
      ? 100
      : 0;
  const isCompleted = progressPercent >= 100;

  return (
    <div className="text-left">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-semibold text-white/90">
          {task.description}
        </p>
        {!isCompleted && (
          <button
            onClick={onSimulate}
            className="text-xs bg-white/20 hover:bg-white/40 text-white font-bold py-0.5 px-2 rounded-md"
          >
            Simulate
          </button>
        )}
      </div>
      <div className="w-full bg-black/30 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out flex items-center justify-end"
          style={{ width: `${progressPercent}%` }}
        >
          {isCompleted && <CheckIcon className="w-4 h-4 text-white -mr-1" />}
        </div>
      </div>
      <p className="text-xs text-right text-white/70 mt-1">
        {Math.min(progress, task.target).toLocaleString()} /{" "}
        {task.target.toLocaleString()}
      </p>
    </div>
  );
};

const MilestoneCard: React.FC<{
  milestone: MilestoneData;
  status: "completed" | "active" | "locked";
  side: "left" | "right";
  taskProgress: Record<string, number>;
  updateTaskProgress: (taskId: string, newProgress: number) => void;
  onClaimLevel: (level: number) => void;
  onClick: () => void;
}> = ({
  milestone,
  status,
  side,
  taskProgress,
  updateTaskProgress,
  onClaimLevel,
  onClick,
}) => {
  const areAllTasksComplete = milestone.tasks.every((task) => {
    const progress = taskProgress[task.id] || 0;
    const target = task.target > 0 ? task.target : 1;
    return progress >= target;
  });

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
                        ? "bg-primary/30 border-primary"
                        : "bg-black/30 border-white/20"
                    }`}
        >
          <h3 className="font-extrabold text-lg">{milestone.name}</h3>
          <p
            className={`text-xs font-bold mb-3 ${
              status === "completed" ? "text-green-300" : "text-primary/80"
            }`}
          >
            Level {milestone.level}
          </p>

          {status === "active" && milestone.tasks.length > 0 && (
            <div className="space-y-3">
              {milestone.tasks.slice(0, 1).map(
                (
                  task // Show only the first task as a teaser
                ) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    progress={taskProgress[task.id] || 0}
                    onSimulate={() => updateTaskProgress(task.id, task.target)}
                  />
                )
              )}
            </div>
          )}

          {status === "locked" && (
            <div className="text-center py-4">
              <LockIcon className="w-8 h-8 mx-auto text-white/50" />
              <p className="text-sm mt-2 text-white/60">
                Complete previous level to unlock
              </p>
            </div>
          )}

          {status === "completed" && (
            <div className="text-center py-4 flex items-center justify-center space-x-2">
              <CheckIcon className="w-8 h-8 text-green-300" />
              <span className="font-bold text-green-300">Completed</span>
            </div>
          )}

          {status === "active" && areAllTasksComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening when claiming
                onClaimLevel(milestone.level);
              }}
              className="w-full mt-4 bg-primary hover:bg-primary-hover text-white font-bold py-2 rounded-lg transition-colors"
            >
              Claim Reward
            </button>
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

const RewardMap: React.FC<RewardMapProps> = ({
  milestones,
  claimedMilestones,
  setActivePage,
  taskProgress,
  updateTaskProgress,
  onClaimLevel,
  isDailyRewardModalOpen,
  onNavigateToQuestsTab,
  hideInfoButton,
  title,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneData | null>(null);

  const activeLevel = milestones?.find(
    (m) => !claimedMilestones.has(m.level)
  )?.level;

  const completedCount = milestones?.filter((m) =>
    claimedMilestones.has(m.level)
  ).length;
  const progressPercentage =
    completedCount > 1
      ? ((completedCount - 1) / (milestones?.length - 1)) * 100
      : 0;

  return (
    <div className="p-4 text-white relative">
      <AnimatePresence>
        {selectedMilestone && (
          <MilestoneDetailModal
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
            taskProgress={taskProgress}
            setActivePage={setActivePage}
            onNavigateToQuestsTab={onNavigateToQuestsTab}
          />
        )}
      </AnimatePresence>
      {showInfo && (
        <PageInfoModal
          title="Champion's Journey"
          onClose={() => setShowInfo(false)}
        >
          <p>
            Embark on the Champion's Journey! This is your epic saga, a winding
            path from a hopeful newcomer to a celebrated legend.
          </p>
          <p className="mt-2">
            Each milestone is a testament to your skill and dedication. Conquer
            the challenges within each level to unlock treasure chests of Coins,
            bursts of XP, and exclusive items, paving your way to greatness.
          </p>
          <p className="mt-2">
            This map charts your legacy. Tap a milestone to discover your next
            heroic quest!
          </p>
        </PageInfoModal>
      )}
      {!hideInfoButton && <InfoButton onClick={() => setShowInfo(true)} />}
      <h1 className="text-3xl font-extrabold text-center mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
        {title || "Champion's Journey"}
      </h1>

      <div className="relative flex flex-col items-center space-y-8 py-4">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-white/30 rounded-full">
          <div
            className="w-full bg-primary transition-all duration-700 ease-out rounded-full"
            style={{ height: `${progressPercentage}%` }}
          ></div>
        </div>

        {milestones?.map((milestone, index) => {
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
              taskProgress={taskProgress}
              updateTaskProgress={updateTaskProgress}
              onClaimLevel={onClaimLevel}
              onClick={() => setSelectedMilestone(milestone)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RewardMap;
