import type { Memo } from '../types';
import type { MemoService } from '../services';
import { storageService } from './storageService';
import { gitService } from './gitService';
import { createGitFs } from './gitFs';

const gitFs = createGitFs();
import { useMemoStore } from '../stores/memoStore';

export const memoService: MemoService = {
  async createMemo(title: string, content: string): Promise<Memo> {
    const newMemo: Memo = {
      id: Date.now().toString(), // Simple ID generation
      title,
      content,
      filePath: `memos/${title.replace(/\s/g, '-')}.md`, // Example file path
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await gitFs.promises.mkdir('memos');
    } catch (error) {
      // Ignore if the directory already exists, but log other errors.
      if ((error as any).code !== 'EEXIST') {
        console.error('Error creating memos directory:', error);
      }
    }
    await storageService.saveMemo(newMemo);
    try {
      await gitFs.promises.writeFile(newMemo.filePath, newMemo.content);
      console.log(`Memo file written: ${newMemo.filePath}`);
    } catch (error) {
      console.error(`Error writing memo file ${newMemo.filePath}:`, error);
      throw error; // Re-throw to ensure the test fails
    }
    await gitService.commit(`feat: create memo - ${title}`, [newMemo.filePath]);
    useMemoStore.getState().addMemo(newMemo);

    return newMemo;
  },

  async updateMemo(id: string, content: string): Promise<Memo> {
    const existingMemo = await storageService.loadMemo(id);
    if (!existingMemo) {
      throw new Error(`Memo with id ${id} not found.`);
    }

    const updatedMemo = {
      ...existingMemo,
      content,
      updatedAt: new Date(),
    };

    await storageService.saveMemo(updatedMemo);
    await gitFs.promises.writeFile(updatedMemo.filePath, updatedMemo.content);
    await gitService.commit(`fix: update memo - ${updatedMemo.title}`, [updatedMemo.filePath]);
    useMemoStore.getState().updateMemo(updatedMemo);

    return updatedMemo;
  },

  async deleteMemo(id: string): Promise<void> {
    const existingMemo = await storageService.loadMemo(id);
    if (!existingMemo) {
      throw new Error(`Memo with id ${id} not found.`);
    }

    await storageService.clearCache(); // Simplified: clear all for now
    // await gitService.deleteFile(existingMemo.filePath); // Git delete not implemented yet
    // await gitService.commit(`feat: delete memo - ${existingMemo.title}`, [existingMemo.filePath]);
    useMemoStore.getState().deleteMemo(id);
  },

  async getMemo(id: string): Promise<Memo> {
    const memo = await storageService.loadMemo(id);
    if (!memo) {
      throw new Error(`Memo with id ${id} not found.`);
    }
    return memo;
  },

  async listMemos(): Promise<Memo[]> {
    const memos = await storageService.loadAllMemos();
    useMemoStore.getState().setMemos(memos);
    return memos;
  },
};
