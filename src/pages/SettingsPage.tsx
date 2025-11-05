import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { storageService } from '../services/storageService';

const SettingsPage: React.FC = () => {
  const { settings, setSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    // Load settings from storage when component mounts
    storageService.loadSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setLocalSettings(loadedSettings);
    });
  }, [setSettings]);

  useEffect(() => {
    // Save settings to storage whenever localSettings change
    storageService.saveSettings(localSettings);
  }, [localSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setLocalSettings((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="autoSaveInterval" className="block text-sm font-medium text-gray-700">
            Auto Save Interval (minutes)
          </label>
          <input
            type="number"
            id="autoSaveInterval"
            name="autoSaveInterval"
            value={localSettings.autoSaveInterval}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="commitMessageTemplate" className="block text-sm font-medium text-gray-700">
            Commit Message Template
          </label>
          <input
            type="text"
            id="commitMessageTemplate"
            name="commitMessageTemplate"
            value={localSettings.commitMessageTemplate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="defaultBranch" className="block text-sm font-medium text-gray-700">
            Default Branch
          </label>
          <input
            type="text"
            id="defaultBranch"
            name="defaultBranch"
            value={localSettings.defaultBranch}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={localSettings.theme}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="offlineMode"
            name="offlineMode"
            type="checkbox"
            checked={localSettings.offlineMode}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="offlineMode" className="ml-2 block text-sm text-gray-900">
            Offline Mode
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
