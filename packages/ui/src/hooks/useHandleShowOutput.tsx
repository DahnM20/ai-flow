import { Dispatch, SetStateAction, useEffect } from "react";

interface UseHandleShowOutputProps {
  showOnlyOutput?: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setShowLogs?: Dispatch<SetStateAction<boolean>>;
}

const useHandleShowOutput = ({
  showOnlyOutput,
  setCollapsed,
  setShowLogs,
}: UseHandleShowOutputProps) => {
  useEffect(() => {
    if (showOnlyOutput !== undefined) {
      setCollapsed(showOnlyOutput);
      if (setShowLogs !== undefined && showOnlyOutput) {
        setShowLogs(showOnlyOutput);
      }
    }
  }, [showOnlyOutput, setCollapsed, setShowLogs]);
};

export default useHandleShowOutput;
