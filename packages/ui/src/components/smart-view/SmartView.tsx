import { useEffect, useState } from "react";
import RenderLayout, { Layout, LayoutIndex } from "./RenderLayout";
import NodePane from "./NodePane";

import { Node, Edge } from 'reactflow';
import { NodeProvider } from "../providers/NodeProvider";


interface SmartViewProps {
    layout?: Layout;
    nodes: Node[];
    onFlowChange?: (nodes: Node[], edges: Edge[]) => void;
    onLayoutChange: (layout: Layout) => void;
    isRunning: boolean;
    onRunChange: (isRunning: boolean) => void;
}

function SmartView({ layout, nodes, onFlowChange, onLayoutChange, isRunning, onRunChange }: SmartViewProps) {

    const [currentNodeRunning, setCurrentNodeRunning] = useState<string>('');

    const initialLayout: Layout = {
        type: 'horizontal',
        panes: [
            {
                minSize: 200,
                content: <NodePane index={0} onAttachNode={handleAttachNode} />,
            },
        ],
    };

    useEffect(() => {
        if (!layout && onLayoutChange) {
            onLayoutChange(initialLayout)
        }
    }, [])


    function handleAttachNode(index: LayoutIndex, nodeId?: string) {
        if (nodeId != null && !!layout) {
            onLayoutChange(attachNode(layout, index, nodeId));
        }
    }

    function attachNode(layout: Layout, index: LayoutIndex, nodeId: string): Layout {
        const newLayout = { ...layout, panes: layout?.panes ? [...layout.panes] : [] };

        if (typeof index === 'number') {
            newLayout.panes[index] = {
                nodeId,
                content: <NodePane index={index} nodeId={nodeId} onAttachNode={handleAttachNode} />
            };
            return newLayout;
        } else {
            const [first, ...rest] = index.split('-').map(Number);
            if ("content" in newLayout.panes[first] && typeof newLayout.panes[first].content === "object") {
                newLayout.panes[first].content = attachNode(newLayout.panes[first].content as Layout,
                    rest.length > 1 ? rest.join('-') : rest[0],
                    nodeId);
            }
            return newLayout;
        }
    }


    function splitPane(currentLayout: Layout, index: LayoutIndex, type: 'horizontal' | 'vertical', firstParentIndex?: LayoutIndex): Layout {
        const newLayout = { ...currentLayout, panes: [...currentLayout.panes] };

        if (firstParentIndex == null) {
            console.log("First call")
            console.log(`${currentLayout}  -- ${index} --- ${type}`)
            firstParentIndex = index;
        }

        if (typeof index === 'string' && index.includes('-')) {
            const [first, ...rest] = index.split('-').map(Number);
            if ("content" in newLayout.panes[first] && typeof newLayout.panes[first].content === "object") {
                console.log(` first : ${first}     ____  rest : ${rest}`)
                newLayout.panes[first].content = splitPane(newLayout.panes[first].content as Layout,
                    rest.length > 1 ? rest.join('-') : rest[0],
                    type, firstParentIndex);
            }
            return newLayout;
        } else {
            const paneIndex = typeof index === 'string' ? Number(index) : index;
            const parentNodeId = currentLayout.panes[paneIndex].nodeId != null ? currentLayout.panes[paneIndex].nodeId : undefined;
            const newPanes = [
                {
                    nodeId: parentNodeId,
                    content: <NodePane index={`${firstParentIndex}-0`} onAttachNode={handleAttachNode} nodeId={parentNodeId} />
                },
                {
                    content: <NodePane index={`${firstParentIndex}-1`} onAttachNode={handleAttachNode} />
                }
            ];

            console.log("else")

            newLayout.panes[paneIndex] = {
                content: {
                    type,
                    panes: newPanes
                }
            };
            return newLayout;
        }
    }

    function updateLayout(layout: Layout, index: LayoutIndex, type: 'horizontal' | 'vertical'): Layout {

        console.log('updateLayout with index:', index);
        return splitPane(layout, index, type);
    }

    function handleSplitVertical(index: LayoutIndex) {
        if (!!layout) {
            const updatedLayout = updateLayout(layout, index, 'vertical');
            onLayoutChange(updatedLayout);
        }
    }


    function handleSplitHorizontal(index: LayoutIndex) {
        if (!!layout) {
            const updatedLayout = updateLayout(layout, index, 'horizontal');
            onLayoutChange(updatedLayout);
        }
    }


    function handleDeletePane(index: LayoutIndex) {
        if (!!layout) {
            onLayoutChange(deletePane(layout, index));
        }
    }

    function deletePane(layout: Layout, index: LayoutIndex): Layout {
        const newLayout = { ...layout, panes: [...layout.panes] };

        if (typeof index === 'string' && !index.includes('-')) {
            index = +index;
        }

        if (typeof index === 'number') {
            newLayout.panes.splice(index, 1);
            return newLayout;
        } else {
            const [first, ...rest] = index.split('-').map(Number);
            if ("content" in newLayout.panes[first] && typeof newLayout.panes[first].content === "object") {
                newLayout.panes[first].content = deletePane(newLayout.panes[first].content as Layout, rest.join('-'));
            }
            return newLayout;
        }
    }

    function handleUpdateNodes(nodesUpdated: Node[], edgesUpdated: Edge[]): void {
        throw new Error("Function not implemented.");
    }

    function handleUpdateNodeData(nodeId: string, data: any): void {
        throw new Error("Function not implemented.");
    }


    return (
        <div className="w-full h-full bg-zinc-900/95">
            <div className="ml-10 h-full">
                <NodeProvider nodes={nodes} edges={[]} showOnlyOutput={false}
                    isRunning={isRunning} errorCount={0}
                    currentNodeRunning={currentNodeRunning}
                    onUpdateNodeData={handleUpdateNodeData} onUpdateNodes={handleUpdateNodes}>
                    {
                        !!layout
                        && <RenderLayout {...layout} onSplitHorizontal={handleSplitHorizontal} onSplitVertical={handleSplitVertical} onDelete={handleDeletePane} />
                    }

                </NodeProvider>
            </div>
        </div>
    )
}

export default SmartView;