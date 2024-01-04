import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

export interface EdgeTypeIconEntry {
    src: string;
    edgeType: string;
}

interface EdgeTypeButtonProps {
    edgeType: string;
    onChangeEdgeType: (newEdgeType: string) => void;
}

export default function EdgeTypeButton({ edgeType, onChangeEdgeType }: EdgeTypeButtonProps) {
    const { t } = useTranslation('flow');

    const edgeTypeIconsMapping = useMemo<EdgeTypeIconEntry[]>(() => [
        { src: `./curve-edge.svg`, edgeType: 'default' },
        { src: `./smooth-step-edge.svg`, edgeType: 'smoothstep' },
        { src: `./straight-edge.svg`, edgeType: 'straight' },
        { src: `./step-edge.svg`, edgeType: 'step' },
    ], []);


    const handleChangeEdgeType = () => {
        const currentIndex = edgeTypeIconsMapping.findIndex(et => et.edgeType === edgeType);
        const nextIndex = (currentIndex + 1) % edgeTypeIconsMapping.length;
        onChangeEdgeType(edgeTypeIconsMapping[nextIndex].edgeType);
    };

    const currentEdgeType = edgeTypeIconsMapping.find(et => et.edgeType === edgeType)


    return (
        <div className='ring-slate-400/30 ring-1 rounded-lg items-center'
            onClick={handleChangeEdgeType}
            data-tooltip-id={`edge-type-button-tooltip`}
            data-tooltip-content={t("EdgeType")}>
            <img className="h-full w-full" src={currentEdgeType?.src} alt={currentEdgeType?.edgeType} />
            <Tooltip id={`edge-type-button-tooltip`} style={{ zIndex: 100 }} />
        </div>
    )

}