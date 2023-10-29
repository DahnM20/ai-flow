import { Allotment } from "allotment";
import PaneWrapper from "./PaneWrapper";

export interface BasicPane {
    nodeId?: string;
    minSize?: number;
    snap?: boolean;
    content: JSX.Element | Layout;
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
}

const RenderLayout = ({ type, panes, parentIndex, onSplitHorizontal, onSplitVertical, onDelete }: RenderLayoutProps) => {
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
                                onDelete={onDelete} />
                        ) : (
                            pane.content
                        )}
                    </PaneWrapper>
                </Allotment.Pane>
            ))}
        </Allotment>
    );
};

export default RenderLayout;
