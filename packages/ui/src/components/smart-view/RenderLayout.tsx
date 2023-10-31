import { Allotment } from "allotment";
import PaneWrapper from "./PaneWrapper";
import NodePane from "./NodePane";

export interface BasicPane {
    nodeId?: string;
    fieldName?: string;
    minSize?: number;
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
}

const RenderLayout = ({ type, panes, parentIndex, onSplitHorizontal, onSplitVertical, onDelete, onAttachNode }: RenderLayoutProps) => {

    function renderPaneFromData(paneData: BasicPane, index: LayoutIndex): JSX.Element {
        switch (paneData.paneType) {
            case 'NodePane':
                return <NodePane index={index} onAttachNode={onAttachNode} nodeId={paneData.nodeId} fieldName={paneData.fieldName} />;
            default:
                return <></>;
        }
    }

    return (
        <Allotment vertical={type === 'vertical'}>
            {panes.map((pane, index) => (
                <Allotment.Pane key={index} minSize={pane.minSize} snap={pane.snap}>
                    <PaneWrapper
                        name={pane.nodeId}
                        showTools={!(pane.content instanceof Object && 'panes' in pane.content)}
                        onSplitHorizontal={() => onSplitHorizontal(parentIndex != null ? `${parentIndex}-${index}` : index)}
                        onSplitVertical={() => onSplitVertical(parentIndex != null ? `${parentIndex}-${index}` : index)}
                        onDelete={() => onDelete(parentIndex != null ? `${parentIndex}-${index}` : index)}
                    >
                        {pane.content instanceof Object && 'panes' in pane.content ? (
                            <RenderLayout {...pane.content}
                                parentIndex={parentIndex != null ? `${parentIndex}-${index}` : index}
                                onSplitHorizontal={onSplitHorizontal}
                                onSplitVertical={onSplitVertical}
                                onAttachNode={onAttachNode}
                                onDelete={onDelete} />
                        ) : (
                            renderPaneFromData(pane, parentIndex != null ? `${parentIndex}-${index}` : index)
                        )}
                    </PaneWrapper>
                </Allotment.Pane>
            ))}
        </Allotment>
    );
};

export default RenderLayout;
