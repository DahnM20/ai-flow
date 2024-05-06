import React, { memo } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

import "github-markdown-css";

interface MarkdownOutputProps {
  data: string;
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ data }) => {
  if (!data) return <p> </p>;

  const stringifiedData =
    typeof data === "string" ? data : JSON.stringify(data);
  return (
    <StyledReactMarkdown
      remarkPlugins={[remarkGfm]}
      children={stringifiedData}
      className="markdown-body px-8 text-lg"
    />
  );
};

const StyledReactMarkdown = styled(ReactMarkdown)`
  background-color: transparent !important;
  color: #f5f5f5;
  font-size: 1.05em;
  user-select: text;
`;

export default memo(MarkdownOutput);
