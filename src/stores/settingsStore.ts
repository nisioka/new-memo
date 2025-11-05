import { create } from 'zustand';
import type { AppSettings } from '../types';
import { syncService } from '../services/syncService';

interface SettingsState {
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  autoSaveInterval: 5, // minutes
  commitMessageTemplate: 'docs: update memo',
  defaultBranch: 'main',
  githubRepo: '', // Default to empty string
  offlineMode: false,
  theme: 'auto',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  setSettings: (newSettings) => {
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      if (newSettings.autoSaveInterval !== undefined) {
        if (newSettings.autoSaveInterval > 0) {
          syncService.enableAutoSync(newSettings.autoSaveInterval);
        } else {
          syncService.disableAutoSync();
        }
      }
      return { settings: updatedSettings };
    });
  },
}));

// Initialize auto-sync with default settings
if (defaultSettings.autoSaveInterval > 0) {
  syncService.enableAutoSync(defaultSettings.autoSaveInterval);
}
