import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { storage } from '../../lib/storage';
import { BedtimeSettings, UsageStats } from '../../lib/types';

const Popup: React.FC = () => {
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [usageStats, setUsageStats] = useState<Record<string, UsageStats>>({});
  const [bedtime, setBedtime] = useState<BedtimeSettings>({
    enabled: false,
    startTime: '23:00',
    endTime: '06:00',
  });

  useEffect(() => {
    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (tab.url) {
        const domain = new URL(tab.url).hostname;
        setCurrentDomain(domain);
      }
    });

    // Load settings
    const loadSettings = async () => {
      const settings = await storage.getSettings();
      setUsageStats(settings.usageStats);
      setBedtime(settings.bedtime);
    };

    loadSettings();

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.settings) {
        const newSettings = changes.settings.newValue;
        setUsageStats(newSettings.usageStats);
        setBedtime(newSettings.bedtime);
      }
    });
  }, []);

  const toggleBedtime = async () => {
    const newBedtime = { ...bedtime, enabled: !bedtime.enabled };
    await storage.saveBedtimeSettings(newBedtime);
    setBedtime(newBedtime);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="w-80 p-4 space-y-4">
      <h1 className="text-xl font-bold">Prodi</h1>

      {/* Current Site Stats */}
      {currentDomain && usageStats[currentDomain] && (
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Current Site</h2>
          <div className="space-y-1">
            <p>Today: {formatTime(usageStats[currentDomain].timeSpentToday)}</p>
            <p>
              This Month:{' '}
              {formatTime(usageStats[currentDomain].timeSpentThisMonth)}
            </p>
          </div>
        </Card>
      )}

      {/* Bedtime Mode */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Bedtime Mode</h2>
            <p className="text-sm text-gray-500">
              {bedtime.startTime} - {bedtime.endTime}
            </p>
          </div>
          <Switch checked={bedtime.enabled} onCheckedChange={toggleBedtime} />
        </div>
      </Card>

      {/* Settings Button */}
      <Button
        className="w-full"
        onClick={() => chrome.runtime.openOptionsPage()}
      >
        Open Settings
      </Button>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);
