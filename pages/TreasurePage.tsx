import { AnimatePresence, motion, useAnimation } from "framer-motion";
import React, { useState } from "react";
import { BackButton } from "../components/PlatformPages";
import { CoinIcon, XPIcon } from "../components/icons";
import { PageProps } from "../types";

interface TreasurePageProps extends PageProps {
  coins: number;
  setCoins: (updater: (prevCoins: number) => number) => void;
  xp: number;
  addXp: (amount: number) => void;
  onPurchase: (itemId: number, cost: number) => void;
  freeSpins: number;
  setFreeSpins: (updater: (prevSpins: number) => number) => void;
}

type Prize = {
  type: "coin" | "xp" | "skin";
  value: number;
  label: string;
  itemId?: number;
  icon: React.ReactNode;
};

const PrizeWonModal: React.FC<{ prize: Prize | null; onClaim: () => void }> = ({
  prize,
  onClaim,
}) => {
  if (!prize) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm shadow-2xl shadow-primary/30"
        >
          <h2 className="text-3xl font-extrabold text-primary">You Won!</h2>
          <div className="my-6 bg-background rounded-lg p-4 flex flex-col items-center justify-center h-32">
            <div className="w-16 h-16 flex items-center justify-center">
              {prize.icon}
            </div>
            <p className="font-bold text-2xl text-text-primary mt-2">
              {prize.label}
            </p>
          </div>
          <button
            onClick={onClaim}
            className="w-full bg-primary text-text-inverse font-bold py-3 rounded-xl text-lg transform hover:scale-105 transition-transform"
          >
            Awesome!
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TreasurePage: React.FC<TreasurePageProps> = ({
  coins,
  setCoins,
  xp,
  addXp,
  onPurchase,
  setActivePage,
  onBack,
  freeSpins,
  setFreeSpins,
}) => {
  const prizes: Prize[] = React.useMemo(
    () => [
      {
        type: "coin",
        value: 100,
        label: "100 Coins",
        icon: <CoinIcon className="w-10 h-10 object-contain text-primary" />,
      },
      {
        type: "xp",
        value: 50,
        label: "50 XP",
        icon: <XPIcon className="w-10 h-10 object-contain text-warning" />,
      },
      {
        type: "skin",
        value: 2,
        label: "Sunflare Amulet",
        itemId: 2,
        icon: (
          <img
            src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2003_07_22%20AM.png?updatedAt=1756154279504"
            className="w-12 h-12 object-contain"
            alt="Sunflare Amulet skin"
          />
        ),
      },
      {
        type: "coin",
        value: 250,
        label: "250 Coins",
        icon: <CoinIcon className="w-10 h-10 object-contain text-primary" />,
      },
      {
        type: "xp",
        value: 200,
        label: "200 XP",
        icon: <XPIcon className="w-10 h-10 object-contain text-warning" />,
      },
      {
        type: "coin",
        value: 50,
        label: "50 Coins",
        icon: <CoinIcon className="w-10 h-10 object-contain text-primary" />,
      },
      {
        type: "skin",
        value: 6,
        label: "Shadowpelt Cloak",
        itemId: 6,
        icon: (
          <img
            src="https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_55_59%20AM.png?updatedAt=1756169499760"
            className="w-12 h-12 object-contain"
            alt="Shadowpelt Cloak skin"
          />
        ),
      },
      {
        type: "xp",
        value: 100,
        label: "100 XP",
        icon: <XPIcon className="w-10 h-10 object-contain text-warning" />,
      },
    ],
    []
  );

  const SPIN_COST = 50;
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;

    if (freeSpins > 0) {
      setFreeSpins((prev) => prev - 1);
    } else if (coins >= SPIN_COST) {
      setCoins((prev) => prev - SPIN_COST);
    } else {
      return;
    }

    setIsSpinning(true);
    setWonPrize(null);

    const winningPrizeIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[winningPrizeIndex];

    const segmentAngle = 360 / prizes.length;

    // The winning prize is at `winningPrizeIndex * segmentAngle`.
    // To make it land at the top (0 degrees), we rotate by its negative angle.
    const targetAngle = -(winningPrizeIndex * segmentAngle);

    // Add multiple full rotations and a small random offset for realism.
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const newRotation = currentRotation + 7 * 360 + targetAngle + randomOffset;

    setCurrentRotation(newRotation); // Save for the next spin

    controls.start({
      rotate: newRotation,
      transition: {
        duration: 6,
        ease: "easeOut",
      },
    });

    setTimeout(() => {
      if (prize.type === "coin") setCoins((prev) => prev + prize.value);
      else if (prize.type === "xp") addXp(prize.value);
      else if (prize.type === "skin" && prize.itemId)
        onPurchase(prize.itemId, 0);

      setWonPrize(prize);
      setIsSpinning(false);
    }, 6500); // Should be slightly longer than the animation duration
  };

  return (
    <div
      className="relative h-full flex flex-col items-center justify-between bg-cover bg-center text-text-inverse p-4 overflow-hidden"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Treasure%20BG.png?updatedAt=1755792945281')",
      }}
    >
      <AnimatePresence>
        {wonPrize && (
          <PrizeWonModal prize={wonPrize} onClaim={() => setWonPrize(null)} />
        )}
      </AnimatePresence>
      <BackButton onClick={onBack!} />

      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-black">Jungle Treasure</h1>
        <p className="text-primary font-semibold mt-1">
          Spin to win exclusive prizes!
        </p>
      </div>

      <div className="relative w-[340px] h-[340px] flex items-center justify-center">
        <motion.div className="absolute w-full h-full" animate={controls}>
          {/* Prize Pods Ring */}
          <div className="absolute w-full h-full">
            {prizes.map((prize, i) => {
              const angle = (i / prizes.length) * 360;
              return (
                <div
                  key={i}
                  className="absolute w-20 h-20 top-1/2 left-1/2 -mt-10 -ml-10"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-130px)`,
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <div className="w-full h-full bg-black/30 rounded-full flex items-center justify-center border-2 border-primary/50 p-1">
                      <div className="w-full h-full bg-secondary-action-dark/80 rounded-full flex items-center justify-center">
                        {prize.icon}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central spinning element */}
          <div className="absolute w-[220px] h-[220px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Spin_Wheel_Art.png?updatedAt=1755793894759')",
                backgroundSize: "cover",
              }}
            />
          </div>
        </motion.div>

        {/* Static Pointer */}
        <img
          src="https://ik.imagekit.io/erriqyxye/Mutant%20Axis/ChatGPT%20Image%20Aug%2022,%202025,%2012_57_38%20AM.png?updatedAt=1755800872409"
          alt="Spinner Pointer"
          className="absolute -top-6 w-16 h-auto z-10 drop-shadow-lg"
        />
      </div>

      <div className="w-full max-w-xs text-center">
        {freeSpins > 0 && (
          <p className="font-semibold text-yellow-300 mb-2 animate-pulse">
            You have {freeSpins} Free Spin{freeSpins > 1 ? "s" : ""}!
          </p>
        )}
        <button
          onClick={handleSpin}
          disabled={isSpinning || (freeSpins === 0 && coins < SPIN_COST)}
          className="w-full h-16 bg-primary text-text-inverse font-bold rounded-xl text-xl shadow-[0_0px_20px_theme(colors.primary/0.4)] flex items-center justify-center space-x-2 transition-all disabled:bg-disabled-fill disabled:text-text-disabled disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105"
        >
          {isSpinning ? (
            <span>Spinning...</span>
          ) : freeSpins > 0 ? (
            <span>Use Free Spin</span>
          ) : (
            <>
              <CoinIcon className="w-7 h-7" />
              <span>Spin for {SPIN_COST}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TreasurePage;
