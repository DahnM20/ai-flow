import { useState } from "react";

type AsyncFunction<T extends any[], N> = (...args: T) => Promise<N>;

type LoadingAction<T extends any[], N> = (
  func: AsyncFunction<T, N>,
  ...args: T
) => Promise<N>;

export const useLoading = <T extends any[], N>(): [
  isLoading: boolean,
  startLoadingWith: LoadingAction<T, N>,
] => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoadingWith: LoadingAction<T, N> = async (func, ...args) => {
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
