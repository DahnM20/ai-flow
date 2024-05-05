import { Allotment } from "allotment";
import PaneWrapper from "./pane/PaneWrapper";
import NodePane from "./pane/NodePane";
import React, { useCallback } from "react";
import debounce from "lodash.debounce";
export interface BasicPane {
  nodeId?: string;
  fieldNames?: string[];
  minSize?: number;
  size: number;
  snap?: boolean;
  paneType?: "NodePane";
  content?: Layout;
  text?: string;
  options?: TextOptions;
}

export interface TextOptions {
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  color?: string;
  textAlign?: "left" | "center" | "right";
}

export interface Layout {
  type: "horizontal" | "vertical";
  panes: BasicPane[];
  parentIndex?: LayoutIndex;
}

export type LayoutIndex = string | number;

export interface RenderLayoutProps extends Layout {
  onSplitHorizontal: (index: LayoutIndex) => void;
  onSplitVertical: (index: LayoutIndex) => void;
  onDelete: (index: LayoutIndex) => void;
  onAttachNode: (
    index: LayoutIndex,
    nodeId?: string | undefined,
    fieldNames?: string[],
  ) => void;
  onAttachText: (index: LayoutIndex, text: string, options?: any) => void;
  onChangePaneSize?: (
    sizes: number[],
    panes: BasicPane[],
    parentIndex?: LayoutIndex,
  ) => void;
}

const RenderLayout = ({
  type,
  panes,
  parentIndex,
  onSplitHorizontal,
  onSplitVertical,
  onDelete,
  onAttachNode,
  onAttachText,
  onChangePaneSize,
}: RenderLayoutProps) => {
  const DEFAULT_SIZE = 20;
  const DEBOUNCE_MS_DELAY = 800;

  function renderPaneFromData(
    paneData: BasicPane,
    index: LayoutIndex,
  ): JSX.Element {
    switch (paneData.paneType) {
      case "NodePane":
        return (
          <NodePane
            index={index}
            onAttachNode={onAttachNode}
            onAttachText={onAttachText}
            nodeId={paneData.nodeId}
            fieldNames={paneData.fieldNames}
            paneData={paneData}
          />
        );
      default:
        return <></>;
    }
  }

  const debouncedOnChangeAllotmentSize = useCallback(
    debounce((sizes: number[]) => {
      const allSizesDefined = sizes.every((size) => size !== undefined);
      if (onChangePaneSize && allSizesDefined) {
        onChangePaneSize(sizes, panes, parentIndex);
      }
    }, DEBOUNCE_MS_DELAY),
    [],
  );

  return (
    <Allotment
      vertical={type === "vertical"}
      defaultSizes={panes.map((pane) => (pane.size ? pane.size : DEFAULT_SIZE))}
      onChange={debouncedOnChangeAllotmentSize}
    >
      {panes.map((pane, index) => {
        const isLeafPane = !(
          pane.content instanceof Object && "panes" in pane.content
        );
        return (
          <Allotment.Pane
            key={index}
            snap={pane.snap}
            className={`${isLeafPane ? " leafPane" : ""}`}
          >
            <div
              className={`${isLeafPane ? "h-full w-full px-1 py-2 " : "h-full w-full"}`}
            >
              <PaneWrapper
                name={pane.nodeId}
                fieldNames={pane.fieldNames}
                showTools={isLeafPane}
                onSplitHorizontal={() =>
                  onSplitHorizontal(
                    parentIndex != null ? `${parentIndex}-${index}` : index,
                  )
                }
                onSplitVertical={() =>
                  onSplitVertical(
                    parentIndex != null ? `${parentIndex}-${index}` : index,
                  )
                }
                onDelete={() =>
                  onDelete(
                    parentIndex != null ? `${parentIndex}-${index}` : index,
                  )
                }
              >
                {pane.content instanceof Object && "panes" in pane.content ? (
                  <RenderLayout
                    {...pane.content}
                    parentIndex={
                      parentIndex != null ? `${parentIndex}-${index}` : index
                    }
                    onSplitHorizontal={onSplitHorizontal}
                    onSplitVertical={onSplitVertical}
                    onAttachNode={onAttachNode}
                    onAttachText={onAttachText}
                    onDelete={onDelete}
                    onChangePaneSize={onChangePaneSize}
                  />
                ) : (
                  renderPaneFromData(
                    pane,
                    parentIndex != null ? `${parentIndex}-${index}` : index,
                  )
                )}
              </PaneWrapper>
            </div>
          </Allotment.Pane>
        );
      })}
    </Allotment>
  );
};

export default RenderLayout;
