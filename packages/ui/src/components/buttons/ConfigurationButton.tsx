import React, { memo } from "react";
import { FiSettings } from "react-icons/fi";
import styled from "styled-components";

interface RightButtonProps {
  onClick: () => void;
  color?: string;
  icon?: React.ReactNode;
  text?: string;
  bottom?: string;
}

const RightIconButton: React.FC<RightButtonProps> = ({
  onClick,
  color = "#808080",
  icon = <FiSettings />,
  bottom = "30px",
}) => {
  return (
    <StyledRightButton
      className="config-button fixed right-0 z-20 mx-auto w-11 items-center rounded-l-lg py-1 pl-1 transition-all duration-150 ease-linear hover:bg-slate-700"
      color={color}
      bottom={bottom}
      onClick={onClick}
    >
      <div className="fon align-middle text-xl text-slate-200">{icon}</div>
    </StyledRightButton>
  );
};

const StyledRightButton = styled.div<{ color: string; bottom: string }>`
  bottom: ${(props) => props.bottom};
  background-color: ${(props) => props.color};
`;

export default memo(RightIconButton);
