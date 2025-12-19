
import { NotificationData, FontSettings, FontWeight, AestheticSettings } from './types';

// --- PRESETS ---

export const SOCIAL_PRESETS = [
  { 
    name: 'Instagram', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png' 
  },
  { 
    name: 'TikTok', 
    icon: 'https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png' 
  },
  { 
    name: 'Snapchat', 
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1024px-Snapchat_logo.svg.png' 
  },
  { 
    name: 'Messages', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IMessage_logo.svg/1024px-IMessage_logo.svg.png' 
  },
  { 
    name: 'WhatsApp', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png' 
  }
];

export const WALLPAPER_PRESETS: string[] = [];
export const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"; 

export const getRandomWallpaper = () => {
    if (WALLPAPER_PRESETS.length === 0) return DEFAULT_WALLPAPER;
    return WALLPAPER_PRESETS[Math.floor(Math.random() * WALLPAPER_PRESETS.length)];
};

export const DEFAULT_NOTIFICATIONS: NotificationData[] = [
  {
    id: '1',
    appName: 'Instagram',
    message: 'Liked your story',
    timeAgo: 'now',
    icon: SOCIAL_PRESETS[0].icon,
    attachmentImage: '',
    isContact: false,
    actions: [],
    badge: 0
  },
  {
    id: '2',
    appName: 'Messages',
    message: 'Are you coming tonight?',
    timeAgo: '15m ago',
    icon: SOCIAL_PRESETS[3].icon, 
    attachmentImage: '',
    isContact: false,
    actions: [],
    badge: 0
  }
];

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  clockWeight: "500",
  notificationWeight: "400"
};

export const DEFAULT_AESTHETIC_SETTINGS: AestheticSettings = {
  blurIntensity: 10,
  cardOpacity: 88,
  isDark: true
};

export const FONT_WEIGHT_OPTIONS: { label: string; value: FontWeight }[] = [
  { label: "Thin (100)", value: "100" },
  { label: "Extra Light (200)", value: "200" },
  { label: "Light (300)", value: "300" },
  { label: "Regular (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semi Bold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
  { label: "Black (900)", value: "900" },
];

export const ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"] as const;
export const IMAGE_SIZES = ["1K", "2K", "4K"] as const;
