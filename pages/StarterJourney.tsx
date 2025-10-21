import React, { useState } from "react";
import { BackButton } from "../components/PlatformPages";
import { MilestoneData, Notification, PageProps } from "../types";
import QuestHub from "./QuestHub";
import RewardMap from "./RewardMap";

// Passing through a lot of props from MainPlatform
interface StarterJourneyProps extends PageProps {
  // RewardMap props
  milestones: MilestoneData[];
  claimedMilestones: Set<number>;
  taskProgress: Record<string, number>;
  updateTaskProgress: (taskId: string, newProgress: number) => void;
  onClaimLevel: (level: number) => void;
  isDailyRewardModalOpen: boolean;

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

const StarterJourney: React.FC<StarterJourneyProps> = (props) => {
  const { onBack, setActivePage } = props;
  const [activeTab, setActiveTab] = useState<"journey" | "quests">("journey");

  // QuestHub internal state management
  const [activeQuestHubTab, setActiveQuestHubTab] = useState<
    "missions" | "achievements"
  >("missions");

  return (
    <div className="relative h-full flex flex-col bg-background">
      <div className="p-4 bg-background flex-shrink-0">
        <div className="relative flex items-center justify-center">
          <BackButton onClick={onBack!} />
          <h1 className="text-2xl font-extrabold text-center">
            Starter Journey
          </h1>
        </div>
        <div className="w-full bg-gray-200 rounded-xl p-1.5 flex mt-4">
          <button
            onClick={() => setActiveTab("journey")}
            className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "journey"
                ? "bg-primary text-text-inverse"
                : "text-text-secondary"
            }`}
          >
            Journey
          </button>
          <button
            onClick={() => setActiveTab("quests")}
            className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "quests"
                ? "bg-primary text-text-inverse"
                : "text-text-secondary"
            }`}
          >
            Quests
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar">
        {activeTab === "journey" && (
          <div
            className="bg-cover bg-center h-full"
            style={{
              backgroundImage:
                "url('https://ik.imagekit.io/erriqyxye/Ipay%20RFP/390%20x%20800.jpg?updatedAt=1756152557533')",
            }}
          >
            <RewardMap
              milestones={props.milestones}
              claimedMilestones={props.claimedMilestones}
              setActivePage={setActivePage}
              taskProgress={props.taskProgress}
              updateTaskProgress={props.updateTaskProgress}
              onClaimLevel={props.onClaimLevel}
              isDailyRewardModalOpen={props.isDailyRewardModalOpen}
            />
          </div>
        )}
        {activeTab === "quests" && (
          <QuestHub
            onBack={onBack}
            setActivePage={setActivePage}
            onMissionComplete={props.onMissionComplete}
            activeTab={activeQuestHubTab}
            setActiveTab={setActiveQuestHubTab}
            missionStreak={props.missionStreak}
            setMissionStreak={props.setMissionStreak}
            setFreeSpins={props.setFreeSpins}
            setHappiness={props.setHappiness}
            addNotification={props.addNotification}
            forcedCategory="starter"
          />
        )}
      </div>
    </div>
  );
};

export default StarterJourney;
