import React from 'react';
import { FiPlus } from 'react-icons/fi';
import './AddNodesButton.css';

interface AddNodesButtonProps {
  onClick: () => void;
}

const AddNodesButton: React.FC<AddNodesButtonProps> = ({ onClick }) => {
  return (
    <div className="add-nodes-button" onClick={onClick}>
      <FiPlus className="add-nodes-icon" />
    </div>
  );
};

export default AddNodesButton;