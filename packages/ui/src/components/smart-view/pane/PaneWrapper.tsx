import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import NodePlayButton from "../../nodes/node-button/NodePlayButton";
import { useContext, useState } from "react";
import { BasicPane, LayoutIndex } from "../LayoutView";
import { NodeContext } from "../../../providers/NodeProvider";

interface PaneWrapperProps {
  index?: LayoutIndex;
  children: JSX.Element;
  paneData?: BasicPane;
  isEnabled: boolean;
  onDelete: (index: LayoutIndex) => void;
  onClickName: () => void;
}

function PaneWrapper({
  index,
  children,
  paneData,
  isEnabled,
  onDelete,
  onClickName,
}: PaneWrapperProps) {
  const { findNode } = useContext(NodeContext);

  let node = null;
  let hasCustomName = false;
  if (paneData?.nodeId) {
    node = findNode(paneData?.nodeId);
    hasCustomName = !!node?.data?.appearance?.customName;
  }
  const nodeId = paneData?.nodeId;
  const isHeading = paneData?.options?.isHeading;
  const fieldNames = paneData?.fieldNames;
  const hasMultipleFields = !!fieldNames && fieldNames?.length > 1;

  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(false);

  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-xl transition-all duration-500 ease-in-out ${!isHeading ? "bg-zinc-800/50 shadow-md" : ""}`}
      style={{
        border:
          isEnabled && isHeaderVisible
            ? "1px solid rgb(241 245 249 / 0.1)"
            : isEnabled
              ? "1px solid rgb(0 0 0 / 0)"
              : "",
      }}
      onMouseEnter={() => setIsHeaderVisible(true)}
      onMouseLeave={() => setIsHeaderVisible(false)}
    >
      <div className={`w-full pt-2 transition-all duration-500 ease-in-out`}>
        <div
          className={`absolute h-8 w-full ${isEnabled ? "cursor-move" : ""}`}
        ></div>
        <div
          className={`flex  flex-col items-center justify-center rounded-t-xl
                                ${node ? "p-4" : ""} text-center `}
        >
          <div
            className="absolute left-0 ml-3 flex flex-row items-center
                                    space-x-1 whitespace-nowrap 
                                    py-1 text-center text-lg font-bold text-slate-100 hover:text-teal-300"
            onClick={onClickName}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <p>
              {node && hasCustomName
                ? node.data.appearance.customName
                : node?.data.name}
            </p>
            <p>
              {!hasMultipleFields && !!fieldNames
                ? "- " + fieldNames[0]
                : undefined}
            </p>
          </div>
          <div
            className={`absolute right-0 space-x-2 px-2 text-slate-100 ${isHeaderVisible ? "opacity-100" : "pointer-events-none opacity-0"} ${!node ? "top-1" : ""}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {nodeId && <NodePlayButton nodeName={nodeId} size="medium" />}
            {isEnabled && (
              <PaneWrapperButton
                onClick={() => index != null && onDelete(index)}
              >
                <FaTimes />
              </PaneWrapperButton>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

const PaneWrapperButton = styled.button.attrs({
  className: "rounded p-1 hover:bg-sky-800/80",
})``;

export default PaneWrapper;
