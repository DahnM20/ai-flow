import { Button, Modal } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { ImageMaskCreator } from "./ImageMaskCreator";
import { useLoading } from "../../../hooks/useLoading";
import {
  getUploadAndDownloadUrl,
  uploadWithS3Link,
} from "../../../api/uploadFile";
import { LoadingSpinner } from "../Node.styles";
import { useTranslation } from "react-i18next";
import DefaultPopupWrapper from "../../popups/DefaultPopup";
import { ThemeContext } from "../../../providers/ThemeProvider";

interface ImageMaskCreatorFieldProps {
  onChange: (value: string) => void;
  imageUrls?: string[];
  loadImageUrls?: () => Promise<string[]>;
}

export default function ImageMaskCreatorField({
  onChange,
  imageUrls,
  loadImageUrls,
}: ImageMaskCreatorFieldProps) {
  const { t } = useTranslation("flow");
  const { dark } = useContext(ThemeContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maskPreview, setMaskPreview] = useState<string | null>(null);
  const [isLoading, startLoadingWith] = useLoading();
  const [imageUrlsState, setImageUrls] = useState<string[]>(imageUrls ?? []);

  useEffect(() => {
    if (loadImageUrls && isModalOpen) {
      startLoadingWith(async () => {
        const urls = await loadImageUrls();
        setImageUrls(urls);
      });
    }
  }, [loadImageUrls, isModalOpen]);

  function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  async function uploadFile(files: File[]) {
    const filename = files[0].name;
    const urls = await getUploadAndDownloadUrl(filename);
    const uploadData = urls.upload_data;
    await uploadWithS3Link(uploadData, files[0]);
    return urls;
  }

  const handleSaveMask = async (maskDataUrl: string) => {
    setIsModalOpen(false);
    const maskFile = dataURLtoFile(maskDataUrl, "mask.png");

    const files: File[] = [maskFile];

    try {
      const urls = await startLoadingWith(uploadFile, files);

      if (urls.download_link) {
        setMaskPreview(urls.download_link);
        onChange(urls.download_link);
      } else {
        alert(t("FailedToUploadImage"));
      }
    } catch (error) {
      alert(t("FailedToUploadImage"));
    }
  };

  return (
    <div>
      <Button
        color="cyan"
        variant="outline"
        onClick={() => {
          setIsModalOpen(true);
        }}
        size="lg"
      >
        {t("CreateMaskFromImage")}
      </Button>
      {isModalOpen && (
        <DefaultPopupWrapper
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          popupClassNames="overflow-auto w-[85%] md:w-[75%] max-h-[95%] flex shadow-lg md:p-4 p-2 rounded-md mt-[2%]"
          style={{
            background: dark
              ? "linear-gradient(135deg, #101113, #1a1b1e)"
              : "#FFFFFF",
          }}
        >
          <div className="pb-6 md:px-6">
            <ImageMaskCreator
              onSave={handleSaveMask}
              imageUrls={imageUrlsState}
            />
          </div>
        </DefaultPopupWrapper>
      )}
      {isLoading && (
        <div className="my-2 flex w-full items-center justify-center p-2 text-center text-2xl text-teal-400 ">
          <LoadingSpinner />
        </div>
      )}
      {maskPreview && (
        <div className="mt-5 flex w-full flex-col space-y-4">
          <p>{t("Preview")}</p>
          <div>
            <img
              src={maskPreview}
              alt={t("MaskPreview") ?? "Mask Preview"}
              className="h-28"
            />
          </div>
        </div>
      )}
    </div>
  );
}
