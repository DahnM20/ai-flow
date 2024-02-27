import { useContext, useEffect, useState } from "react";
import { NodeContext } from "../providers/NodeProvider";

/**
 * This hook stop playing animation whenever an error is raised globaly.
 */
export const useIsPlaying = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const { errorCount } = useContext(NodeContext);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [errorCount]);

  return [isPlaying, setIsPlaying];
};
