export interface TimeLimit {
  domain: string;
  minutesPerDay: number;
  minutesPerMonth: number;
  isBlocked: boolean;
}

export interface BedtimeSettings {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface UsageStats {
  domain: string;
  timeSpentToday: number; // in minutes
  timeSpentThisMonth: number; // in minutes
}

export interface ExtensionSettings {
  timeLimits: TimeLimit[];
  bedtime: BedtimeSettings;
  usageStats: Record<string, UsageStats>;
}

export interface TabInfo {
  id: number;
  url: string;
  domain: string;
  active: boolean;
  lastActive: number;
}
