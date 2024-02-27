import { useState } from "react";

type AsyncFunction<T extends any[], N> = (...args: T) => Promise<N>;

type Params<T> = T extends (...args: infer U) => any ? U : never;

type StartLoadingWith = <T extends any[], N>(
  func: AsyncFunction<T, N>,
  ...args: Params<AsyncFunction<T, N>>
) => Promise<N>;

export const useLoading = (): [
  isLoading: boolean,
  startLoadingWith: StartLoadingWith,
] => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoadingWith: StartLoadingWith = async (func, ...args) => {
    setIsLoading(true);
    try {
      const result = await func(...args);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return [isLoading, startLoadingWith];
};
