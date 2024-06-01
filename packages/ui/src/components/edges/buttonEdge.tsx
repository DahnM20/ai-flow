import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
} from "reactflow";

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

  const pathType = data?.pathType || "bezier";

  let pathData = [];
  switch (pathType) {
    case "bezier":
      pathData = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      break;

    case "smoothstep":
      pathData = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      break;

    case "step":
      pathData = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 0,
      });
      break;

    case "straight":
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

  const edgePath = pathData[0];
  const labelX = pathData[1];
  const labelY = pathData[2];

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan "
        >
          <button
            className="flex h-6 w-6 cursor-pointer 
                    items-center justify-center
                    rounded-full border-slate-300
                    bg-slate-400 text-xl
                    leading-none text-slate-900/80 transition-all
                    duration-100 ease-in-out hover:h-7 hover:w-7
                    hover:bg-slate-300 hover:text-3xl hover:text-red-500 "
            onClick={onEdgeClick}
            onTouchEnd={onEdgeClick}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
