import React from "react";
import { FaDownload } from "react-icons/fa";
import styled from "styled-components";
import { getGeneratedFileName } from "./outputUtils";

interface PdfUrlOutputProps {
  url: string;
  name: string;
}

const PdfUrlOutput: React.FC<PdfUrlOutputProps> = ({ url, name }) => {
  const handleDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = getGeneratedFileName(url, name); // Ensure getGeneratedFileName handles PDF filenames correctly
    link.target = "_blank";
    link.click();
  };

  return (
    <OutputPdfContainer>
      <OutputPdf data={url} type="application/pdf">
        <p>
          Your browser does not support PDFs. Please download the PDF to view
          it: <a href={url}>Download PDF</a>.
        </p>
      </OutputPdf>
      <div
        className="absolute right-3 top-2 rounded-md bg-slate-600/75 px-1 py-1 text-2xl text-slate-100 hover:bg-sky-600/90"
        onClick={handleDownloadClick}
      >
        <FaDownload />
      </div>
    </OutputPdfContainer>
  );
};

const OutputPdfContainer = styled.div`
  position: relative;
  margin-top: 10px;
  padding-top: 56.25%; // Maintain aspect ratio for PDF viewer
  height: 0; // Use padding to define height based on the container's width
  overflow: hidden;
`;

const OutputPdf = styled.object`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default PdfUrlOutput;
