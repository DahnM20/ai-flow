import { useEffect, useState } from "react";
import DefaultPopupWrapper from "./DefaultPopup";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";

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
    <DefaultPopupWrapper onClose={onClose} show={show} centered>
      <div className="my-15 relative flex flex-col overflow-auto rounded-xl bg-zinc-900 p-10 text-slate-200 shadow">
        <div className="absolute right-0 top-0 p-4 text-2xl">
          <button onClick={onClose} className="hover:text-red-500">
            <MdClose />
          </button>
        </div>
        <h2 className="mb-6 text-xl font-semibold">
          {versionInfo.description}
        </h2>
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
    </DefaultPopupWrapper>
  ) : null;
}
