import styled, { keyframes } from 'styled-components';
import { FaPlay, FaSpinner } from 'react-icons/fa';
import { memo, useContext } from 'react';
import TapScale from '../shared/motions/TapScale';

interface ButtonRunAllProps {
    onClick: () => void;
    isRunning: boolean;
}
const ButtonRunAll: React.FC<ButtonRunAllProps> = ({ onClick, isRunning }) => {

    return (
        <TapScale>
            <div className={`flex flex-row items-center justify-center gap-x-2 
                ${isRunning
                    ? 'text-slate-200 bg-[#86D8F0]'
                    : 'text-[#86D8F0] ring-sky-800 bg-slate-800 ring-2'} 
                hover:ring-sky-500
                hover:text-sky-100
                transition-all
                py-1 px-2 rounded-md cursor-pointer`} onClick={onClick}>
                <Button>
                    {isRunning ? <Spinner className='text-xl ' /> : <FaPlay />}
                </Button>

                {
                    !isRunning &&
                    <div className="hidden md:flex">
                        RUN ALL
                    </div>
                }
            </div>
        </TapScale>
    );
};

export default memo(ButtonRunAll);

const Button = styled.button`
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;