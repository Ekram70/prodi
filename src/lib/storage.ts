import {
  BedtimeSettings,
  ExtensionSettings,
  TimeLimit,
  UsageStats,
} from './types';

const DEFAULT_SETTINGS: ExtensionSettings = {
  timeLimits: [],
  bedtime: {
    enabled: false,
    startTime: '23:00',
    endTime: '06:00',
  },
  usageStats: {},
};

export const storage = {
  async getSettings(): Promise<ExtensionSettings> {
    const result = await chrome.storage.sync.get('settings');
    return result.settings || DEFAULT_SETTINGS;
  },

  async saveSettings(settings: ExtensionSettings): Promise<void> {
    await chrome.storage.sync.set({ settings });
  },

  async getTimeLimits(): Promise<TimeLimit[]> {
    const settings = await this.getSettings();
    return settings.timeLimits;
  },

  async saveTimeLimit(timeLimit: TimeLimit): Promise<void> {
    const settings = await this.getSettings();
    const index = settings.timeLimits.findIndex(
      (tl) => tl.domain === timeLimit.domain
    );

    if (index >= 0) {
      settings.timeLimits[index] = timeLimit;
    } else {
      settings.timeLimits.push(timeLimit);
    }

    await this.saveSettings(settings);
  },

  async getBedtimeSettings(): Promise<BedtimeSettings> {
    const settings = await this.getSettings();
    return settings.bedtime;
  },

  async saveBedtimeSettings(bedtime: BedtimeSettings): Promise<void> {
    const settings = await this.getSettings();
    settings.bedtime = bedtime;
    await this.saveSettings(settings);
  },

  async getUsageStats(): Promise<Record<string, UsageStats>> {
    const settings = await this.getSettings();
    return settings.usageStats;
  },

  async updateUsageStats(domain: string, timeSpent: number): Promise<void> {
    const settings = await this.getSettings();

    if (!settings.usageStats[domain]) {
      settings.usageStats[domain] = {
        domain,
        timeSpentToday: 0,
        timeSpentThisMonth: 0,
      };
    }

    settings.usageStats[domain].timeSpentToday += timeSpent;
    settings.usageStats[domain].timeSpentThisMonth += timeSpent;

    await this.saveSettings(settings);
  },

  async resetDailyStats(): Promise<void> {
    const settings = await this.getSettings();
    Object.values(settings.usageStats).forEach((stats) => {
      stats.timeSpentToday = 0;
    });
    await this.saveSettings(settings);
  },

  async resetMonthlyStats(): Promise<void> {
    const settings = await this.getSettings();
    Object.values(settings.usageStats).forEach((stats) => {
      stats.timeSpentThisMonth = 0;
    });
    await this.saveSettings(settings);
  },
};
