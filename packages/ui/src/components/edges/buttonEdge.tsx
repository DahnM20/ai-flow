import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    useReactFlow,
} from 'reactflow';

export default function ButtonEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const { setEdges } = useReactFlow();

    const pathType = data?.pathType || 'bezier';

    let pathData = []
    switch (pathType) {
        case 'bezier':
            pathData = getBezierPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            });
            break;

        case 'smoothstep':
            pathData = getSmoothStepPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            });
            break;

        case 'step':
            pathData = getSmoothStepPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
                borderRadius: 0
            });
            break;

        case 'straight':
            pathData = getStraightPath({
                sourceX,
                sourceY,
                targetX,
                targetY,
            });
            break;

        default:
            pathData = getBezierPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            });
    }

    const edgePath = pathData[0]
    const labelX = pathData[1]
    const labelY = pathData[2]

    const onEdgeClick = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        // everything inside EdgeLabelRenderer has no pointer events by default
                        // if you have an interactive element, set pointer-events: all
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan "
                >
                    <button className="w-6 h-6 hover:w-7 hover:h-7 
                    text-slate-900/80 hover:text-red-700
                    text-xl hover:text-3xl
                    bg-slate-400 hover:bg-slate-300
                    transition-all duration-300 ease-in-out
                    flex items-center justify-center leading-none
                    rounded-full cursor-pointer border-slate-300 " onClick={onEdgeClick} onTouchEnd={onEdgeClick}>
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
