import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { getConfigViaType } from "../../../nodes-configuration/nodeConfig";
import { getIconComponent } from "../../nodes/utils/NodeIcons";
import NodePlayButton from "../../nodes/node-button/NodePlayButton";
import { useState } from "react";
import { LayoutIndex } from "../SmartView";

interface PaneWrapperProps {
  index?: LayoutIndex;
  children: JSX.Element;
  name?: string;
  fieldNames?: string[];
  showTools: boolean;
  onDelete: (index: LayoutIndex) => void;
}

function PaneWrapper({
  index,
  children,
  name,
  fieldNames,
  showTools,
  onDelete,
}: PaneWrapperProps) {
  const nodeType = name?.split("#")[1];
  let nodeConfig = null;
  if (!!nodeType) {
    nodeConfig = getConfigViaType(nodeType);
  }
  const NodeIconComponent = nodeConfig
    ? getIconComponent(nodeConfig?.icon)
    : null;

  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(false);

  return (
    <div
      className={`relative flex h-full w-full flex-col transition-all duration-500 ease-in-out ${showTools ? "rounded-xl" : ""}`}
      style={{
        border:
          showTools && isHeaderVisible
            ? "1px solid rgb(241 245 249 / 0.1)"
            : showTools
              ? "1px solid rgb(0 0 0 / 0)"
              : "",
      }}
      onMouseEnter={() => setIsHeaderVisible(true)}
      onMouseLeave={() => setIsHeaderVisible(false)}
    >
      {showTools && (
        <div
          className={`h-8 w-full transition-all duration-500 ease-in-out ${isHeaderVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className="flex items-center justify-center rounded-t-xl p-4
                                text-center text-slate-100/80 hover:text-slate-100"
          >
            <div
              className="text-md absolute left-0 flex flex-row items-center
                                    space-x-3 whitespace-nowrap 
                                    py-1 pl-2 text-center"
            >
              {NodeIconComponent && <NodeIconComponent />}
              {nodeType && <p>{nodeType + " - " + fieldNames}</p>}
            </div>
            <div
              className={`absolute right-0 space-x-2 px-2 ${showTools ? "" : "pointer-events-none"}`}
            >
              {name && <NodePlayButton nodeName={name} />}
              <PaneWrapperButton
                onClick={() => index != null && onDelete(index)}
              >
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
