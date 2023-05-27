import { Dispatch, SetStateAction, useEffect } from 'react';

interface UseHandleShowOutputProps {
  showOnlyOutput?: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setShowLogs?: Dispatch<SetStateAction<boolean>>;
  updateNodeInternals: (id: string) => void;
  id: string;
}

const useHandleShowOutput = ({
  showOnlyOutput,
  setCollapsed,
  setShowLogs,
  updateNodeInternals,
  id
}: UseHandleShowOutputProps) => {
  useEffect(() => {
    if (showOnlyOutput !== undefined) {
      setCollapsed(showOnlyOutput);
      if(setShowLogs !== undefined){
        setShowLogs(showOnlyOutput);
      }
      updateNodeInternals(id);
    }
  }, [showOnlyOutput, setCollapsed, setShowLogs, updateNodeInternals, id]);
};

export default useHandleShowOutput;