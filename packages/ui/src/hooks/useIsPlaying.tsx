import { useContext, useEffect, useState } from "react";
import { NodeContext } from "../components/providers/NodeProvider";

export const useIsPlaying = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const { errorCount } = useContext(NodeContext);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [errorCount]);

  return [isPlaying, setIsPlaying];
}