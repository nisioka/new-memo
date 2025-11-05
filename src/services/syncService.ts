import { gitService } from './gitService';
import type { SyncService, SyncResult } from '../services';
import { Errors } from 'isomorphic-git';
import { useNetworkStore } from '../stores/networkStore';

let autoSyncIntervalId: number | null = null;
let lastSyncTime: Date | null = null;

export const syncService: SyncService = {
  async syncToGitHub(): Promise<SyncResult> {
    if (!useNetworkStore.getState().isOnline) {
      return { success: false, details: 'Cannot sync while offline.' };
    }
    try {
      await gitService.push();
      lastSyncTime = new Date();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, details: errorMessage };
    }
  },

  async syncFromGitHub(): Promise<SyncResult> {
    if (!useNetworkStore.getState().isOnline) {
      return { success: false, details: 'Cannot sync while offline.' };
    }
    try {
      await gitService.pull();
      lastSyncTime = new Date();
      return { success: true };
    } catch (error) {
      if (error instanceof Errors.MergeConflictError) {
        return { success: false, details: 'Merge conflict detected', conflict: true, files: error.data };
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, details: errorMessage };
    }
  },

  enableAutoSync(interval: number): void {
    if (autoSyncIntervalId) {
      this.disableAutoSync();
    }

    autoSyncIntervalId = window.setInterval(async () => {
      if (!useNetworkStore.getState().isOnline) {
        return;
      }
      const pullResult = await this.syncFromGitHub();
      if (pullResult.success) {
        await this.syncToGitHub();
      } else if (pullResult.conflict) {
        // Stop auto-sync on conflict
        this.disableAutoSync();
        // Notify user about the conflict
        // This should be handled by the UI layer
        console.error('Merge conflict detected. Auto-sync disabled.');
      }
    }, interval * 60 * 1000); // interval is in minutes
  },

  disableAutoSync(): void {
    if (autoSyncIntervalId) {
      window.clearInterval(autoSyncIntervalId);
      autoSyncIntervalId = null;
    }
  },

  getLastSyncTime(): Date | null {
    return lastSyncTime;
  },
};
