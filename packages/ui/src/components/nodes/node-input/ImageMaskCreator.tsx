import { Button, Slider } from "@mantine/core";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { MdRemove, MdUndo } from "react-icons/md";
import { BsFillEraserFill } from "react-icons/bs";

interface ImageMaskCreatorProps {
  onSave: (maskDataUrl: string) => void;
  imageUrls?: string[];
}

export const ImageMaskCreator: React.FC<ImageMaskCreatorProps> = ({
  onSave,
  imageUrls = [],
}) => {
  const { t } = useTranslation("flow");

  const [activeTab, setActiveTab] = useState<"url" | "select" | "custom">(
    imageUrls.length > 0 ? "select" : "url",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [penSize, setPenSize] = useState(10);

  const [originalWidth, setOriginalWidth] = useState(800);
  const [originalHeight, setOriginalHeight] = useState(600);
  const [displayWidth, setDisplayWidth] = useState(800);
  const [displayHeight, setDisplayHeight] = useState(600);
  const [scaleFactor, setScaleFactor] = useState(1);

  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);

  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  // Listen for image load changes to adjust canvas dimensions
  useEffect(() => {
    if ((activeTab === "url" || activeTab === "select") && imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        calculateDimensions(img.width, img.height);
      };
    } else if (activeTab === "custom") {
      calculateDimensions(customWidth, customHeight);
    }
  }, [imageUrl, customWidth, customHeight, activeTab]);

  // Undo feature: Listen for Ctrl+Z / Cmd+Z to remove the last stroke
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault(); // Prevent default undo behavior
        if (canvasRef.current) {
          canvasRef.current.undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const calculateDimensions = (width: number, height: number) => {
    const maxWidth = 800; // Maximum display width
    const maxHeight = 600; // Maximum display height
    let scale = 1;

    if (width > maxWidth || height > maxHeight) {
      // Calculate scale factor to fit the image within the modal
      const widthScale = maxWidth / width;
      const heightScale = maxHeight / height;
      scale = Math.min(widthScale, heightScale);
    }

    setOriginalWidth(width);
    setOriginalHeight(height);
    setDisplayWidth(width * scale);
    setDisplayHeight(height * scale);
    setScaleFactor(scale);
  };

  const handleSave = async () => {
    if (canvasRef.current) {
      try {
        const paths = await canvasRef.current.exportPaths();
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = originalWidth;
        tempCanvas.height = originalHeight;
        const context = tempCanvas.getContext("2d");

        if (context) {
          // Fill background with black
          context.fillStyle = "black";
          context.fillRect(0, 0, originalWidth, originalHeight);

          // Set stroke style to white
          context.strokeStyle = "white";
          context.lineCap = "round";

          // Redraw the paths onto the temp canvas
          paths.forEach((stroke) => {
            context.lineWidth = stroke.strokeWidth / scaleFactor;
            context.beginPath();
            stroke.paths.forEach((point: any, idx: number) => {
              const x = point.x / scaleFactor;
              const y = point.y / scaleFactor;
              if (idx === 0) {
                context.moveTo(x, y);
              } else {
                context.lineTo(x, y);
              }
            });
            context.stroke();
          });

          // Export the mask image
          const dataUrl = tempCanvas.toDataURL();
          onSave(dataUrl);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSelectImageUrl = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="text-af-text-title">
      <div className="flex flex-col space-y-6 text-sm md:text-base">
        {/* Tabs for selecting input method */}
        <div className="flex space-x-4 border-b border-gray-700">
          <button
            className={`px-4 py-2 focus:outline-none ${
              activeTab === "url"
                ? "border-b-2 border-teal-400 text-teal-400"
                : "text-af-text-secondary hover:text-teal-400"
            }`}
            onClick={() => setActiveTab("url")}
          >
            {t("EnterImageURLTab")}
          </button>
          {imageUrls.length > 0 && (
            <button
              className={`px-4 py-2 focus:outline-none ${
                activeTab === "select"
                  ? "border-b-2 border-teal-400 text-teal-400"
                  : "text-af-text-secondary hover:text-teal-400"
              }`}
              onClick={() => {
                setActiveTab("select");
                setImageUrl("");
              }}
            >
              {t("ChooseExistingImage")}
            </button>
          )}
          <button
            className={`px-4 py-2 focus:outline-none ${
              activeTab === "custom"
                ? "border-b-2 border-teal-400 text-teal-400"
                : "text-af-text-secondary hover:text-teal-400"
            }`}
            onClick={() => {
              setActiveTab("custom");
              setImageUrl("");
            }}
          >
            {t("CustomDimensions")}
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "url" && (
          <div className="mt-4">
            <label className="text-af-text-title mb-1 block text-sm font-medium">
              {t("ImageURL")}
            </label>
            <input
              type="text"
              placeholder={t("EnterImageURLPlaceholder") ?? "Enter Image URL"}
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="bg-af-bg-1 text-af-text-title w-full rounded-md border border-gray-700 px-3 py-2 focus:border-teal-400 focus:ring-teal-400"
            />
          </div>
        )}

        {activeTab === "select" && imageUrls.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md mb-2 font-medium">{t("SelectAnImage")}</h4>
            <div className="flex flex-wrap gap-4">
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={t("PreviewImage", { index }) ?? "Enter Image URL"}
                  className={`h-28 w-28 cursor-pointer rounded-md object-cover shadow ${
                    imageUrl === url
                      ? "ring-2 ring-teal-400"
                      : "ring-1 ring-gray-700"
                  }`}
                  onClick={() => handleSelectImageUrl(url)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "custom" && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium ">
                {t("WidthPx")}
              </label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="bg-af-bg-1 mt-1 block w-full rounded-md border border-gray-700  px-3 py-2  focus:border-teal-400 focus:ring-teal-400"
                min="1"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium ">
                {t("HeightPx")}
              </label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="bg-af-bg-1 mt-1 block w-full rounded-md border border-gray-700  px-3 py-2  focus:border-teal-400 focus:ring-teal-400"
                min="1"
              />
            </div>
          </div>
        )}
      </div>

      {(imageUrl || activeTab === "custom") && (
        <div className="mt-4 md:mt-8">
          {/* Pen Size, Clear and Undo Buttons */}
          <div className="flex items-center space-x-4">
            <label className="text-xs font-medium md:text-sm">
              {t("PenSize")}
            </label>
            <div className="flex items-center space-x-2">
              <Slider
                value={penSize}
                onChange={setPenSize}
                min={5}
                max={256}
                step={1}
                className="w-32"
              />
              <span className="text-xs md:text-sm">{penSize}px</span>
            </div>
            <button
              onClick={handleUndo}
              className="text-af-text-element inline-flex items-center rounded-md border border-transparent bg-blue-600/20 px-3 py-2 text-xs font-medium hover:bg-blue-700/50 md:text-sm"
            >
              <MdUndo size={16} className="mr-1" />
              {t("UndoStroke")}
            </button>
            <button
              onClick={handleClearCanvas}
              className="text-af-text-element ml-auto inline-flex items-center rounded-md border border-transparent bg-red-600/20 px-3 py-2 text-xs font-medium hover:bg-red-700/50 md:text-sm"
            >
              <BsFillEraserFill size={16} className="mr-1" />
              {t("ClearStrokes")}
            </button>
            <div className="hidden flex-grow justify-end md:flex">
              <Button onClick={handleSave} color="cyan">
                {t("SaveMask")}
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div
            className="mx-auto mt-6 overflow-hidden"
            style={{ width: displayWidth, height: displayHeight }}
          >
            <ReactSketchCanvas
              ref={canvasRef}
              width={`${displayWidth}px`}
              height={`${displayHeight}px`}
              strokeWidth={penSize}
              strokeColor="rgba(255, 255, 255, 0.9)"
              backgroundImage={imageUrl || undefined}
              canvasColor="black"
            />
          </div>
          <div className="mt-5 flex justify-center md:hidden">
            <Button onClick={handleSave} color="cyan">
              {t("SaveMask")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
