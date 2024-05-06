import { useContext, useEffect, useMemo, useState } from "react";
import FlowTabs from "./layout/main-layout/AppLayout";
import { ThemeContext } from "./providers/ThemeProvider";
import "@aws-amplify/ui-react/styles.css";
import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import WelcomePopup from "./components/popups/WelcomePopup";
import { AppTour } from "./components/tour/AppTour";
import { VisibilityProvider } from "./providers/VisibilityProvider";
import { Tooltip } from "react-tooltip";
import { loadExtensions } from "./nodes-configuration/nodeConfig";
import { loadAllNodesTypes } from "./utils/mappings";
import { loadParameters } from "./components/popups/config-popup/parameters";
import { SocketProvider } from "./providers/SocketProvider";
import {
  LoadingScreenSpinner,
  LoadingSpinner,
} from "./components/nodes/Node.styles";

const App = () => {
  const { dark } = useContext(ThemeContext);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [dark]);

  useEffect(() => {
    const storedVersion = localStorage.getItem("appVersion");

    const currentAppVersion = process.env.REACT_APP_VERSION;
    if (!!currentAppVersion && storedVersion !== currentAppVersion) {
      if (!!currentAppVersion) {
        setRunTour(true);
      }

      setShowWelcomePopup(true);
      localStorage.setItem("appVersion", currentAppVersion);
    }

    loadAppData();
  }, []);

  async function loadAppData() {
    const minLoadingTime = 1000;
    const startTime = Date.now();

    try {
      await loadExtensions();
      await loadParameters();
    } catch (error) {
      console.error("Failed to load app data:", error);
      console.error("Default parameters will be loaded");
    } finally {
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;

      if (timeElapsed < minLoadingTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoadingTime - timeElapsed),
        );
      }

      loadAllNodesTypes();
      setIsLoaded(true);
    }
  }

  if (!isLoaded)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-1/6 flex-col items-center justify-center space-y-5">
          <img src="./logo.svg" className="w-1/2" />
          <LoadingScreenSpinner className="h-8 w-8" />
        </div>
      </div>
    );

  return (
    <VisibilityProvider>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        {runTour && <AppTour run={runTour} setRun={setRunTour} />}

        <SocketProvider>
          <FlowTabs />
        </SocketProvider>

        {showWelcomePopup && !runTour && (
          <WelcomePopup show onClose={() => setShowWelcomePopup(false)} />
        )}
        <Tooltip id={`app-tooltip`} style={{ zIndex: 100 }} delayShow={500} />
      </DndProvider>
    </VisibilityProvider>
  );
};

export default App;
