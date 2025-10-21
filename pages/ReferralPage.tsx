import React, { useState } from "react";
import {
  ClipboardCopyIcon,
  LeftArrowIcon,
  UsersIcon,
} from "../components/icons";
import { PageProps } from "../types";

const ReferralPage: React.FC<PageProps> = ({ setActivePage, onBack }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = "JUNGLE-JOURNEY-123";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="p-4 text-text-primary relative h-full flex flex-col">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 p-2 -ml-2 rounded-full hover:bg-gray-200"
        aria-label="Back to profile"
      >
        <LeftArrowIcon className="w-6 h-6 text-text-primary" />
      </button>
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <UsersIcon className="w-24 h-24 text-primary mb-4" />
        <h1 className="text-3xl font-extrabold text-primary mb-2">
          Refer & Earn
        </h1>
        <p className="text-text-secondary max-w-xs mb-8">
          Invite your friends to join the Jungle Journey and you'll both receive{" "}
          <span className="font-bold text-text-primary">500 Coins</span> and{" "}
          <span className="font-bold text-text-primary">100 XP</span>!
        </p>

        <div className="w-full max-w-xs">
          <p className="text-sm text-text-secondary mb-2">
            Your unique referral code:
          </p>
          <div className="relative bg-primary-light border-2 border-dashed border-primary/40 rounded-lg p-4 flex items-center justify-center">
            <span className="text-secondary-action-dark font-mono text-2xl tracking-widest">
              {referralCode}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="w-full mt-4 bg-primary text-text-inverse font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:bg-primary-hover transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ClipboardCopyIcon className="w-6 h-6" />
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReferralPage;
