
export interface OnboardingScreenProps {
  onNext: () => void;
}

export interface AvatarCreationProps extends OnboardingScreenProps {
  petName: string;
  setPetName: (name: string) => void;
}

export interface FinishScreenProps {
    onClaim: () => void;
    onRestart: () => void;
    petName: string;
}

export interface ShopItem {
    id: number;
    name: string;
    category: 'Headgear' | 'Bodywear' | 'Paws' | 'Mane';
    tier: 'Common' | 'Rare' | 'Epic';
    price: number;
    imgSrc: string;
    locked?: boolean;
}

export interface TelcoItem {
    id: number;
    name: string;
    type: 'Top Up' | 'Data Pack' | 'Voice & SMS' | 'Voucher';
    description: string;
    price: number;
    icon: 'topup' | 'data' | 'voice' | 'voucher';
}

export interface ShopPageProps {
    coins: number;
    ownedItems: Set<number>;
    onPurchase: (itemId: number, cost: number) => void;
}

export interface MilestoneTaskDef {
  id: string;
  description: string;
  target: number;
}

export interface MilestoneData {
  level: number;
  name: string;
  tasks: MilestoneTaskDef[];
  reward: {
    coins?: number;
    xp?: number;
    special?: React.ReactNode;
    freeSpins?: number;
    cashback?: number;
  };
}

export interface PageProps {
  setActivePage: (page: string) => void;
  onBack?: () => void;
}

export type PetStage = 'Baby Cub' | 'Young Cub' | 'Teen Lion' | 'Adult Lion' | 'Legendary Lion';

export interface Notification {
  id: string;
  message: string;
  type: 'milestone' | 'mission' | 'event' | 'system' | 'reward';
  timestamp: Date;
  isRead: boolean;
  link?: string;
}
