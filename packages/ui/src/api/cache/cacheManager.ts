import { isCacheEnabled } from "../../config/config";

interface CacheItem<T> {
  data: T;
  ttl?: number;
  timestamp: number;
}

const DEFAULT_TTL = 3600 * 1000; // 1 hour
const DEFAULT_NB_ELEMENTS_TO_REMOVE = 5;
const DISPENSABLE_CACHE_PREFIX = "dispensable_cache";

export function generateCacheKey(functionName: string, ...args: any[]): string {
  const argsKey = JSON.stringify(args);
  return `${functionName}:${argsKey}`;
}

export function setCache(key: string, data: any, ttl?: number) {
  if (!isCacheEnabled()) return;
  const item = {
    data,
    ttl,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (err: any) {
    if (err.code == 22 || err.code == 1014) {
      clearOldCacheItems();
      localStorage.setItem(key, JSON.stringify(item));
    } else {
      throw new Error(err.message);
    }
  }
}

export function getCache<T>(key: string): T | undefined {
  if (!isCacheEnabled()) return;

  const itemStr = localStorage.getItem(key);
  if (!itemStr) return;

  const item = JSON.parse(itemStr) as CacheItem<T>;
  const now = Date.now();

  const ttl = item.ttl ?? DEFAULT_TTL;

  if (now - item.timestamp > ttl) {
    localStorage.removeItem(key);
    return;
  }

  return item.data;
}

function clearOldCacheItems() {
  const keys = Object.keys(localStorage);
  const items = keys
    .filter((key) => key.includes(DISPENSABLE_CACHE_PREFIX))
    .map((key) => ({
      key,
      data: JSON.parse(localStorage.getItem(key) ?? ""),
    }))
    .sort((a, b) => a.data.timestamp - b.data.timestamp);

  items.forEach((item, index) => {
    if (index <= DEFAULT_NB_ELEMENTS_TO_REMOVE) {
      localStorage.removeItem(item.key);
    }
  });
}
