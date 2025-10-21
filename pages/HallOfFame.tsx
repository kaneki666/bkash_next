import React, { useState } from "react";
import { BackButton } from "../components/PlatformPages";
import { PageProps } from "../types";
import Achievements from "./Achievements";
import Leaderboard from "./Leaderboard";

const HallOfFame: React.FC<PageProps> = ({ setActivePage, onBack }) => {
  const [activeTab, setActiveTab] = useState("leaderboard");

  return (
    <div className="p-4 text-text-primary relative h-full flex flex-col">
      <BackButton onClick={onBack!} variant="dark" />
      <h1 className="text-3xl font-extrabold text-center mb-6">Hall of Fame</h1>

      <div className="w-full bg-gray-200 rounded-xl p-1.5 flex mb-6 flex-shrink-0">
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "leaderboard"
              ? "bg-primary text-text-inverse"
              : "text-text-secondary"
          }`}
        >
          Global Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "achievements"
              ? "bg-primary text-text-inverse"
              : "text-text-secondary"
          }`}
        >
          Achievements
        </button>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar -mx-4 px-4">
        {activeTab === "leaderboard" && (
          <Leaderboard
            setActivePage={setActivePage}
            onBack={onBack}
            isTabbed={true}
          />
        )}
        {activeTab === "achievements" && (
          <Achievements setActivePage={setActivePage} onBack={onBack} />
        )}
      </div>
    </div>
  );
};

export default HallOfFame;
