import React, { useContext, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { NodeProps, Handle, Position, useUpdateNodeInternals } from 'reactflow';
import HandleWrapper from '../handles/HandleWrapper';
import { generateIdForHandle } from '../../utils/flowUtils';
import { NodeContext } from '../providers/NodeProvider';
import { useIsPlaying } from '../../hooks/useIsPlaying';
import NodePlayButton from '../shared/nodes-parts/NodePlayButton';


const FileDropNode: React.FC<NodeProps> = ({ data, id, selected }) => {


  const { hasParent, showOnlyOutput, isRunning, onUpdateNodeData } = useContext(NodeContext);
  const [files, setFiles] = useState<File[] | null>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [isPlaying, setIsPlaying] = useIsPlaying();

  const accept: Accept = {
    'text/plain': ['.txt'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  };

  const { getRootProps, getInputProps, isDragActive = false } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        if (!!files) {
          setFiles([...files, ...acceptedFiles]);
        } else {
          setFiles(acceptedFiles);
        }
      }
    },
  });

  const handleChangeHandlePosition = (newPosition: Position, handleId: string) => {
    onUpdateNodeData(id, {
      ...data,
      handles: {
        ...data.handles,
        [handleId]: newPosition
      }
    });
    updateNodeInternals(id);
  }

  const handlePlayClick = () => {
    setIsPlaying(true);
  };


  return (
    <div {...getRootProps()} className={`${isDragActive ? "border-sky-300 " : "border-slate-500 "}
                                        border-dashed border-2 rounded-lg 
                                        px-4 py-4 
                                        flex flex-col space-y-1 
                                        text-justify items-center
                                        text-slate-300
                                        w-80`}>
      <input {...getInputProps()} />
      {files ? (
        <>
          <FaCheckCircle className='text-4xl text-green-400' />
          <p>{files.length} file(s) selected</p>
          {
            files.map((file) => (
              <p key={file.name}>{file.name}</p>
            ))
          }
        </>
      ) : (
        <>
          <FaFileAlt className='text-4xl' />
          <p className='text-lg text-center'>{isDragActive ? 'Drop the file here' : 'Drag and drop a file here or click to select'}</p>
        </>
      )}
      <div className='mb-3'></div>
      <NodePlayButton isPlaying={isPlaying} hasRun={!!data.lastRun} onClick={handlePlayClick} nodeName={data.name} />
      <HandleWrapper id={generateIdForHandle(0)}
        position={
          !!data?.handles && data.handles[id]
            ? data.handles[id]
            : Position.Left}
        isOutput
        onChangeHandlePosition={handleChangeHandlePosition} />
    </div>
  );
};

export default FileDropNode;