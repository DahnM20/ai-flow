import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}
export function ImageModal({ src, alt, onClose }: ImageModalProps) {
  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        style={{ zIndex: 9999 }}
        onClick={onClose}
        onTouchStart={onClose}
      >
        <div className="relative p-2">
          <img src={src} alt={alt} className="max-h-full max-w-full" />
          <button
            onClick={onClose}
            onTouchStart={onClose}
            className="absolute right-1 top-1 p-2 text-white"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
