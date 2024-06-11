import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import NodePlayButton from "../../nodes/node-button/NodePlayButton";
import { useContext, useState } from "react";
import { BasicPane, LayoutIndex, PaneDataState } from "../LayoutView";
import { NodeContext } from "../../../providers/NodeProvider";

interface PaneWrapperProps {
  index?: LayoutIndex;
  children: JSX.Element;
  paneData?: BasicPane;
  showTools: boolean;
  onDelete: (index: LayoutIndex) => void;
}

function PaneWrapper({
  index,
  children,
  paneData,
  showTools,
  onDelete,
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
      className={`relative flex h-full w-full flex-col rounded-xl transition-all duration-500 ease-in-out ${!isHeading ? "bg-zinc-800/50" : ""}`}
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
      <div className={`w-full pt-2 transition-all duration-500 ease-in-out`}>
        <div
          className="flex cursor-move flex-col items-center justify-center rounded-t-xl
                                p-4 text-center text-slate-100 hover:text-teal-300"
        >
          <div
            className="absolute left-0 ml-3 flex flex-row items-center
                                    space-x-1 whitespace-nowrap 
                                    py-1 text-center text-lg font-bold"
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
            className={`absolute right-0 space-x-2 px-2 text-slate-100 ${isHeaderVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {nodeId && <NodePlayButton nodeName={nodeId} />}
            <PaneWrapperButton onClick={() => index != null && onDelete(index)}>
              <FaTimes />
            </PaneWrapperButton>
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
