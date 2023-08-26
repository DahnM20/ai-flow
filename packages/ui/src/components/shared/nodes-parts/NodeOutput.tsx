import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/navigatorUtils';
import MarkdownOutput from './MarkdownOutput';
import { CopyButton, CopyIcon, NodeLogs, NodeLogsText } from '../Node.styles';

interface NodeOutputProps {
  output_data: string;
}

const NodeOutput: React.FC<NodeOutputProps> = ({ output_data }) => {
  const [showLogs, setShowLogs] = useState(false);

  const handleCopy = () => {
    copyToClipboard(output_data);
  };

  return (
    <NodeLogs
      showLogs={showLogs}
      onClick={() => setShowLogs(!showLogs)}
    >
      <CopyButton onClick={handleCopy}>
        <CopyIcon />
      </CopyButton>
      {!showLogs ? <NodeLogsText>Click to show output</NodeLogsText> : <MarkdownOutput data={output_data} />}
    </NodeLogs>
  );
};

export default NodeOutput;