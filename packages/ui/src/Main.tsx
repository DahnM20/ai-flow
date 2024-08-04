import React, { useState } from "react";
import App from "./App";
import LoadingScreen from "./components/LoadingScreen";

const Main = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  const handleLoadingComplete = () => {
    setInitialLoading(false);
  };

  return (
    <>
      {initialLoading && <LoadingScreen />}
      <App onLoadingComplete={handleLoadingComplete} />
    </>
  );
};

export default Main;
