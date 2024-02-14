import React from "react";
import ReactDOM from "react-dom";
import EaseOut from "../shared/motions/EaseOut";

interface DefaultPopupWrapperProps {
  show: boolean;
  onClose: () => void;
  centered?: boolean;
  children: React.ReactNode;
}

export default function DefaultPopupWrapper({
  show,
  onClose,
  centered,
  children,
}: DefaultPopupWrapperProps) {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/50`}
      onClick={onClose}
      onTouchEnd={onClose}
    >
      <div
        className={`flex max-h-full w-10/12 flex-col items-center md:w-4/6 ${centered ? "" : "mb-auto"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <EaseOut>{children}</EaseOut>
      </div>
    </div>,
    document.body,
  );
}
