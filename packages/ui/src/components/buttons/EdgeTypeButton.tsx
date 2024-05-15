import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface EdgeTypeIconEntry {
  src: string;
  edgeType: string;
}

interface EdgeTypeButtonProps {
  edgeType: string;
  onChangeEdgeType: (newEdgeType: string) => void;
}

export default function EdgeTypeButton({
  edgeType,
  onChangeEdgeType,
}: EdgeTypeButtonProps) {
  const { t } = useTranslation("flow");

  const edgeTypeIconsMapping = useMemo<EdgeTypeIconEntry[]>(
    () => [
      { src: `./curve-edge.svg`, edgeType: "default" },
      { src: `./smooth-step-edge.svg`, edgeType: "smoothstep" },
      { src: `./straight-edge.svg`, edgeType: "straight" },
      { src: `./step-edge.svg`, edgeType: "step" },
    ],
    [],
  );

  const handleChangeEdgeType = () => {
    const currentIndex = edgeTypeIconsMapping.findIndex(
      (et) => et.edgeType === edgeType,
    );
    const nextIndex = (currentIndex + 1) % edgeTypeIconsMapping.length;
    onChangeEdgeType(edgeTypeIconsMapping[nextIndex].edgeType);
  };

  const currentEdgeType = edgeTypeIconsMapping.find(
    (et) => et.edgeType === edgeType,
  );

  return (
    <div
      className="items-center overflow-hidden rounded-lg ring-1 ring-slate-400/30"
      onClick={handleChangeEdgeType}
      data-tooltip-id={`app-tooltip`}
      data-tooltip-content={t("EdgeType")}
    >
      <img
        className="h-full w-full"
        src={currentEdgeType?.src}
        alt={currentEdgeType?.edgeType}
      />
    </div>
  );
}
