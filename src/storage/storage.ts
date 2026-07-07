import { logger } from '@/utils';

import { asyncStorageAdapter } from './asyncStorageAdapter';
import type { StorageAdapter, StorageService } from './types';

class Storage implements StorageService {
  constructor(private readonly adapter: StorageAdapter = asyncStorageAdapter) {}

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.adapter.setItem(key, serialized);
    } catch (error) {
      logger.error(`Storage setItem failed for key: ${key}`, error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await this.adapter.getItem(key);

      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Storage getItem failed for key: ${key}`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.adapter.removeItem(key);
    } catch (error) {
      logger.error(`Storage removeItem failed for key: ${key}`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.adapter.clear();
    } catch (error) {
      logger.error('Storage clear failed', error);
      throw error;
    }
  }
}

export const storage = new Storage();

export const createStorage = (adapter: StorageAdapter): StorageService => {
  return new Storage(adapter);
};
