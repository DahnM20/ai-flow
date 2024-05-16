import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@mantine/core";

type Feature = {
  title: string;
  description: string;
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
      size="70%"
      centered
      title={versionInfo.description}
      styles={{
        title: {
          fontSize: "1.3rem",
          fontWeight: "bold",
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
      <div className="my-15 relative flex flex-col overflow-auto rounded-xl bg-zinc-900 px-2 text-slate-200 shadow">
        <ul className="mb-6 list-inside list-disc space-y-3">
          {!!features &&
            features.map((feature, index) => (
              <li key={index} className="text-base">
                <span className="font-medium text-sky-500">
                  {feature.title}
                </span>
                {feature?.description && ` : ${feature.description}`}
              </li>
            ))}
        </ul>
        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={imageUrl}
              alt="Version Updates"
              className="h-auto max-w-full rounded-md"
            />
          </div>
        )}
      </div>
    </Modal>
  ) : null;
}
