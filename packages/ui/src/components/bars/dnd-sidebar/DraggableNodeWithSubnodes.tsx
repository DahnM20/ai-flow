import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiGrid } from "react-icons/fi";
import DraggableNode from "./DraggableNode";
import { DnDNode } from "../../../nodes-configuration/sectionConfig";
import { SubnodeData } from "../../../nodes-configuration/types";
import { useTranslation } from "react-i18next";
import { DraggableNodeAdditionnalData } from "./types";

interface DraggableNodeWithSubnodesProps {
  nodeIndex: number;
  node: DnDNode;
  subNodeLabel: string;
  subNodesData: SubnodeData[];
  selectSubnodeComponent?: (props: {
    show: boolean;
    onClose: () => void;
    onValidate: (data?: any) => void;
  }) => JSX.Element;
  addNodeFromExt?: (
    type: string,
    data: DraggableNodeAdditionnalData & Record<string, unknown>,
  ) => void;
}

const DraggableNodeWithSubnodes: React.FC<DraggableNodeWithSubnodesProps> = ({
  nodeIndex,
  node,
  subNodeLabel,
  subNodesData,
  selectSubnodeComponent,
  addNodeFromExt,
}) => {
  const { t } = useTranslation("flow");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const toggleSubnodes = () => {
    setIsExpanded(!isExpanded);
  };

  const subNodes = subNodesData.map(
    (subnodeData: SubnodeData, index: number) => {
      const subNode = { ...node };
      subNode.label = subnodeData.label;
      subNode.isBeta = subnodeData.isBeta;
      subNode.isNew = subnodeData.isNew;
      subNode.helpMessage = subnodeData.description ?? node.helpMessage;

      return (
        <div
          className="w-full"
          key={`${nodeIndex}-${index}-${subnodeData.label}`}
        >
          <div className="relative ml-auto w-[80%] text-xs">
            <div className="absolute -top-1/2 left-[-16px] h-full w-px bg-gray-600"></div>
            {index !== subNodesData.length - 1 && (
              <div className="absolute left-[-16px] top-1 h-full w-px bg-gray-600"></div>
            )}
            <div className="absolute left-[-16px] top-1/2 h-px w-4 bg-gray-600"></div>
            <DraggableNode
              key={`${nodeIndex}-${index}-${subnodeData.label}`}
              node={subNode}
              id={`subnode-${subNode.type}-${index}`}
              additionnalConfig={subnodeData.configData}
              additionnalData={subnodeData.data}
            />
          </div>
        </div>
      );
    },
  );

  return (
    <div className="flex w-full flex-col">
      <div className="relative">
        <DraggableNode key={nodeIndex} node={node} />
      </div>
      <div className="flex flex-col space-y-1 overflow-hidden">
        <span
          className="mt-2 flex cursor-pointer flex-row items-center space-x-2 text-xs md:text-sm"
          onClick={toggleSubnodes}
        >
          <p>{subNodeLabel}</p>
          <span>
            {isExpanded ? (
              <FiChevronDown className="transition-colors duration-100 ease-in-out hover:text-slate-100" />
            ) : (
              <FiChevronRight className="transition-colors duration-100 ease-in-out hover:text-slate-100" />
            )}
          </span>
        </span>
        {isExpanded && (
          <>
            <div className="flex flex-col space-y-1 overflow-hidden">
              {subNodes}
            </div>
            {/* Only show the "Show More" button if the component hasn't been displayed yet */}
            {!!selectSubnodeComponent && !showMore && (
              <button
                type="button"
                className="bg-af-bg-2/30 hover:bg-af-bg-1 dark:bg-af-bg-1/70 dark:hover:bg-af-bg-1 ml-auto flex w-[75%] cursor-pointer items-center justify-center rounded p-2 text-xs font-semibold transition-colors duration-300 ease-in-out md:text-sm"
                onClick={() => setShowMore(true)}
              >
                <FiGrid className="mr-1" />
                {t("More Models")}
              </button>
            )}
            {/* Render the component returned by selectSubnodeComponent when showMore is true */}
            {!!selectSubnodeComponent && showMore && (
              <div className="mt-2 flex items-center justify-center">
                {selectSubnodeComponent({
                  show: true,
                  onClose: () => setShowMore(false),
                  onValidate: (data?: any) => {
                    if (!!data) {
                      if (!!addNodeFromExt) {
                        addNodeFromExt(node.type, {
                          ...data,
                          generateNow: true,
                        });
                      }
                    }
                    setShowMore(false);
                  },
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DraggableNodeWithSubnodes;
