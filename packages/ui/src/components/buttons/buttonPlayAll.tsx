import styled, { keyframes } from 'styled-components';
import { FaPlay, FaSpinner } from 'react-icons/fa';

interface ButtonPlayAllProps {
  onClick: () => void;
  isRunning: boolean;
}
const ButtonPlayAll: React.FC<ButtonPlayAllProps> = ({ onClick, isRunning }) => {
  return (
    <Button onClick={onClick}>
      {isRunning ? <Spinner /> : <FaPlay />}
    </Button>
  );
};

export default ButtonPlayAll;

const Button = styled.button`
  position: fixed;
  bottom: 30px;
  left: calc(50% - 25px);
  width: 50px;
  height: 50px;
  background: rgb(92 143 227 / 82%);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.4em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #3b4bb8;
    transform: scale(1.1);
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.4);
  }

  &:hover::after {
    content: "Run All";
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap; 
    color: #6576f8;
    padding: 5px;
    border-radius: 5px;
    font-size: 18px;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;