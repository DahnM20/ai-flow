import { Allotment } from "allotment";
import PaneWrapper from "./PaneWrapper";
import NodePane from "./NodePane";
import React, { useCallback } from 'react';
import debounce from 'lodash.debounce';

export interface BasicPane {
    nodeId?: string;
    fieldName?: string;
    minSize?: number;
    size: number;
    snap?: boolean;
    paneType?: 'NodePane';
    content?: Layout;
}

export interface Layout {
    type: 'horizontal' | 'vertical';
    panes: BasicPane[];
    parentIndex?: LayoutIndex;
};

export type LayoutIndex = string | number;

export interface RenderLayoutProps extends Layout {
    onSplitHorizontal: (index: LayoutIndex) => void;
    onSplitVertical: (index: LayoutIndex) => void;
    onDelete: (index: LayoutIndex) => void;
    onAttachNode: (index: LayoutIndex, nodeId?: string | undefined, fieldName?: string) => void
    onChangePaneSize?: (sizes: number[], panes: BasicPane[], parentIndex?: LayoutIndex) => void
}

const RenderLayout = ({ type, panes, parentIndex, onSplitHorizontal, onSplitVertical, onDelete, onAttachNode, onChangePaneSize }: RenderLayoutProps) => {

    const DEFAULT_SIZE = 20;
    const DEBOUNCE_MS_DELAY = 800;

    function renderPaneFromData(paneData: BasicPane, index: LayoutIndex): JSX.Element {
        switch (paneData.paneType) {
            case 'NodePane':
                return <NodePane index={index} onAttachNode={onAttachNode} nodeId={paneData.nodeId} fieldName={paneData.fieldName} />;
            default:
                return <></>;
        }
    }

    const debouncedOnChangeAllotmentSize = useCallback(
        debounce((sizes: number[]) => {
            const allSizesDefined = sizes.every(size => size !== undefined);
            if (onChangePaneSize && allSizesDefined) {
                onChangePaneSize(sizes, panes, parentIndex);
            }
        }, DEBOUNCE_MS_DELAY),
        []
    );

    return (
        <Allotment vertical={type === 'vertical'}
            defaultSizes={panes.map((pane) => pane.size ? pane.size : DEFAULT_SIZE)}
            onChange={debouncedOnChangeAllotmentSize}>
            {panes.map((pane, index) => {

                const isLeafPane = !(pane.content instanceof Object && 'panes' in pane.content)
                return (
                    <Allotment.Pane key={index} snap={pane.snap} className={`${isLeafPane ? ' leafPane' : ''}`}>
                        < div className={`${isLeafPane ? 'px-1 py-2 h-full w-full ' : 'h-full w-full'}`
                        }>
                            < PaneWrapper
                                name={pane.nodeId}
                                fieldName={pane.fieldName}
                                showTools={isLeafPane}
                                onSplitHorizontal={() => onSplitHorizontal(parentIndex != null ? `${parentIndex}-${index}` : index)}
                                onSplitVertical={() => onSplitVertical(parentIndex != null ? `${parentIndex}-${index}` : index)}
                                onDelete={() => onDelete(parentIndex != null ? `${parentIndex}-${index}` : index)}
                            >
                                {pane.content instanceof Object && 'panes' in pane.content ? (
                                    <RenderLayout
                                        {...pane.content}
                                        parentIndex={parentIndex != null ? `${parentIndex}-${index}` : index}
                                        onSplitHorizontal={onSplitHorizontal}
                                        onSplitVertical={onSplitVertical}
                                        onAttachNode={onAttachNode}
                                        onDelete={onDelete}
                                        onChangePaneSize={onChangePaneSize} />
                                ) : (
                                    renderPaneFromData(pane, parentIndex != null ? `${parentIndex}-${index}` : index)
                                )}
                            </PaneWrapper>
                        </div>
                    </Allotment.Pane >
                )
            })}
        </Allotment >
    );
};

export default RenderLayout;
