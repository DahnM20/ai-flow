import React, { memo } from 'react';
import remarkGfm from "remark-gfm";
import EaseOut from '../../shared/motions/EaseOut';
import ReactMarkdown from "react-markdown";
import styled from 'styled-components';

import "github-markdown-css"


interface MarkdownOutputProps {
    data: string;
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ data }) => {
    if (!data) return <p> </p>

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
    return <EaseOut><StyledReactMarkdown remarkPlugins={[remarkGfm]} children={stringifiedData} className="markdown-body px-8" /></EaseOut>;
};

const StyledReactMarkdown = styled(ReactMarkdown)`
    background-color: transparent !important;
`

export default memo(MarkdownOutput);