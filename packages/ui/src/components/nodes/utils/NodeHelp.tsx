import { url } from "inspector";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import { ImageZoomable } from "./ImageZoomable";

export type UrlWithLabel = {
  url: string;
  label: string;
};
export type NodeHelpData = {
  description: string;
  imageUrl: string;
  docUrls: UrlWithLabel[];
};

interface NodeHelpProps {
  data: NodeHelpData;
  onClose: () => void;
}

export function NodeHelp({ data, onClose }: NodeHelpProps) {
  const { t } = useTranslation("flow");

  if (!data || !data.description) {
    return (
      <div className="relative overflow-hidden">
        <div className="p-2 text-center">{t("noDataAvailableForThisNode")}</div>
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 text-white"
        >
          <FaTimes />
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {data.imageUrl && (
        <ImageZoomable src={data.imageUrl} alt={data.description} />
      )}
      <button
        onClick={onClose}
        className="absolute right-0 top-0 p-2 text-white"
      >
        <FaTimes />
      </button>
      <div className="p-4 text-white">
        <p className="mb-4 text-sm">{data.description}</p>
        {!!data.docUrls && data.docUrls.length > 0 && (
          <>
            <p className="text-xs">{t("learnMore")}</p>
            <div className="flex flex-col flex-wrap">
              {data.docUrls.map((urlData, index) => (
                <a
                  key={index}
                  href={urlData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 transition duration-150 ease-in-out hover:text-blue-300"
                >
                  {urlData.label ?? "More Info"}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
