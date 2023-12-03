import { FaGithub } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { toast } from "react-toastify";

export function toastInfoMessage(message: string, id?: string) {
  toast.info(message, {
    toastId: id,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

export function toastFastInfoMessage(message: string) {
  toast.info(message, {
    position: "top-center",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
}

export function toastCustomIconInfoMessage(message: string, icon: IconType) {
  toast.info(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    icon: icon,
  });
}