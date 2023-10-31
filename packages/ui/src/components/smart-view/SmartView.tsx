import { useEffect, useState } from "react";
import RenderLayout, { BasicPane, Layout, LayoutIndex } from "./RenderLayout";
import { Node, Edge } from 'reactflow';
import { NodeProvider } from "../providers/NodeProvider";
import { useSocketListeners } from "../../hooks/useFlowSocketListeners";
import { toastInfoMessage } from "../../utils/toastUtils";
import { attachNode, splitPane, deletePane, layoutIsEmpty } from "./layoutUtils";


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

    useSocketListeners(onProgress, onError, onRunEnd, onCurrentNodeRunning)

    const initialLayout: Layout = {
        type: 'horizontal',
        panes: [
            {
                minSize: 200,
                paneType: 'NodePane'
            },
        ],
    };

    const [currentNodeRunning, setCurrentNodeRunning] = useState<string>('');
    const [currentLayout, setCurrentLayout] = useState<Layout | null>(!!tabLayout && !layoutIsEmpty(tabLayout) ? tabLayout : initialLayout);

    useEffect(() => {
        if (!!currentLayout) {
            onLayoutChange({ ...currentLayout })
        }
    }, [currentLayout?.panes])

    function onProgress(data: any) {
        const nodeToUpdate = data.instanceName as string;
        const output = data.output;

        if (nodeToUpdate && output) {
            const nodesUpdated = [...nodes]
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
        toastInfoMessage("Error")
    }

    function onRunEnd() {
        onRunChange(false);
    }

    function onCurrentNodeRunning(data: any) {
        setCurrentNodeRunning(data.instanceName);
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


    return (
        <div className="w-full h-full bg-zinc-900/95">
            <div className="ml-10 h-full">
                <NodeProvider nodes={nodes} edges={[]} showOnlyOutput={false}
                    isRunning={isRunning} errorCount={0}
                    currentNodeRunning={currentNodeRunning}
                    onUpdateNodeData={handleUpdateNodeData} onUpdateNodes={handleUpdateNodes}>
                    {
                        !!currentLayout
                        && <RenderLayout {...currentLayout}
                            onSplitHorizontal={handleSplitHorizontal}
                            onSplitVertical={handleSplitVertical}
                            onDelete={handleDeletePane}
                            onAttachNode={handleAttachNode} />
                    }

                </NodeProvider>
            </div>
        </div>
    )
}

export default SmartView;