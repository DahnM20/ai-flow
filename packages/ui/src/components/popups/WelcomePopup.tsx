import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@mantine/core";
import { ImageZoomable } from "../nodes/utils/ImageZoomable";
import { FaExternalLinkAlt } from "react-icons/fa";

type Feature = {
  title: string;
  description: string;
};

type Article = {
  title: string;
  url: string;
};

type VersionInfo = {
  versionNumber: string;
  description: string;
};

interface WelcomePopupProps {
  show: boolean;
  onClose: () => void;
}
export default function WelcomePopup({ show, onClose }: WelcomePopupProps) {
  const { t } = useTranslation("version");

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const versionInfo = t("versionInfo", { returnObjects: true }) as VersionInfo;
  const features = t("features", { returnObjects: true }) as Feature[];
  const articles = t("articles", { returnObjects: true }) as Article[];
  const imageUrl = t("imageUrl");

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => setIsImageLoaded(true);
      img.src = imageUrl;
    } else {
      setIsImageLoaded(true);
    }
  }, [imageUrl]);

  const shouldShowPopup = show && (isImageLoaded || !imageUrl);

  return shouldShowPopup ? (
    <Modal
      opened={show}
      onClose={onClose}
      size="80%"
      centered
      title={"Welcome to AI-Flow"}
      padding={"xl"}
      styles={{
        title: {
          fontSize: "1.3rem",
          color: "white",
          paddingLeft: "0.5rem",
        },
        header: {
          backgroundColor: "rgb(24 24 27)",
        },
        body: {
          backgroundColor: "rgb(24 24 27)",
        },
        root: {
          borderRadius: "20rem",
        },
      }}
    >
      <div className="relative flex flex-col overflow-auto rounded-xl bg-zinc-900 px-2 text-slate-200 shadow">
        <div className="flex flex-col space-x-4 md:flex-row">
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col space-y-5">
              <div className="text-xl text-zinc-300">Latest features added</div>
              {!!features &&
                features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-lg bg-zinc-950/30 px-3 py-2 text-base"
                  >
                    <span className="font-medium text-teal-500">
                      {feature.title}
                    </span>
                    <span className="text-gray-300">
                      {feature?.description && `${feature.description}`}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex flex-col space-y-2">
              <div className=" text-xl text-zinc-300">Latest articles</div>
              {!!articles &&
                articles.map((article, index) => (
                  <div key={index} className="text-base">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <span className="font-medium ">{article.title} </span>
                      <FaExternalLinkAlt className="text-xs text-zinc-400" />
                    </a>
                  </div>
                ))}
            </div>
          </div>
          {imageUrl && (
            <div className="mb-4 flex h-fit w-full justify-center shadow-md md:w-3/4">
              <ImageZoomable src={imageUrl} alt="Version Updates" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  ) : null;
}
