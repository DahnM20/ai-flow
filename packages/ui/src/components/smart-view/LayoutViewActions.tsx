import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaLock, FaLockOpen, FaPlusSquare } from "react-icons/fa";

interface SmartViewActionsProps {
  onAddPane: () => void;
  toggleLockView: () => void;
  viewLocked: boolean;
}
function SmartViewActions({
  onAddPane,
  toggleLockView,
  viewLocked,
}: SmartViewActionsProps) {
  const [portalAnchor, setPortalAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const portalAnchor = document.getElementById("view-action-portal");
    if (!portalAnchor) {
      console.error("Portal anchor element not found");
    }
    setPortalAnchor(portalAnchor);
  }, []);

  if (!portalAnchor) return null;

  return ReactDOM.createPortal(
    <div className="flex flex-row space-x-2">
      <FaPlusSquare
        className="hidden  text-slate-400 hover:text-slate-50 md:flex"
        onClick={onAddPane}
      />
      {viewLocked ? (
        <FaLock
          className="hidden  text-slate-400 hover:text-slate-50 md:flex"
          onClick={toggleLockView}
        />
      ) : (
        <FaLockOpen
          className="hidden  text-slate-400 hover:text-slate-50 md:flex"
          onClick={toggleLockView}
        />
      )}
    </div>,

    portalAnchor,
  );
}

export default SmartViewActions;
