import styled, { keyframes } from 'styled-components';
import { FaPlay, FaSpinner } from 'react-icons/fa';
import { memo, useContext } from 'react';

interface ButtonRunAllProps {
    onClick: () => void;
    isRunning: boolean;
}
const ButtonRunAll: React.FC<ButtonRunAllProps> = ({ onClick, isRunning }) => {

    return (
        <div className={`flex flex-row items-center justify-center gap-x-2 
                ${isRunning
                ? 'text-slate-200 bg-sky-500'
                : 'text-sky-500 ring-sky-800 bg-slate-800 ring-2'} 
                hover:bg-sky-500 
                hover:text-slate-200
                py-1 px-2 rounded-md cursor-pointer`} onClick={onClick}>
            <Button>
                {isRunning ? <Spinner className='text-xl ' /> : <FaPlay />}
            </Button>

            {
                !isRunning &&
                <div>
                    RUN ALL
                </div>
            }
        </div>
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