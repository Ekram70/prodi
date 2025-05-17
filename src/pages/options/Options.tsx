import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { storage } from '../../lib/storage';
import { BedtimeSettings, TimeLimit, UsageStats } from '../../lib/types';

const Options: React.FC = () => {
  const [timeLimits, setTimeLimits] = useState<TimeLimit[]>([]);
  const [bedtime, setBedtime] = useState<BedtimeSettings>({
    enabled: false,
    startTime: '23:00',
    endTime: '06:00',
  });
  const [usageStats, setUsageStats] = useState<Record<string, UsageStats>>({});
  const [newDomain, setNewDomain] = useState('');
  const [newDailyLimit, setNewDailyLimit] = useState(30);
  const [newMonthlyLimit, setNewMonthlyLimit] = useState(300);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await storage.getSettings();
    setTimeLimits(settings.timeLimits);
    setBedtime(settings.bedtime);
    setUsageStats(settings.usageStats);
  };

  const addTimeLimit = async () => {
    if (!newDomain) return;

    const timeLimit: TimeLimit = {
      domain: newDomain,
      minutesPerDay: newDailyLimit,
      minutesPerMonth: newMonthlyLimit,
      isBlocked: false,
    };

    await storage.saveTimeLimit(timeLimit);
    setTimeLimits([...timeLimits, timeLimit]);
    setNewDomain('');
  };

  const removeTimeLimit = async (domain: string) => {
    const updatedLimits = timeLimits.filter((tl) => tl.domain !== domain);
    const settings = await storage.getSettings();
    settings.timeLimits = updatedLimits;
    await storage.saveSettings(settings);
    setTimeLimits(updatedLimits);
  };

  const updateBedtime = async (updates: Partial<BedtimeSettings>) => {
    const newBedtime = { ...bedtime, ...updates };
    await storage.saveBedtimeSettings(newBedtime);
    setBedtime(newBedtime);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Prodi Settings</h1>

      {/* Bedtime Mode Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Bedtime Mode</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={bedtime.enabled}
              onCheckedChange={(checked) => updateBedtime({ enabled: checked })}
            />
            <Label>Enable Bedtime Mode</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Label>Start Time</Label>
              <div
                className="relative cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) input.showPicker();
                }}
              >
                <Input
                  type="time"
                  value={bedtime.startTime}
                  onChange={(e) => updateBedtime({ startTime: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="relative">
              <Label>End Time</Label>
              <div
                className="relative cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) input.showPicker();
                }}
              >
                <Input
                  type="time"
                  value={bedtime.endTime}
                  onChange={(e) => updateBedtime({ endTime: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Time Limits */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Time Limits</h2>

        {/* Add New Time Limit */}
        <div className="space-y-4 mb-6">
          <div>
            <Label>Domain (e.g., youtube.com)</Label>
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter domain"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Daily Limit (minutes)</Label>
              <Input
                type="number"
                value={newDailyLimit}
                onChange={(e) => setNewDailyLimit(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Monthly Limit (minutes)</Label>
              <Input
                type="number"
                value={newMonthlyLimit}
                onChange={(e) => setNewMonthlyLimit(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={addTimeLimit}>Add Time Limit</Button>
        </div>

        {/* Existing Time Limits */}
        <div className="space-y-4">
          {timeLimits.map((limit) => (
            <Card key={limit.domain} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{limit.domain}</h3>
                  <p className="text-sm text-gray-500">
                    Daily: {formatTime(limit.minutesPerDay)} | Monthly:{' '}
                    {formatTime(limit.minutesPerMonth)}
                  </p>
                  {usageStats[limit.domain] && (
                    <p className="text-sm text-gray-500 mt-1">
                      Today:{' '}
                      {formatTime(usageStats[limit.domain].timeSpentToday)} |
                      This Month:{' '}
                      {formatTime(usageStats[limit.domain].timeSpentThisMonth)}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTimeLimit(limit.domain)}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Options />);
