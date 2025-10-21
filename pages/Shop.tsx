import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  CoinIcon,
  DataIcon,
  DiceIcon,
  LockIcon,
  TopUpIcon,
  VoiceIcon,
  VoucherIcon,
} from "../components/icons";
import {
  BackButton,
  InfoButton,
  PageInfoModal,
} from "../components/PlatformPages";
import { PageProps, ShopItem, ShopPageProps, TelcoItem } from "../types";

const shopItems: ShopItem[] = [
  {
    id: 1,
    name: "Vine Mantle",
    category: "Bodywear",
    tier: "Rare",
    price: 350,
    imgSrc:
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_56_02%20AM.png?updatedAt=1756169499854",
    locked: true,
  },
  {
    id: 2,
    name: "Sunflare Amulet",
    category: "Bodywear",
    tier: "Epic",
    price: 700,
    imgSrc:
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2003_07_22%20AM.png?updatedAt=1756154279504",
  },
  {
    id: 3,
    name: "Sunstone Paw Guards",
    category: "Paws",
    tier: "Common",
    price: 100,
    imgSrc:
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2003_48_03%20AM.png?updatedAt=1756156692520",
  },
  {
    id: 4,
    name: "Whisperwind Leggings",
    category: "Paws",
    tier: "Epic",
    price: 850,
    imgSrc:
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_55_53%20AM.png?updatedAt=1756169499804",
    locked: true,
  },
  {
    id: 5,
    name: "Elderwood Crown",
    category: "Headgear",
    tier: "Common",
    price: 120,
    imgSrc:
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_09_30%20AM.png?updatedAt=1756157985240",
  },
  {
    id: 6,
    name: "Shadowpelt Cloak",
    category: "Bodywear",
    tier: "Epic",
    price: 1200,
    imgSrc:
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_55_59%20AM.png?updatedAt=1756169499760",
  },
  {
    id: 7,
    name: "Gilded Mane Ornaments",
    category: "Mane",
    tier: "Rare",
    price: 450,
    imgSrc:
      "https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_09_30%20AM.png?updatedAt=1756157985240",
  },
];

const telcoBenefits: TelcoItem[] = [
  {
    id: 101,
    name: "100 Coins",
    type: "Top Up",
    description: "Instantly add 100 coins to your account.",
    price: 90,
    icon: "topup",
  },
  {
    id: 102,
    name: "5GB Data Pack",
    type: "Data Pack",
    description: "7-day validity for all your browsing needs.",
    price: 250,
    icon: "data",
  },
  {
    id: 103,
    name: "100 Mins Voice Call",
    type: "Voice & SMS",
    description: "Talk more with this 30-day voice pack.",
    price: 150,
    icon: "voice",
  },
  {
    id: 104,
    name: "Gamer's Voucher",
    type: "Voucher",
    description: "5% off on your next game tournament entry.",
    price: 50,
    icon: "voucher",
  },
  {
    id: 105,
    name: "20GB Data Pack",
    type: "Data Pack",
    description: "30-day validity, perfect for heavy users.",
    price: 800,
    icon: "data",
  },
  {
    id: 106,
    name: "500 SMS Pack",
    type: "Voice & SMS",
    description: "A bundle of 500 local SMS for 30 days.",
    price: 80,
    icon: "voice",
  },
  {
    id: 107,
    name: "500 Coins",
    type: "Top Up",
    description: "A big boost for your in-game wallet.",
    price: 420,
    icon: "topup",
  },
  {
    id: 108,
    name: "FoodPanda Voucher",
    type: "Voucher",
    description: "Get BDT 50 off on your next FoodPanda order.",
    price: 300,
    icon: "voucher",
  },
  {
    id: 109,
    name: "Weekly Combo Pack",
    type: "Data Pack",
    description: "2GB Data + 50 Mins talk time for 7 days.",
    price: 350,
    icon: "data",
  },
];

const tierColors = {
  Common: "border-divider",
  Rare: "border-secondary-action",
  Epic: "border-primary",
};

const InfoModal: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-surface border-2 border-primary rounded-2xl p-6 text-center text-text-primary w-4/5 max-w-sm"
    >
      <p className="text-text-primary mb-6 text-lg">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-primary hover:bg-primary-hover text-text-inverse font-bold py-3 rounded-xl transition-colors"
      >
        Got it
      </button>
    </motion.div>
  </div>
);

const ShopItemCard: React.FC<{
  item: ShopItem;
  isOwned: boolean;
  canAfford: boolean;
  onClick: () => void;
}> = ({ item, isOwned, canAfford, onClick }) => {
  const isLocked = item.locked;
  return (
    <div
      className={`relative bg-surface rounded-lg overflow-hidden border-2 ${
        tierColors[item.tier]
      } shadow-sm`}
    >
      <div
        className={`w-full h-28 bg-background flex items-center justify-center p-2 ${
          isLocked ? "filter grayscale opacity-70" : ""
        }`}
      >
        <img
          src={item.imgSrc}
          alt={item.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      {isLocked && (
        <div className="absolute top-0 left-0 right-0 h-28 bg-black/50 flex items-center justify-center">
          <LockIcon className="w-12 h-12 text-white/80" />
        </div>
      )}
      <div className="p-3">
        <p className="font-bold text-text-primary truncate">{item.name}</p>
        <p className="text-xs text-text-secondary">{item.tier}</p>
        <button
          onClick={onClick}
          disabled={isOwned || isLocked || !canAfford}
          className={`w-full mt-2 py-1.5 rounded-md font-bold text-sm transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2
                    ${
                      isOwned
                        ? "bg-primary-light text-secondary-action-dark opacity-100"
                        : isLocked
                        ? "bg-disabled-fill text-text-disabled opacity-100"
                        : canAfford
                        ? "bg-primary text-text-inverse"
                        : "bg-disabled-fill text-text-disabled opacity-70"
                    }`}
        >
          {isLocked ? (
            <>
              <LockIcon className="w-4 h-4" />
              <span>Locked</span>
            </>
          ) : isOwned ? (
            <span>Owned</span>
          ) : (
            <>
              <CoinIcon className="w-4 h-4" />
              <span>{item.price}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const TelcoItemCard: React.FC<{
  item: TelcoItem;
  canAfford: boolean;
  onRedeem: (id: number, cost: number) => void;
}> = ({ item, canAfford, onRedeem }) => {
  const getIcon = () => {
    switch (item.icon) {
      case "topup":
        return <TopUpIcon className="w-10 h-10 text-primary" />;
      case "data":
        return <DataIcon className="w-10 h-10 text-primary" />;
      case "voice":
        return <VoiceIcon className="w-10 h-10 text-primary" />;
      case "voucher":
        return <VoucherIcon className="w-10 h-10 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface p-4 rounded-lg flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div>
            <p className="font-bold text-text-primary text-lg">{item.name}</p>
            <p className="text-sm text-text-secondary mt-1">
              {item.description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end items-center">
        <button
          onClick={() => onRedeem(item.id, item.price)}
          disabled={!canAfford}
          className="bg-primary text-text-inverse font-bold py-2 px-4 rounded-lg flex items-center space-x-2 disabled:bg-disabled-fill disabled:text-text-disabled disabled:cursor-not-allowed transition-colors"
        >
          <CoinIcon className="w-5 h-5" />
          <span>{item.price}</span>
        </button>
      </div>
    </div>
  );
};

interface ShopPagePropsWithNav extends ShopPageProps, PageProps {}

const Shop: React.FC<ShopPagePropsWithNav> = ({
  coins,
  ownedItems,
  onPurchase,
  setActivePage,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState("skins");
  const [activeFilter, setActiveFilter] = useState("All");
  const [infoModalMessage, setInfoModalMessage] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const visitedPages = JSON.parse(
      localStorage.getItem("visitedPages") || "{}"
    );
    if (!visitedPages.shop) {
      setShowInfo(true);
      visitedPages.shop = true;
      localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
    }
  }, []);

  const filters = ["All", "Headgear", "Bodywear", "Paws", "Mane"];
  const filteredItems =
    activeFilter === "All"
      ? shopItems
      : shopItems.filter((item) => item.category === activeFilter);

  return (
    <div className="p-4 text-text-primary relative">
      {showInfo && (
        <PageInfoModal
          title="The Canopy Market"
          onClose={() => setShowInfo(false)}
        >
          <p>
            Step into the Canopy Market, where your legend gets its look! Every
            Coin you've earned is a key to unlocking unparalleled style and
            real-world value.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Avatar Gear:</strong> Forge your Pet's identity with our
              ever-growing collection of rare outfits and epic accessories. As
              your Pet evolves, new legendary items will be yours to command.
            </li>
            <li>
              <strong>Telco Benefits:</strong> Convert your in-game triumphs
              into tangible rewards! Cash in your Coins for mobile data, talk
              time, and exclusive vouchers.
            </li>
          </ul>
          <p className="mt-2">
            For those feeling lucky, a visit to the{" "}
            <strong>Jungle Treasure</strong> spin wheel could yield legendary
            rewards!
          </p>
        </PageInfoModal>
      )}
      {infoModalMessage && (
        <InfoModal
          message={infoModalMessage}
          onClose={() => setInfoModalMessage(null)}
        />
      )}
      <InfoButton onClick={() => setShowInfo(true)} />
      <h1 className="text-3xl font-extrabold text-center mb-6">
        The Canopy Market
      </h1>
      <div className="w-full bg-gray-200 rounded-xl p-1.5 flex mb-6">
        <button
          onClick={() => setActiveTab("skins")}
          className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "skins"
              ? "bg-primary text-text-inverse"
              : "text-text-secondary"
          }`}
        >
          Avatar Gear
        </button>
        <button
          onClick={() => setActiveTab("telco")}
          className={`w-1/2 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "telco"
              ? "bg-primary text-text-inverse"
              : "text-text-secondary"
          }`}
        >
          Telco Benefits
        </button>
      </div>

      {activeTab === "skins" ? (
        <div>
          <button
            onClick={() => setActivePage("treasure")}
            className="w-full bg-gradient-to-br from-primary via-primary/80 to-warning p-4 rounded-xl text-left mb-4 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
          >
            <div className="relative z-10">
              <p className="font-extrabold text-text-inverse text-sm tracking-wider drop-shadow-md">
                LIMITED TIME EVENT
              </p>
              <p className="text-white/90 text-xs mt-1 drop-shadow-md">
                Spin the wheel for exclusive rewards!
              </p>
            </div>
            <DiceIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 text-white/30 transform transition-transform duration-500 group-hover:rotate-45 group-hover:scale-125" />
          </button>

          <div className="flex justify-center space-x-2 mb-4 bg-gray-200 p-1 rounded-full">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                  activeFilter === filter
                    ? "bg-primary text-text-inverse"
                    : "text-text-secondary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                isOwned={ownedItems?.has(item.id)}
                canAfford={coins >= item.price}
                onClick={() => {
                  if (item.locked) {
                    if (item.id === 1) {
                      // Graffiti Hoodie
                      setInfoModalMessage(
                        "Level Up your Pet to Explorer Stage to unlock this item"
                      );
                    } else if (item.id === 4) {
                      // Holo-Skates
                      setInfoModalMessage(
                        "Level Up your Pet to Master Stage to unlock this item"
                      );
                    }
                  } else {
                    onPurchase(item.id, item.price);
                  }
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {telcoBenefits.map((item) => (
            <TelcoItemCard
              key={item.id}
              item={item}
              canAfford={coins >= item.price}
              onRedeem={onPurchase}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;

// --- New Loyalty Exchange Page ---
interface LoyaltyExchangePageProps extends PageProps {
  loyaltyPoints: number;
  coins: number;
  onExchange: (points: number) => void;
}

export const LoyaltyExchangePage: React.FC<LoyaltyExchangePageProps> = ({
  loyaltyPoints,
  coins,
  onExchange,
  onBack,
}) => {
  const [pointsToExchange, setPointsToExchange] = useState(0);
  const coinsToReceive = pointsToExchange * 10;

  const handleExchange = () => {
    if (pointsToExchange > 0 && pointsToExchange <= loyaltyPoints) {
      onExchange(pointsToExchange);
      setPointsToExchange(0); // Reset after exchange
    }
  };

  const quickAmounts = [100, 500, 1000];

  return (
    <div className="p-4 text-text-primary h-full flex flex-col">
      <div className="relative flex items-center justify-center flex-shrink-0 mb-6 h-10">
        <BackButton onClick={onBack!} />
        <h1 className="text-2xl font-extrabold">Loyalty Exchange</h1>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar pr-2 -mr-2">
        <div className="text-center my-4 font-bold text-lg text-text-primary bg-primary-light py-2 px-4 rounded-full">
          Exchange Rate: 1 Point = 10 Coins
        </div>

        <div className="text-center text-text-secondary font-semibold mb-2">
          Your Balance
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl p-4 shadow-md flex justify-around items-center mb-6"
        >
          {/* Loyalty Points side */}
          <div className="text-center">
            <p className="text-sm font-semibold text-text-secondary">
              bKash Loyalty Points
            </p>
            <p className="text-3xl font-bold text-primary">
              {loyaltyPoints.toLocaleString()}
            </p>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-12 bg-divider mx-2"></div>

          {/* Coins side */}
          <div className="text-center">
            <p className="text-sm font-semibold text-text-secondary">
              Jungle Journey Coins
            </p>
            <div className="flex items-center justify-center">
              <CoinIcon className="w-7 h-7 mr-1" />
              <p className="text-3xl font-bold text-text-primary">
                {coins.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="bg-surface p-4 rounded-2xl shadow-md">
          <h3 className="font-bold text-lg text-center mb-4">
            Select Amount to Exchange
          </h3>
          <div className="bg-background text-center p-4 rounded-lg mb-4">
            <p className="text-sm text-text-secondary">You exchange</p>
            <p className="text-3xl font-bold text-primary">
              {pointsToExchange.toLocaleString()} Points
            </p>
            <p className="text-sm text-text-secondary mt-2">To receive</p>
            <p className="text-2xl font-bold text-success flex items-center justify-center space-x-1">
              <CoinIcon className="w-6 h-6" />
              <span>{coinsToReceive.toLocaleString()} Coins</span>
            </p>
          </div>
          <input
            type="range"
            min="0"
            max={loyaltyPoints}
            step="10"
            value={pointsToExchange}
            onChange={(e) => setPointsToExchange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>0</span>
            <span>{loyaltyPoints.toLocaleString()}</span>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() =>
                  setPointsToExchange(Math.min(amount, loyaltyPoints))
                }
                className="bg-gray-200 text-text-secondary font-semibold py-1 px-4 rounded-full text-sm"
              >
                {amount}
              </button>
            ))}
            <button
              onClick={() => setPointsToExchange(loyaltyPoints)}
              className="bg-gray-200 text-text-secondary font-semibold py-1 px-4 rounded-full text-sm"
            >
              Max
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-md text-text-secondary mb-2">
            Business Rules
          </h4>
          <ul className="text-xs text-text-secondary list-disc list-inside space-y-1 bg-surface p-3 rounded-lg">
            <li>Minimum exchange of 10 points.</li>
            <li>Exchange rate is subject to change.</li>
            <li>All exchanges are final and cannot be reversed.</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 flex-shrink-0">
        <button
          onClick={handleExchange}
          disabled={
            pointsToExchange === 0 ||
            pointsToExchange < 10 ||
            pointsToExchange > loyaltyPoints
          }
          className="w-full bg-primary text-text-inverse font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:bg-primary-hover transform hover:scale-105 transition-all duration-300 disabled:bg-disabled-fill disabled:text-text-disabled disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Exchange Now
        </button>
      </div>
    </div>
  );
};
