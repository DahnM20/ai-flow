const ttl = 3600 * 1000; // 1 hour in milliseconds

export function generateCacheKey(functionName: string, ...args: any[]): string {
  const argsKey = JSON.stringify(args);
  return `${functionName}:${argsKey}`;
}

export function setCache(key: string, data: any) {
  const item = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCache<T>(key: string): T | undefined {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return;

  const item = JSON.parse(itemStr);
  const now = Date.now();

  if (now - item.timestamp > ttl) {
    localStorage.removeItem(key);
    return;
  }

  return item.data;
}
