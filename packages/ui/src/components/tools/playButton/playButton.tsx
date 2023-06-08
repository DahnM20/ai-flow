import styled, { keyframes } from 'styled-components';
import { FaPlay, FaSpinner } from 'react-icons/fa';

interface PlayButtonProps {
  onClick: () => void;
  isRunning: boolean;
}
const PlayButton: React.FC<PlayButtonProps> = ({ onClick, isRunning}) => {
  return (
    <Button onClick={onClick}>
      { isRunning ? <Spinner /> : <FaPlay />}
    </Button>
  );
};

export default PlayButton;

const Button = styled.button`
  position: fixed;
  bottom: 30px;
  left: calc(50% - 25px);
  width: 50px;
  height: 50px;
  background-color: #6576f8;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2); // Ajout d'une ombre portée

  &:hover {
    background-color: #3b4bb8;
    transform: scale(1.1); // Ajout d'une animation de zoom lors du survol
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.4); // Augmentation de l'ombre portée lors du survol
  }

  &:hover::after {
    content: "Run All";
    position: absolute;
    top: -40px; // Ajustez en fonction de votre design
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap; 
    color: #6576f8;
    padding: 5px;
    border-radius: 5px;
    font-size: 18px;
  }
`;

// Animation de rotation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Création d'un spinner animé
const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;