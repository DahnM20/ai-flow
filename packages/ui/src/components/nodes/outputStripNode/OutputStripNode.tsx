import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styled from 'styled-components';

interface OutputStripNodeProps extends NodeProps { }

const OutputStripNode: React.FC<OutputStripNodeProps> = ({ id, selected }) => {
    const nbHandles = 5;
    return (
        <NodeContainer selected={selected}>
            <Handle className="handle" type="target" position={Position.Left} style={{ background: '#72c8fa', width: '10px', height: '10px' }} />
            <div className="output-strip-node-outputs">
                {Array.from(Array(nbHandles)).map((_, index) => (
                    <Handle
                        key={`output-${index}`}
                        type="source"
                        id={`output-${index}`}
                        position={Position.Right}
                        style={{
                            background: 'rgb(224, 166, 79)',
                            top: `${(index + 1) * (100 / 6)}%`, // calculate the top position based on the index
                            width: '10px',
                            height: '10px',
                            borderRadius: '0',
                        }}
                    />
                ))}
            </div>
        </NodeContainer>
    );
};

const NodeContainer = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: '#848484';
  padding: 10px;
  border: 1px solid ${(props) => (props.selected ? '#72c8fa' : '#ddd')};
  border-radius: 5px;
  box-shadow: ${(props) => (props.selected ? '0 0 5px #72c8fa' : 'none')};
  height: 200px;
  width: 30px;

  .handle {
    margin-right: 5px;
  }

  .output-strip-node-outputs {
    display: flex;
    flex-direction: row;
  }

  .handle-out {
    margin-left: 5px;
  }
`;

export default OutputStripNode;