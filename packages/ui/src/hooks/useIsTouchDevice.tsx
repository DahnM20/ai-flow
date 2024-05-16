import React, { useEffect, useState } from "react";

const useIsTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouchPoints = navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasTouchEvent = "ontouchstart" in window;

      setIsTouchDevice(hasTouchPoints || hasCoarsePointer || hasTouchEvent);
    };

    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);

    return () => {
      window.removeEventListener("resize", checkTouchDevice);
    };
  }, []);

  return isTouchDevice;
};

export default useIsTouchDevice;
