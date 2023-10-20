import ReactDOM from "react-dom";
import styled, { CSSProperties } from "styled-components";
import { InputHandle, OutputHandle } from "../shared/Node.styles";
import { useMemo, useRef, useState } from "react";
import { Position } from "reactflow";
import React from "react";

export type LinkedHandlePositions = {
    [key in Position]: string[];
};

type HandleWrapperProps = {
    id: string;
    position: Position;
    linkedHandlePositions?: LinkedHandlePositions;
    isOutput?: boolean;
    onChangeHandlePosition: (newPosition: Position, id: string) => void;
};

const HandleWrapper: React.FC<HandleWrapperProps> = ({ id, position, onChangeHandlePosition, isOutput, linkedHandlePositions }) => {

    const HANDLE_DEFAULT_OFFSET = 20;
    const POPUP_DEFAULT_TOP_OFFSET = 10;

    const [showPopup, setShowPopup] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<Position>(position)
    const [popupCoords, setPopupCoords] = useState<{ x: number; y: number } | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);
    const closeTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (event: React.MouseEvent) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPopupCoords({ x: rect.left + rect.width / 2, y: rect.top - POPUP_DEFAULT_TOP_OFFSET });
            setShowPopup(true);
        }
    };

    const cancelClose = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    };

    const startClose = () => {
        closeTimeout.current = setTimeout(() => {
            setShowPopup(false);
        }, 500);
    };

    const changePosition = (newPosition: Position) => {
        setCurrentPosition(newPosition);
        onChangeHandlePosition(newPosition, id);
    }

    const adjustPositionByIndex = (): CSSProperties => {
        if (linkedHandlePositions == null) return {}

        const handleIndex = !!linkedHandlePositions[currentPosition] ? linkedHandlePositions[currentPosition].indexOf(id) : 0;

        switch (currentPosition) {
            case Position.Left:
            case Position.Right:
                return { marginTop: `${handleIndex * HANDLE_DEFAULT_OFFSET}px` };
            case Position.Top:
            case Position.Bottom:
                return { marginLeft: `${handleIndex * HANDLE_DEFAULT_OFFSET}px` };
            default:
                return {}
        }
    };

    return (
        <>
            {isOutput
                ? <OutputHandle ref={ref} className="handle-out" type="source" id={id} position={currentPosition}
                    style={adjustPositionByIndex()}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={startClose} />
                : <InputHandle ref={ref} className="handle" type="target" id={id} position={currentPosition}
                    style={adjustPositionByIndex()}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={startClose} />
            }
            {showPopup && popupCoords &&
                <Popup
                    currentPosition={currentPosition}
                    coords={popupCoords}
                    onCancelClose={cancelClose}
                    onStartClose={startClose}
                    onSelect={changePosition}
                    isOutput={isOutput}
                />}
        </>
    );
};

type PopupProps = {
    currentPosition: Position;
    onSelect: (position: Position) => void;
    coords: { x: number; y: number };
    onCancelClose: () => void;
    onStartClose: () => void;
    isOutput?: boolean;
};

const Popup: React.FC<PopupProps> = ({ currentPosition, onSelect, coords, onCancelClose, onStartClose, isOutput }) => {

    const handles = useMemo(() => [
        { src: `./handle-left${isOutput ? '-out' : ''}.svg`, position: Position.Left },
        { src: `./handle-right${isOutput ? '-out' : ''}.svg`, position: Position.Right },
        { src: `./handle-top${isOutput ? '-out' : ''}.svg`, position: Position.Top },
        { src: `./handle-bottom${isOutput ? '-out' : ''}.svg`, position: Position.Bottom },
    ], [isOutput]);

    const popupContent = (
        <StyledPopup
            className="fixed flex flex-col justify-center items-center text-center text-xs  text-slate-200 bg-slate-700 rounded-md"
            onMouseEnter={onCancelClose}
            onMouseLeave={onStartClose}
            style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
        >
            <div className="flex flex-row">
                {handles.map(handle => (
                    <img
                        key={handle.src}
                        src={handle.src}
                        className={`w-14 cursor-pointer ${handle.position === currentPosition ? 'opacity-100' : 'opacity-40'}`}
                        onClick={() => onSelect(handle.position)}
                        alt=""
                    />
                ))}
            </div>
        </StyledPopup>
    );

    return ReactDOM.createPortal(popupContent, document.body);
};

const StyledPopup = styled.div`
    transform: translate(-50%, -100%);
`;

export default HandleWrapper;