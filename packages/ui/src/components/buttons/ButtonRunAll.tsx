import styled, { keyframes } from "styled-components";
import { FaPlay, FaSpinner } from "react-icons/fa";
import { memo } from "react";
import TapScale from "../shared/motions/TapScale";
import { Tooltip } from "react-tooltip";

interface ButtonRunAllProps {
  onClick: () => void;
  isRunning: boolean;
  small?: boolean;
}
const ButtonRunAll: React.FC<ButtonRunAllProps> = ({
  onClick,
  isRunning,
  small,
}) => {
  return (
    <TapScale>
      <button
        id="run-all-button"
        className={`flex flex-row items-center justify-center gap-x-2 
                ${
                  isRunning
                    ? "bg-[#86D8F0] text-slate-200"
                    : "bg-slate-800 text-[#86D8F0] ring-2 ring-sky-800"
                } 
                z-50
                cursor-pointer
                rounded-md
                px-2 py-2 transition-all hover:text-sky-100 hover:ring-sky-500`}
        onClick={onClick}
      >
        {isRunning ? <Spinner className="text-xl " /> : <FaPlay />}
        {!isRunning && !small && <div className="hidden md:flex">RUN ALL</div>}
      </button>
    </TapScale>
  );
};

export default memo(ButtonRunAll);

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;
