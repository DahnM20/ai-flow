import axios, { AxiosProgressEvent } from "axios";
import { getRestApiUrl } from "../config/config";

export async function getUploadAndDownloadUrl() {
  try {
    const url = `${getRestApiUrl()}/upload`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error while trying to get upload link :", error);
    throw error;
  }
}

export async function uploadWithS3Link(s3UploadLink: string, file: File) {
  const config = {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total) return;

      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      console.log(`Upload progress: ${percentCompleted}%`);
    },
  };

  try {
    await axios.put(s3UploadLink, file, config);
  } catch (error) {
    console.error("Error uploading file :", error);
    throw error;
  }
}
