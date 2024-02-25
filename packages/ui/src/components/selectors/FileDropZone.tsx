import { Accept, useDropzone } from "react-dropzone";
import { FaCheckCircle, FaFileAlt } from "react-icons/fa";

interface FileDropZoneProps {
  accept: Accept;
  onAcceptFile: (files: File[]) => void;
  oneFile: boolean;
  dragActiveText?: string;
  dropZoneText?: string;
  selectedFiles?: File[] | null;
  maxSize?: number;
}

const DEFAULT_MAX_SIZE = 314572800; // 300 MB

export default function FileDropZone({
  accept,
  onAcceptFile,
  oneFile,
  dragActiveText = "Drop the file here",
  dropZoneText = "Drag and drop a file here or click to select",
  selectedFiles,
  maxSize,
}: FileDropZoneProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive = false,
  } = useDropzone({
    accept,
    multiple: !oneFile,
    maxSize: maxSize ?? DEFAULT_MAX_SIZE,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        alert(
          "Some files were rejected due to exceeding the maximum size limit of 300MB.",
        );
      }

      if (oneFile) {
        onAcceptFile([acceptedFiles[0]]);
        return;
      }
      onAcceptFile(acceptedFiles);
    },
  });

  return (
    <div
      className={`${isDragActive ? " border-sky-300 " : "border-slate-500 "} 
        flex  flex-col items-center space-y-3 rounded-lg  border-2 border-dashed p-20 text-slate-200 transition-all hover:text-sky-300`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {!!selectedFiles ? (
        <>
          <FaCheckCircle className="text-4xl text-green-400" />
          <p>{selectedFiles.length} file(s) selected</p>
          {selectedFiles.map((file) => (
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
