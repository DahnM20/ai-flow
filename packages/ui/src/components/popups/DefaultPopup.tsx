import React, { CSSProperties } from "react";
import ReactDOM from "react-dom";
import EaseOut from "../shared/motions/EaseOut";

interface DefaultPopupWrapperProps {
  show: boolean;
  onClose: () => void;
  centered?: boolean;
  popupClassNames?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export default function DefaultPopupWrapper({
  show,
  onClose,
  centered,
  popupClassNames,
  style,
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
        className={`${!!popupClassNames ? popupClassNames : "h-5/6 w-5/6"} flex flex-col items-center ${centered ? "" : "mb-auto"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => e.stopPropagation()}
        style={{ ...style }}
      >
        <EaseOut>{children}</EaseOut>
      </div>
    </div>,
    document.body,
  );
}
