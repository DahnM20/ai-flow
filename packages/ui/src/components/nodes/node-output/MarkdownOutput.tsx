import React, { memo, useState } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

import "github-markdown-css";
import { FiCopy, FiMinus, FiPlus } from "react-icons/fi";
import { copyToClipboard } from "../../../utils/navigatorUtils";
import { toastFastInfoMessage } from "../../../utils/toastUtils";
import { useTranslation } from "react-i18next";

interface MarkdownOutputProps {
  data: string;
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ data }) => {
  const { t } = useTranslation("flow");
  const [fontSize, setFontSize] = useState(1.05);

  if (!data) return <p> </p>;

  const stringifiedData =
    typeof data === "string" ? data : JSON.stringify(data);

  const increaseFontSize = () => setFontSize((prevSize) => prevSize + 0.1);
  const decreaseFontSize = () => setFontSize((prevSize) => prevSize - 0.1);

  const handleCopyToClipboard = (event: any) => {
    event.stopPropagation();
    if (data) {
      copyToClipboard(data);
      toastFastInfoMessage(t("CopiedToClipboard"));
    }
  };

  return (
    <div className="relative">
      <StyledReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={stringifiedData}
        fontSize={fontSize}
        className="markdown-body px-8 pt-8 text-lg"
      />
      <IconContainer
        className="z-50"
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            increaseFontSize();
          }}
          aria-label="Increase text size"
          title="Increase text size"
        >
          <FiPlus />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            decreaseFontSize();
          }}
          aria-label="Decrease text size"
          title="Decrease text size"
        >
          <FiMinus />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleCopyToClipboard(e);
          }}
          className="copy-icon"
          aria-label="Copy text"
          title="Copy text"
        >
          <FiCopy />
        </IconButton>
      </IconContainer>
    </div>
  );
};

const IconButton = styled.div`
  cursor: pointer;
  transition: color 0.2s;
  color: #ffffff80;

  &:hover {
    color: #ffffff;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  top: 0;
  right: 0.1em;
`;

const StyledReactMarkdown = styled(ReactMarkdown)<{ fontSize: number }>`
  background-color: transparent !important;
  color: #f5f5f5;
  font-size: ${(props) => props.fontSize}em;
  user-select: text;
`;

export default memo(MarkdownOutput);
