import { useState } from "react";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import { ImageModal } from "./ImageModal";

interface ImageZoomableProps {
  src: string;
  alt: string;
}

export function ImageZoomable({ src, alt }: ImageZoomableProps) {
  const [isImageZoomed, setImageZoomed] = useState(false);

  const handleImageZoom = () => setImageZoomed(true);
  const handleCloseZoom = () => setImageZoomed(false);
  return (
    <>
      <div className="relative h-fit">
        <img src={src} alt={alt} className="h-auto w-fit object-cover" />
        <button
          onClick={handleImageZoom}
          className="absolute bottom-0 right-0 p-2 text-white"
        >
          <FaSearchPlus />
        </button>
      </div>
      {isImageZoomed && (
        <ImageModal src={src} alt={alt} onClose={handleCloseZoom} />
      )}
    </>
  );
}
