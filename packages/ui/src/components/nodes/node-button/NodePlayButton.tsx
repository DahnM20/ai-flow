import React, { useContext, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { FaCheck, FaPlay, FaStop } from "react-icons/fa";
import { NodeContext } from "../../../providers/NodeProvider";
import TapScale from "../../shared/motions/TapScale";
import * as NodeStyles from "../Node.styles";

interface NodePlayButtonProps {
  isPlaying?: boolean;
  hasRun?: boolean;
  onClick?: () => void;
  nodeName: string;
}

const NodePlayButton: React.FC<NodePlayButtonProps> = ({
  isPlaying,
  hasRun,
  onClick,
  nodeName,
}) => {
  const { runNode, isRunning, currentNodesRunning } = useContext(NodeContext);
  const [isHovered, setHovered] = useState(false);

  const handleClick = () => {
    if (!isPlaying) {
      if (runNode(nodeName) && onClick) {
        onClick();
      }
    }
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const isCurrentNodeRunning = currentNodesRunning.includes(nodeName);
  const isDisabled = isCurrentNodeRunning && !isHovered;

  const IconComponent = getIconComponent(
    isPlaying,
    isCurrentNodeRunning,
    hasRun,
    isHovered,
  );

  return (
    <NodePlayButtonContainer
      className="node-play-button"
      onClick={handleClick}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TapScale scale={0.5}>
        <IconComponent />
      </TapScale>
    </NodePlayButtonContainer>
  );
};

function getIconComponent(
  isPlaying: boolean | undefined,
  isCurrentNodeRunning: boolean,
  hasRun: boolean | undefined,
  isHovered: boolean,
) {
  if (isPlaying || isCurrentNodeRunning) return NodeStyles.LoadingIcon;

  if (hasRun && !isHovered) return CheckIcon;

  return isCurrentNodeRunning ? NodeStopButtonIcon : NodePlayButtonIcon;
}

const NodePlayButtonContainer = styled.button<{ disabled?: boolean }>`
  cursor: pointer;
  color: ${(props) => (props.disabled ? "#888" : "#7bb380")};

  &:hover {
    color: ${(props) => (props.disabled ? "#888" : "#57ff2d")};
  }
`;

const NodePlayButtonIcon = styled(FaPlay)`
  transition: transform 0.3s ease-in-out;
`;

const NodeStopButtonIcon = styled(FaStop)`
  transition: transform 0.3s ease-in-out;
`;

const CheckIcon = styled(FaCheck)`
  transition: transform 0.3s ease-in-out;
`;

export default NodePlayButton;
