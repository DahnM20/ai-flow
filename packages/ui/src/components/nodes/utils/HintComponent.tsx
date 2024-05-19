import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface HintComponentProps {
  hintId: string;
  textVar: string;
}

const HintComponent: React.FC<HintComponentProps> = ({ hintId, textVar }) => {
  const { t } = useTranslation("flow");
  const [showHint, setShowHint] = useState<boolean>(false);

  useEffect(() => {
    const storageKey = `hasHintBeenHidden-${hintId}`;
    const hasHintBeenHidden = localStorage.getItem(storageKey);
    if (hasHintBeenHidden) {
      setShowHint(false);
    } else {
      setShowHint(true);
    }
  }, [hintId]);

  const handleHideClick = () => {
    const storageKey = `hasHintBeenHidden-${hintId}`;
    localStorage.setItem(storageKey, "true");
    setShowHint(false);
  };

  return (
    <>
      {showHint && (
        <div className="flex flex-col items-center justify-center bg-sky-500 p-3 text-center">
          <div>{t(textVar)}</div>
          <button
            className="mt-2 rounded bg-white px-4 py-2 text-sky-500 shadow hover:bg-slate-200"
            onClick={handleHideClick}
          >
            {t("HideHint")}
          </button>
        </div>
      )}
    </>
  );
};

export default HintComponent;
