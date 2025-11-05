import { create } from 'zustand';
import type { AppSettings } from '../types';

interface SettingsState {
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  autoSaveInterval: 5, // minutes
  commitMessageTemplate: 'docs: update memo',
  defaultBranch: 'main',
  offlineMode: false,
  theme: 'auto',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  setSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));
