import { useEffect, useRef, useState } from "react";
import RenderLayout, { BasicPane, Layout, LayoutIndex } from "./RenderLayout";
import { Node, Edge } from 'reactflow';
import { NodeProvider } from "../../providers/NodeProvider";
import { useSocketListeners } from "../../hooks/useFlowSocketListeners";
import { toastInfoMessage } from "../../utils/toastUtils";
import { attachNode, splitPane, deletePane, layoutIsEmpty, updateLayoutSize } from "./utils/layoutUtils";


interface SmartViewProps {
    tabLayout?: Layout;
    nodes: Node[];
    edges: Edge[];
    onFlowChange?: (nodes: Node[], edges: Edge[]) => void;
    onLayoutChange: (layout: Layout) => void;
    isRunning: boolean;
    onRunChange: (isRunning: boolean) => void;
}

function SmartView({ tabLayout, nodes, edges, onFlowChange, onLayoutChange, isRunning, onRunChange }: SmartViewProps) {

    useSocketListeners(onProgress, onError, () => { }, onCurrentNodeRunning)

    const initialLayout: Layout = {
        type: 'horizontal',
        panes: [
            {
                size: 200,
                paneType: 'NodePane'
            },
        ],
    };

    const [currentNodesRunning, setCurrentNodesRunning] = useState<string[]>([]);
    const [currentLayout, setCurrentLayout] = useState<Layout | null>(!!tabLayout && !layoutIsEmpty(tabLayout) ? tabLayout : initialLayout);

    const nodesRef = useRef(nodes);
    nodesRef.current = nodes;

    useEffect(() => {
        if (!!currentLayout) {
            onLayoutChange({ ...currentLayout })
        }
    }, [currentLayout?.panes])

    useEffect(() => {
        const areNodesRunning = currentNodesRunning.length > 0
        if (isRunning !== areNodesRunning) {
            onRunChange(areNodesRunning)
        }

    }, [currentNodesRunning])

    function onProgress(data: any) {
        const nodeToUpdate = data.instanceName as string;
        const output = data.output;

        setCurrentNodesRunning((previous) => {
            return previous.filter((node) => node != nodeToUpdate);
        })

        if (nodeToUpdate && output) {
            const nodesUpdated = [...nodesRef.current]
            nodesUpdated.map((node: Node) => {
                if (node.data.name == nodeToUpdate) {
                    node.data = { ...node.data, outputData: output, lastRun: new Date() };
                }

                return node;
            });
            if (onFlowChange) {
                onFlowChange(nodesUpdated, edges);
            }
        }
    }

    function onError(data: any) {
        setCurrentNodesRunning((previous) => {
            return previous.filter((node) => node != data.instanceName);
        })
        toastInfoMessage("Error")
    }

    function onCurrentNodeRunning(data: any) {
        setCurrentNodesRunning((previous) => {
            return [...previous, data.instanceName];
        })
    }


    function handleAttachNode(index: LayoutIndex, nodeId?: string, fieldName?: string) {
        setCurrentLayout((currentLayout) => {
            if (nodeId != null && fieldName != null && !!currentLayout) {
                return attachNode(currentLayout, index, nodeId, fieldName);
            }
            return currentLayout;
        });
    }
    function updateLayout(layout: Layout, index: LayoutIndex, type: 'horizontal' | 'vertical'): Layout {
        return splitPane(layout, index, type);
    }

    function handleSplitVertical(index: LayoutIndex) {
        setCurrentLayout((currentLayout) => {
            if (!!currentLayout) {
                return updateLayout(currentLayout, index, 'vertical');
            }
            return currentLayout;
        });
    }


    function handleSplitHorizontal(index: LayoutIndex) {
        setCurrentLayout((currentLayout) => {
            if (!!currentLayout) {
                return updateLayout(currentLayout, index, 'horizontal');
            }
            return currentLayout;
        });
    }


    function handleDeletePane(index: LayoutIndex) {
        setCurrentLayout((currentLayout) => {
            if (!!currentLayout) {
                return deletePane(currentLayout, index);
            }
            return currentLayout;
        });
    }


    function handleUpdateNodes(nodesUpdated: Node[], edgesUpdated: Edge[]): void {
        throw new Error("Function not implemented.");
    }

    function handleUpdateNodeData(nodeId: string, data: any): void {
        const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
                return { ...node, data };
            }
            return node;
        });
        onFlowChange?.(updatedNodes, edges);
    }

    function handleChangePaneSize(sizes: number[], panes: BasicPane[], parentIndex?: LayoutIndex): void {
        setCurrentLayout((currentLayout) => {
            if (!!currentLayout) {
                return updateLayoutSize(currentLayout, parentIndex ? parentIndex : 0, sizes);
            }
            return currentLayout;
        });
    }

    return (
        <div className="smart-view w-full h-full">
            <div className="ml-10 h-full">
                <NodeProvider nodes={nodes} edges={edges} showOnlyOutput={false}
                    isRunning={isRunning} errorCount={0}
                    currentNodesRunning={currentNodesRunning}
                    onUpdateNodeData={handleUpdateNodeData} onUpdateNodes={handleUpdateNodes}>
                    {
                        !!currentLayout
                        && <RenderLayout {...currentLayout}
                            onSplitHorizontal={handleSplitHorizontal}
                            onSplitVertical={handleSplitVertical}
                            onDelete={handleDeletePane}
                            onAttachNode={handleAttachNode}
                            onChangePaneSize={handleChangePaneSize} />
                    }

                </NodeProvider>
            </div>
        </div>
    )
}

export default SmartView;