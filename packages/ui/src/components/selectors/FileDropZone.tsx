import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FaCheckCircle, FaFileAlt } from "react-icons/fa";

interface FileDropZoneProps {
  accept: Accept;
  onAcceptFile: (files: File[]) => void;
  oneFile: boolean;
  dragActiveText?: string;
  dropZoneText?: string;
}

export default function FileDropZone({
  accept,
  onAcceptFile,
  oneFile,
  dragActiveText = "Drop the file here",
  dropZoneText = "Drag and drop a file here or click to select",
}: FileDropZoneProps) {
  const [files, setFiles] = useState<File[] | null>(null);

  const {
    getRootProps,
    getInputProps,
    isDragActive = false,
  } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (oneFile) {
        onAcceptFile([acceptedFiles[0]]);
        setFiles([acceptedFiles[0]]);
        return;
      }
      onAcceptFile(acceptedFiles);
      setFiles(acceptedFiles);
    },
  });

  return (
    <div
      className={`${isDragActive ? " border-sky-300 " : "border-slate-500 "} 
        flex  flex-col items-center space-y-3 rounded-lg  border-2 border-dashed p-4 text-slate-200 transition-all hover:text-sky-300`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {files ? (
        <>
          <FaCheckCircle className="text-4xl text-green-400" />
          <p>{files.length} file(s) selected</p>
          {files.map((file) => (
            <p key={file.name}>{file.name}</p>
          ))}
        </>
      ) : (
        <>
          <FaFileAlt className="text-4xl" />
          <p className="text-center text-lg">
            {isDragActive ? dragActiveText : dropZoneText}
          </p>
        </>
      )}
    </div>
  );
}
