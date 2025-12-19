export interface NotificationData {
  id: string;
  appName: string;
  message: string;
  timeAgo: string;
  icon: string; // The main large app icon (Left)
  attachmentImage?: string; // Small content thumbnail (Right)
  isContact?: boolean; // True = Circle avatar, False = Rounded Square
  actions: string[];
  badge?: number; // Count for stack
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "2:3" | "3:2" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";
export type FontWeight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

export interface WallpaperConfig {
  url: string;
  isGenerated: boolean;
}

export interface FontSettings {
  clockWeight: FontWeight;
  notificationWeight: FontWeight;
}

export interface AestheticSettings {
  blurIntensity: number; // 0-20px
  cardOpacity: number; // 0-100%
  isDark: boolean; // Dark mode toggle
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export interface AppState {
  wallpaper: WallpaperConfig;
  notifications: NotificationData[];
  currentTime: Date;
  fontSettings: FontSettings;
  aestheticSettings: AestheticSettings;
}