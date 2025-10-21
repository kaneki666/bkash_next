import React, { useState, useEffect } from 'react';
import { PageProps, PetStage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraIcon, PaletteIcon, PlayActionIcon, XIcon, InfoIcon, StarIcon, MissionIcon, ShopIcon, CoinIcon } from '../components/icons';
import { PageInfoModal } from '../components/PlatformPages';

interface AvatarProps extends PageProps {
    xp: number; 
    currentLevel: number;
    petStage: PetStage;
    xpProgressInLevel: number;
    totalXpForLevel: number;
    happiness: number;
    setHappiness: (updater: number | ((prev: number) => number)) => void;
}

const STAGES_CONFIG: Record<PetStage, { name: PetStage, imgSrc: string }> = {
    'Baby Cub': { name: 'Baby Cub', imgSrc: 'https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_58_36%20PM.png?updatedAt=1756276273569' },
    'Young Cub': { name: 'Young Cub', imgSrc: 'https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2011_49_04%20PM.png?updatedAt=1756315173024' },
    'Teen Lion': { name: 'Teen Lion', imgSrc: 'https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2002_29_46%20PM.png?updatedAt=1756314700059' },
    'Adult Lion': { name: 'Adult Lion', imgSrc: 'https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2002_29_44%20PM.png?updatedAt=1756314701116' },
    'Legendary Lion': { name: 'Legendary Lion', imgSrc: 'https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2002_29_37%20PM.png?updatedAt=1756314699490' },
};

type EquipTab = 'Outfits' | 'Bodywear' | 'Paws' | 'Mane';

interface AvatarCustomizationModalProps {
  onClose: () => void;
  equippedItems: Record<EquipTab, string | null>;
  setEquippedItems: React.Dispatch<React.SetStateAction<Record<EquipTab, string | null>>>;
}


const AvatarCustomizationModal: React.FC<AvatarCustomizationModalProps> = ({ onClose, equippedItems, setEquippedItems }) => {
  type CustomTab = 'Fur Color' | 'Pose' | 'Environment';
  type Item = { id: string; label: string; emoji?: string; imgSrc?: string; };

  const INVENTORY: Record<EquipTab, Item[]> = {
    Outfits: [ { id: 'crown', label: 'Elderwood', imgSrc: 'https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2029,%202025,%2011_49_34%20AM.png?updatedAt=1756446094274' } ],
    Bodywear: [ 
        { id: 'cloak', label: 'Shadowpelt Cloak', imgSrc: 'https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_55_59%20AM.png?updatedAt=1756169499760' },
        { id: 'amulet', label: 'Sunflare Amulet', imgSrc: 'https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2003_07_22%20AM.png?updatedAt=1756154279504' }
    ],
    Paws: [ { id: 'guards', label: "Sunstone Paw Guards", imgSrc: 'https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2003_48_03%20AM.png?updatedAt=1756156692520' } ],
    Mane: [ { id: 'ornaments', label: "Gilded Mane Ornaments", imgSrc: 'https://ik.imagekit.io/erriqyxye/Ipay%20RFP/ChatGPT%20Image%20Aug%2026,%202025,%2004_09_30%20AM.png?updatedAt=1756157985240' } ],
  };
  const COLOR_OPTIONS: Item[] = [ { id: 'golden', label: 'Golden', emoji: '🌟' }, { id: 'charcoal', label: 'Charcoal', emoji: '⚫' }, { id: 'ivory', label: 'Ivory', emoji: '⚪' }, ];
  const POSE_OPTIONS: Item[] = [ { id: 'regal', label: 'Regal', emoji: '👑' }, { id: 'pounce', label: 'Pounce', emoji: '🐾' }, { id: 'resting', label: 'Resting', emoji: '😴' }, ];
  const BG_OPTIONS: Item[] = [ { id: 'savannah', label: 'Savannah Sunrise', emoji: '🌅' }, { id: 'watering-hole', label: 'Watering Hole', emoji: '💧' }, { id: 'canopy', label: 'Jungle Canopy', emoji: '🌳' }, ];

  const [panel, setPanel] = React.useState<'Equipment' | 'Customization'>('Equipment');
  const [equipTab, setEquipTab] = React.useState<EquipTab>('Outfits');
  const [customTab, setCustomTab] = React.useState<CustomTab>('Fur Color');
  const [colorId, setColorId] = React.useState('golden');
  const [poseId, setPoseId] = React.useState('regal');
  const [bgId, setBgId] = React.useState('savannah');

  const activeInventory = INVENTORY[equipTab];
  const activeCustomize = customTab === 'Fur Color' ? COLOR_OPTIONS : customTab === 'Pose' ? POSE_OPTIONS : BG_OPTIONS;

  function handleEquip(it: Item) {
    setEquippedItems((prev) => ({
      ...prev,
      [equipTab]: prev[equipTab] === it.id ? null : it.id,
    }));
  }
  function pickCustomize(id: string) { if (customTab === 'Fur Color') setColorId(id); if (customTab === 'Pose') setPoseId(id); if (customTab === 'Environment') setBgId(id); }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 z-50 flex items-end">
        <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full bg-surface rounded-t-2xl p-4 border-t border-divider max-h-[70%] flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-2xl font-extrabold text-text-primary">Appearance</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><XIcon className="w-6 h-6 text-text-primary" /></button>
            </div>
            
            <div className="overflow-y-auto no-scrollbar">
                <div className="rounded-2xl bg-gray-200 p-2 mb-3 flex">
                    {(['Equipment', 'Customization'] as const).map((p) => (
                    <button key={p} onClick={() => setPanel(p)} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${ panel === p ? 'bg-primary text-text-inverse' : 'bg-transparent text-text-secondary' }`}>{p}</button>
                    ))}
                </div>

                {panel === 'Equipment' ? (
                <section>
                    <TabBar tabs={['Outfits', 'Bodywear', 'Paws', 'Mane']} active={equipTab} onChange={(t) => setEquipTab(t as EquipTab)} />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {activeInventory.map((it) => <TileButton key={it.id} label={it.label} imgSrc={it.imgSrc} active={equippedItems[equipTab] === it.id} onClick={() => handleEquip(it)} />)}
                    </div>
                </section>
                ) : (
                <section>
                    <TabBar tabs={['Fur Color', 'Pose', 'Environment']} active={customTab} onChange={(t) => setCustomTab(t as CustomTab)} />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {activeCustomize.map((it) => <TileButton key={it.id} label={it.label} emoji={it.emoji} active={ (customTab === 'Fur Color' && colorId === it.id) || (customTab === 'Pose' && poseId === it.id) || (customTab === 'Environment' && bgId === it.id) } onClick={() => pickCustomize(it.id)} />)}
                    </div>
                </section>
                )}
            </div>
        </motion.div>
    </motion.div>
  );
};

const RecoveryModal: React.FC<{
    onClose: () => void;
    onViewMission: () => void;
    onSpendDiamonds: () => void;
}> = ({ onClose, onViewMission, onSpendDiamonds }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.8, opacity: 0 }} 
                className="w-full max-w-sm bg-surface rounded-2xl p-6 border-2 border-primary text-center"
            >
                <div className="flex justify-end">
                    <button onClick={onClose} className="p-1 -mr-2 -mt-2 rounded-full hover:bg-gray-200"><XIcon className="w-6 h-6 text-text-primary" /></button>
                </div>
                <img src="https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2011_59_32%20PM.png?updatedAt=1756319565919" alt="Sad Pet" className="w-24 h-24 mx-auto mb-4"/>
                <h2 className="text-2xl font-extrabold text-primary mb-2">Feeling Down!</h2>
                <p className="text-text-secondary mb-6">Complete a recovery mission or spend diamonds to regain happiness.</p>
                <div className="space-y-3">
                     <button onClick={onViewMission} className="w-full bg-primary hover:bg-primary-hover text-text-inverse font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
                        <MissionIcon className="w-5 h-5" />
                        <span>View Mission</span>
                    </button>
                    <button onClick={onSpendDiamonds} className="w-full bg-secondary-action hover:bg-secondary-action-dark text-text-inverse font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
                        <CoinIcon className="w-5 h-5" />
                        <span>Spend Diamonds</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const WellbeingMeter: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => {
    return (
        <div className="flex flex-col items-center space-y-2">
            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-text-primary font-bold text-lg`}>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        className="text-gray-200"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className={value > 50 ? 'text-success' : value > 25 ? 'text-warning' : 'text-error'}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${value}, 100`}
                        strokeLinecap="round"
                    />
                </svg>
                 <span className="absolute">{icon}</span>
            </div>
             <span className="text-sm font-semibold text-text-secondary">{label} ({Math.round(value)}%)</span>
        </div>
    );
};

const HappinessMissionCard: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <div className="bg-background p-3 rounded-lg flex items-center space-x-3">
        <div className="w-10 h-10 flex-shrink-0 bg-primary-light rounded-md flex items-center justify-center text-primary">
            {icon}
        </div>
        <div className="flex-grow">
            <p className="font-bold text-sm text-text-primary">{title}</p>
            <p className="text-xs text-text-secondary">{description}</p>
        </div>
        <button onClick={onClick} className="bg-primary text-text-inverse font-semibold text-sm px-4 py-1.5 rounded-md hover:bg-primary-hover transition-colors">
            Go
        </button>
    </div>
);

export const Avatar: React.FC<AvatarProps> = ({ xp, currentLevel, petStage, xpProgressInLevel, totalXpForLevel, happiness, setHappiness, setActivePage, onBack }) => {
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [previewStage, setPreviewStage] = useState<PetStage>(petStage);
  const [decayImage, setDecayImage] = useState<string | null>(null);
  const [equippedItems, setEquippedItems] = useState<Record<EquipTab, string | null>>({
    Outfits: null,
    Bodywear: null,
    Paws: null,
    Mane: null,
  });

  useEffect(() => {
    setPreviewStage(petStage);
    setDecayImage(null);
  }, [petStage]);
  
  useEffect(() => {
    const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '{}');
    if (!visitedPages.avatar) {
      setShowInfo(true);
      visitedPages.avatar = true;
      localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    }
  }, []);
  
  const gButtonMap: Record<string, PetStage> = {
    'G1': 'Baby Cub',
    'G2': 'Young Cub',
    'G3': 'Teen Lion',
    'G4': 'Adult Lion',
    'G5': 'Legendary Lion',
  };

  const handleDecayClick = (level: number) => {
    setPreviewStage(petStage); // Reset preview to actual stage
    switch (level) {
        case 0:
            setHappiness(100);
            setDecayImage('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_58_36%20PM.png?updatedAt=1756276273569');
            break;
        case 1:
            setHappiness(100);
            setDecayImage('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2011_53_18%20PM.png?updatedAt=1756319565628');
            break;
        case 2:
            setHappiness(50);
            setDecayImage('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2011_59_32%20PM.png?updatedAt=1756319565919');
            break;
        case 3:
            setHappiness(40);
            setDecayImage('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2011_59_32%20PM.png?updatedAt=1756319565919');
            break;
        case 4:
            setHappiness(30);
            setDecayImage('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2028,%202025,%2012_23_15%20AM.png?updatedAt=1756319552906');
            break;
        default:
            break;
    }
  };

  const handleRecovery = (action: 'mission' | 'spend') => {
      if (action === 'mission') {
          setActivePage('quest');
      }
      setHappiness(100);
      setDecayImage('https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2027,%202025,%2012_58_36%20PM.png?updatedAt=1756276273569');
      setShowRecoveryModal(false);
  };

  const elderwoodEquippedImage = 'https://ik.imagekit.io/erriqyxye/Bkash/ChatGPT%20Image%20Aug%2029,%202025,%2012_20_12%20PM.png?updatedAt=1756446626508';
  const baseImage = decayImage || STAGES_CONFIG[previewStage].imgSrc;
  const imageToDisplay = equippedItems.Outfits === 'crown' ? elderwoodEquippedImage : baseImage;

  return (
    <div className="p-4 text-text-primary flex flex-col gap-4 relative">
      <AnimatePresence>
        {showRecoveryModal && <RecoveryModal onClose={() => setShowRecoveryModal(false)} onViewMission={() => handleRecovery('mission')} onSpendDiamonds={() => handleRecovery('spend')} />}
      </AnimatePresence>
      {showInfo && (
        <PageInfoModal title="My Pet" onClose={() => setShowInfo(false)}>
            <p className="font-bold">Behold, your loyal companion and the heart of your adventure! Tending to your Pet is the key to unlocking true power.</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Evolution & Level:</strong> The XP bar is the story of your Pet's growth. Every mission and game fuels its evolution, transforming it into new, magnificent forms and unlocking uncharted islands.</li>
                <li><strong>Happiness Meter:</strong> A joyful Pet is a generous one! Keep its happiness high, and it will often surprise you with gifts of Coins and XP. But if its spirits fall, your journey will stall!</li>
                <li><strong>Happiness Missions:</strong> Restore your Pet's zest for adventure! These quick tasks are the perfect way to boost happiness.</li>
                <li><strong>Customize:</strong> Tap the palette icon to enter the wardrobe. Style your Pet with unique gear to craft a look that is truly legendary.</li>
            </ul>
        </PageInfoModal>
      )}
      
      <div className="flex justify-center items-center relative">
          <h1 className="text-3xl font-extrabold text-text-primary">Your Pet</h1>
          <button onClick={() => setShowInfo(true)} aria-label="Page Information" className="absolute right-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors flex-shrink-0">
              <InfoIcon className="w-5 h-5 text-text-inverse" />
          </button>
      </div>

      {/* Level Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold text-primary">{`Level ${currentLevel}`}</h2>
          <span className="text-sm font-semibold text-text-secondary">{xpProgressInLevel} / {totalXpForLevel} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${(xpProgressInLevel / totalXpForLevel) * 100}%` }}></div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <section 
          className="relative flex items-center justify-center overflow-hidden shadow-inner bg-background h-64 rounded-2xl cursor-pointer"
          onClick={() => { if (happiness === 50 && decayImage) setShowRecoveryModal(true) }}
        >
          <div className="relative flex flex-col items-center">
            <img src={imageToDisplay} alt="User Avatar" className="w-48 h-auto object-contain drop-shadow-2xl" />
            <div className="bg-black/40 text-white font-bold text-lg px-4 py-1 rounded-full -mt-4 backdrop-blur-sm">{decayImage ? '' : STAGES_CONFIG[previewStage].name}</div>
            <button className="absolute top-4 left-4 p-2.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm border border-white/20" aria-label="Photo Mode">
              <CameraIcon className="w-6 h-6 text-text-inverse"/>
            </button>
            <button onClick={(e) => { e.stopPropagation(); setShowCustomizeModal(true); }} className="absolute top-4 right-4 p-2.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm border border-white/20" aria-label="Customize Avatar">
              <PaletteIcon className="w-6 h-6 text-text-inverse"/>
            </button>
          </div>
        </section>
      </div>

       {/* Pet Wellbeing */}
       <section className="bg-surface p-4 rounded-2xl shadow-md border border-divider">
          <div className="flex justify-center">
              <WellbeingMeter label="Happiness" value={happiness} icon={<StarIcon className="w-10 h-10 text-warning"/>} color="border-warning" />
          </div>
           {happiness <= 50 && happiness > 30 && (
                <div className="text-center text-sm text-warning-dark font-semibold flex items-center justify-center gap-1 bg-warning-light p-2 rounded-lg border border-warning/30 mt-4">
                    <InfoIcon className="w-5 h-5 flex-shrink-0" />
                    <span>Your pet is sad! It won't find rewards.</span>
                </div>
            )}
            {happiness <= 30 && (
                <div className="text-center text-sm text-error font-semibold flex items-center justify-center gap-1 bg-red-100 p-2 rounded-lg border border-error/30 mt-4">
                    <InfoIcon className="w-5 h-5 flex-shrink-0" />
                    <span>You have stop growing, raise happiness to continue earning XP for pet and get rewards.</span>
                </div>
            )}
      </section>

      {/* Placeholder Actions */}
      <section className="bg-surface p-4 rounded-2xl shadow-md border border-divider">
          <div className="flex flex-wrap gap-2 justify-center">
              {['0', '1', '2', '3', '4', '5', 'G1', 'G2', 'G3', 'G4', 'G5'].map(label => {
                  const isGButton = label.startsWith('G');
                  const isDecayButton = !isGButton && !isNaN(parseInt(label));
                  const gStage = isGButton ? gButtonMap[label] : undefined;
                  const decayLevel = parseInt(label);

                  return (
                      <button 
                          key={label}
                          onClick={() => {
                              if (gStage) {
                                  setDecayImage(null);
                                  setPreviewStage(gStage);
                              } else if (isDecayButton) {
                                  handleDecayClick(decayLevel);
                              }
                          }}
                          disabled={label === '5'}
                          className={`font-semibold text-sm px-3 py-1.5 rounded-md transition-colors ${
                              previewStage === gStage && !decayImage
                                  ? 'bg-primary text-text-inverse'
                                  : 'bg-gray-200 text-text-secondary hover:bg-gray-300'
                          } ${label === '5' ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                          {label}
                      </button>
                  );
              })}
          </div>
      </section>

      {/* Happiness Missions */}
      <section className="bg-surface p-4 rounded-2xl shadow-md border border-divider">
        <h3 className="text-xl font-bold text-text-primary text-center mb-4">Happiness Missions</h3>
        <div className="space-y-3">
            <HappinessMissionCard icon={<MissionIcon className="w-6 h-6"/>} title="Complete a Mission" description="Makes your pet feel accomplished." onClick={() => setActivePage('championship')}/>
            <HappinessMissionCard icon={<PlayActionIcon className="w-6 h-6"/>} title="Play a Game" description="Playtime is the best time!" onClick={() => setActivePage('championship')}/>
            <HappinessMissionCard icon={<ShopIcon className="w-6 h-6"/>} title="Visit the Shop" description="A new toy always brings joy." onClick={() => setActivePage('shop')}/>
        </div>
      </section>

      <AnimatePresence>
        {showCustomizeModal && <AvatarCustomizationModal onClose={() => setShowCustomizeModal(false)} equippedItems={equippedItems} setEquippedItems={setEquippedItems} />}
      </AnimatePresence>
    </div>
  );
};

/* ---------- local UI helpers ---------- */
const TabBar: React.FC<{
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}> = ({ tabs, active, onChange }) => (
  <div className="grid grid-cols-4 gap-2">
    {tabs.map((t) => (
      <button
        key={t}
        onClick={() => onChange(t)}
        className={`px-3 py-2 rounded-xl text-sm font-semibold ${
          active === t ? 'bg-primary-light text-secondary-action' : 'bg-gray-100 text-text-secondary'
        } ring-1 ring-divider`}
      >
        {t}
      </button>
    ))}
  </div>
);

const TileButton: React.FC<{
  label: string;
  emoji?: string;
  imgSrc?: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ label, emoji, imgSrc, active, onClick }) => (
  <button
    onClick={onClick}
    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 text-center
      ${active ? 'bg-primary-light ring-2 ring-primary' : 'bg-gray-100 ring-1 ring-divider'}`}
  >
    <div className="flex-grow w-full flex items-center justify-center">
        {imgSrc ? (
            <img src={imgSrc} alt={label} className="max-w-full max-h-full object-contain p-1"/>
        ) : (
            <span className="text-2xl leading-none">{emoji ?? '⭐'}</span>
        )}
    </div>
    <span className="text-[11px] leading-tight mt-1 opacity-90 shrink-0 block">{label}</span>
  </button>
);