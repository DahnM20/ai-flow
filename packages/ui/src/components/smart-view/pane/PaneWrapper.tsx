import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { MdOutlineVerticalSplit, MdHorizontalSplit } from "react-icons/md";
import { getConfigViaType } from "../../../nodes-configuration/nodeConfig";
import { ICON_MAP } from "../../nodes/utils/NodeIcons";
import NodePlayButton from "../../nodes/node-button/NodePlayButton";

interface PaneWrapperProps {
  children: JSX.Element;
  name?: string;
  fieldName?: string;
  showTools: boolean;
  onSplitHorizontal: () => void;
  onSplitVertical: () => void;
  onDelete: () => void;
}

function PaneWrapper({
  children,
  name,
  fieldName,
  showTools,
  onSplitHorizontal,
  onSplitVertical,
  onDelete,
}: PaneWrapperProps) {
  const nodeType = name?.split("#")[1];
  let nodeConfig = null;
  if (!!nodeType) {
    nodeConfig = getConfigViaType(nodeType);
  }
  const NodeIconComponent = nodeConfig ? ICON_MAP[nodeConfig?.icon] : null;

  return (
    <div
      className={`relative flex h-full flex-col ${showTools ? "rounded-xl bg-subtle-gradient" : ""}`}
    >
      {showTools && (
        <div className="h-8 w-full">
          <div
            className="group flex items-center justify-center rounded-t-xl p-4
                                text-center text-slate-100/80 hover:text-slate-100"
          >
            <div
              className="text-md absolute left-0 flex flex-row items-center
                                    space-x-3 whitespace-nowrap 
                                    py-1 pl-2 text-center"
            >
              {NodeIconComponent && <NodeIconComponent />}
              {nodeType && <p>{nodeType + " - " + fieldName}</p>}
            </div>
            <div
              className={`absolute right-0 space-x-2 px-2 
                        ${
                          name
                            ? "invisible rounded-xl bg-[#1E1E1F] transition-opacity duration-200 ease-linear group-hover:visible group-hover:opacity-100"
                            : ""
                        }`}
            >
              {name && <NodePlayButton nodeName={name} />}
              <PaneWrapperButton onClick={onSplitHorizontal}>
                <MdOutlineVerticalSplit />
              </PaneWrapperButton>
              <PaneWrapperButton onClick={onSplitVertical}>
                <MdHorizontalSplit />
              </PaneWrapperButton>
              <PaneWrapperButton onClick={onDelete}>
                <FaTimes />
              </PaneWrapperButton>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

const PaneWrapperButton = styled.button.attrs({
  className: "rounded p-1 hover:bg-sky-800/80",
})``;

export default PaneWrapper;
