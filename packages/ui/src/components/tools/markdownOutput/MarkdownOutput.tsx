import React from 'react';
import { marked } from "marked";
import * as DOMPurify from 'dompurify';

interface MarkdownOutputProps {
    data: string;
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ data }) => {
    if(!data) return <p> </p>

    const html = marked(data);
    const sanitizedHtml = DOMPurify.sanitize(html);
    return <pre dangerouslySetInnerHTML={{ __html: sanitizedHtml }} style={{ whiteSpace: 'pre-wrap' }}/>;
};

export default MarkdownOutput;