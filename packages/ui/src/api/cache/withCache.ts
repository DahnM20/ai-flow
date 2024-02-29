import { generateCacheKey, getCache, setCache } from "./cacheManager";

type AsyncFunction<T extends any[], N> = (...args: T) => Promise<N>;

type Params<T> = T extends (...args: infer U) => any ? U : never;

interface CacheOptions {
  ttl: number;
  key?: string;
}

async function withCache<T extends any[], N>(
  fn: AsyncFunction<T, N>,
  options: CacheOptions,
  ...args: Params<AsyncFunction<T, N>>
): Promise<N>;

async function withCache<T extends any[], N>(
  fn: AsyncFunction<T, N>,
  ...args: Params<AsyncFunction<T, N>>
): Promise<N>;

async function withCache<T extends any[], N>(
  fn: AsyncFunction<T, N>,
  ...args:
    | Params<AsyncFunction<T, N>>
    | [CacheOptions, ...Params<AsyncFunction<T, N>>]
): Promise<N> {
  let options: CacheOptions | undefined = undefined;
  let parameters: Params<AsyncFunction<T, N>>;

  if (args.length > 0 && typeof args[0] === "object" && "ttl" in args[0]) {
    options = args.shift() as CacheOptions;
    parameters = args as Params<AsyncFunction<T, N>>;
  } else {
    parameters = args as Params<AsyncFunction<T, N>>;
  }

  let cacheKey = options?.key;

  if (cacheKey === undefined) {
    cacheKey = generateCacheKey(fn.name, ...parameters);
  }

  let cachedResult = getCache<N>(cacheKey);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const result = await fn(...parameters);
  setCache(cacheKey, result);
  return result;
}

export default withCache;
