import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/navigatorUtils';
import MarkdownOutput from './MarkdownOutput';
import { CopyButton, CopyIcon, NodeLogs, NodeLogsText } from '../Node.styles';

interface NodeOutputProps {
  outputData: string;
}

const NodeOutput: React.FC<NodeOutputProps> = ({ outputData }) => {
  const [showLogs, setShowLogs] = useState(false);

  const handleCopy = () => {
    copyToClipboard(outputData);
  };

  return (
    <NodeLogs
      showLogs={showLogs}
      onClick={() => setShowLogs(!showLogs)}
    >
      <CopyButton onClick={handleCopy}>
        <CopyIcon />
      </CopyButton>
      {!showLogs ? <NodeLogsText>Click to show output</NodeLogsText> : <MarkdownOutput data={outputData} />}
    </NodeLogs>
  );
};

export default NodeOutput;