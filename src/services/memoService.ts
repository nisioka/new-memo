import type { Memo } from '../types';
import type { MemoService } from '../services';
import { storageService } from './storageService';
import { gitService } from './gitService';

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

    await storageService.saveMemo(newMemo);
    await gitService.commit(`feat: create memo - ${title}`, [newMemo.filePath]);

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
    await gitService.commit(`fix: update memo - ${updatedMemo.title}`, [updatedMemo.filePath]);

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
  },

  async getMemo(id: string): Promise<Memo> {
    const memo = await storageService.loadMemo(id);
    if (!memo) {
      throw new Error(`Memo with id ${id} not found.`);
    }
    return memo;
  },

  async listMemos(): Promise<Memo[]> {
    return await storageService.loadAllMemos();
  },
};
