import { generateCacheKey, getCache, setCache } from "./cacheManager";

type AsyncFunction<T extends any[], N> = (...args: T) => Promise<N>;

type Params<T> = T extends (...args: infer U) => any ? U : never;

type WithCache = <T extends any[], N>(
  func: AsyncFunction<T, N>,
  ...args: Params<AsyncFunction<T, N>>
) => Promise<N>;

const withCache: WithCache = async <T extends any[], N>(
  fn: AsyncFunction<T, N>,
  ...args: Params<AsyncFunction<T, N>>
): Promise<N> => {
  const cacheKey = generateCacheKey(fn.name, ...args);
  let cachedResult = getCache<N>(cacheKey);

  if (cachedResult !== undefined) {
    console.log("Cache hit");
    return cachedResult;
  }

  console.log("Cache miss");
  const result = await fn(...args);
  setCache(cacheKey, result);
  return result;
};

export default withCache;
