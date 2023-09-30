import styled, { keyframes } from 'styled-components';
import { FaPlay, FaSpinner } from 'react-icons/fa';
import { memo, useContext } from 'react';

interface ButtonRunAllProps {
    onClick: () => void;
    isRunning: boolean;
}
const ButtonRunAll: React.FC<ButtonRunAllProps> = ({ onClick, isRunning }) => {

    return (
        <div className={`flex flex-row items-center gap-x-2 text-slate-100 
                        ${isRunning ? 'bg-sky-500' : 'bg-sky-800'} 
                        hover:bg-sky-500 
                        py-1 px-2 rounded-md cursor-pointer`} onClick={onClick}>
            <Button>
                {isRunning ? <Spinner className='text-xl' /> : <FaPlay />}
            </Button>

            {
                !isRunning &&
                <div className='text-slate-200'>
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