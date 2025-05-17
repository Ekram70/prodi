import { storage } from '../lib/storage';
import { TabInfo } from '../lib/types';

let activeTabs: Map<number, TabInfo> = new Map();
let lastCheckTime: number = Date.now();

// Initialize alarms for daily and monthly resets
chrome.runtime.onInstalled.addListener(() => {
  // Set up daily reset at midnight
  chrome.alarms.create('dailyReset', {
    periodInMinutes: 24 * 60,
    when: getNextMidnight(),
  });

  // Set up monthly reset on the 1st of each month
  chrome.alarms.create('monthlyReset', {
    periodInMinutes: 30 * 24 * 60,
    when: getNextMonthStart(),
  });
});

// Handle alarm events
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyReset') {
    await storage.resetDailyStats();
  } else if (alarm.name === 'monthlyReset') {
    await storage.resetMonthlyStats();
  }
});

// Track tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const domain = new URL(tab.url).hostname;
    activeTabs.set(tabId, {
      id: tabId,
      url: tab.url,
      domain,
      active: tab.active,
      lastActive: Date.now(),
    });
  }
});

// Track tab activation
chrome.tabs.onActivated.addListener(({ tabId }) => {
  const tab = activeTabs.get(tabId);
  if (tab) {
    tab.active = true;
    tab.lastActive = Date.now();
  }
});

// Track tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabs.delete(tabId);
});

// Check time limits every minute
setInterval(async () => {
  const now = Date.now();
  const timeDiff = (now - lastCheckTime) / 1000 / 60; // Convert to minutes
  lastCheckTime = now;

  const settings = await storage.getSettings();
  const timeLimits = settings.timeLimits;

  // Update usage stats for active tabs
  for (const [tabId, tab] of activeTabs.entries()) {
    if (tab.active) {
      const timeLimit = timeLimits.find((tl) => tl.domain === tab.domain);
      if (timeLimit) {
        await storage.updateUsageStats(tab.domain, timeDiff);

        // Check if time limit is exceeded
        const stats = settings.usageStats[tab.domain];
        if (
          stats &&
          (stats.timeSpentToday >= timeLimit.minutesPerDay ||
            stats.timeSpentThisMonth >= timeLimit.minutesPerMonth)
        ) {
          // Block the site
          chrome.tabs.update(tabId, {
            url:
              'chrome-extension://' + chrome.runtime.id + '/pages/blocked.html',
          });
        }
      }
    }
  }
}, 60000); // Check every minute

// Helper functions
function getNextMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
}

function getNextMonthStart(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.getTime();
}

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_ACTIVE_TAB_INFO') {
    const tab = activeTabs.get(sender.tab?.id || 0);
    sendResponse(tab);
  }
  return true;
});
