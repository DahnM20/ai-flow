import React, { memo } from 'react';
import { marked } from "marked";
import * as DOMPurify from 'dompurify';

interface MarkdownOutputProps {
    data: string;
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ data }) => {
    if (!data) return <p> </p>

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);

    const html = marked(stringifiedData);
    const sanitizedHtml = DOMPurify.sanitize(html);

    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} style={{ paddingTop: '10px' }} />;
};


export default memo(MarkdownOutput);