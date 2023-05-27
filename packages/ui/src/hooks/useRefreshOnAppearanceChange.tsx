import { useEffect } from 'react';

export const useRefreshOnAppearanceChange = (updateNodeInternals: (id: string) => void, id: string, deps: any[]) => {
  useEffect(() => {
    updateNodeInternals(id);
  }, deps);
};