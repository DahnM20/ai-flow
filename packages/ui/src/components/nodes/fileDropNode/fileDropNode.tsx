import React, { useState } from 'react';
import styled from 'styled-components';
import { Accept, useDropzone } from 'react-dropzone';
import { FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { NodeProps, Handle, Position } from 'reactflow';


const FileDropNode: React.FC<NodeProps> = ({ id }) => {
  const [file, setFile] = useState<File | null>(null);

  const accept: Accept = {
    'text/plain': ['.txt'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  };

  const { getRootProps, getInputProps, isDragActive=false } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  return (
    <div style={{ position: 'relative' }}>
      <StyledFileDropNode {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        {file ? (
          <>
            <FaCheckCircle size={50} style={{ color: '#4bb543', marginBottom: '10px' }} />
            <p style={{ textAlign: 'center' }}>{file.name}</p>
          </>
        ) : (
          <>
            <FaFileAlt size={50} style={{ marginBottom: '10px' }} />
            <p style={{ textAlign: 'center' }}>{isDragActive ? 'Drop the file here' : 'Drag and drop a file here or click to select'}</p>
          </>
        )}
      </StyledFileDropNode>
      <Handle type="source" position={Position.Bottom} style={{ background: 'rgb(224, 166, 79)', width: '10px', height: '10px', borderRadius: '50%', position: 'absolute', bottom: '-5px', left: '50%' }} />
    </div>
  );
};


const StyledFileDropNode = styled.div<{ isDragActive: boolean }>`
  width: 250px;
  height: 150px;
  padding: 20px;
  border: 2px dashed ${({ isDragActive }) => (isDragActive ? '#85c4eb' : '#ddd')};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;
`;

export default FileDropNode;