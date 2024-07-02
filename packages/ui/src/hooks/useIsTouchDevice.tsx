import React, { useEffect, useState } from "react";

const useIsTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      return window.matchMedia("(pointer: coarse)").matches;
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
