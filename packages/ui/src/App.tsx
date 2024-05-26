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
import { LoadingScreenSpinner } from "./components/nodes/Node.styles";
import { getCurrenttAppVersion } from "./config/config";

const App = () => {
  const { dark } = useContext(ThemeContext);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [showApp, setShowApp] = useState(false);

  const [appMounted, setComponentsMounted] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [dark]);

  useEffect(() => {
    const storedVersion = localStorage.getItem("appVersion");

    const currentAppVersion = getCurrenttAppVersion();
    if (!!currentAppVersion && storedVersion !== currentAppVersion) {
      if (!!currentAppVersion) {
        setRunTour(true);
      }

      setShowWelcomePopup(true);
      localStorage.setItem("appVersion", currentAppVersion);
    }

    loadAppData();
  }, []);

  useEffect(() => {
    if (showApp) {
      setComponentsMounted(true);
    }
  }, [showApp]);

  async function loadAppData() {
    const minLoadingTime = 1000;
    const startTime = Date.now();

    try {
      await loadParameters();
      await loadExtensions();
    } catch (error) {
      console.error("Failed to load app data:", error);
      console.error("Default parameters will be loaded");
    } finally {
      loadAllNodesTypes();
      setConfigLoaded(true);

      const endTime = Date.now();
      const timeElapsed = endTime - startTime;

      if (timeElapsed < minLoadingTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoadingTime - timeElapsed),
        );
      }

      setShowApp(true);
    }
  }

  return (
    <>
      {!showApp && (
        <div className="absolute z-50 flex h-screen w-full items-center justify-center">
          <div className="flex h-full w-1/6 flex-col items-center justify-center space-y-5">
            <img src="./logo.svg" className="w-1/2" />
            <LoadingScreenSpinner className="h-8 w-8" />
          </div>
        </div>
      )}
      {configLoaded && (
        <div
          className={`${showApp ? "opacity-100" : "opacity-0"} transition-all duration-300 ease-in-out`}
        >
          <VisibilityProvider>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
              <SocketProvider>
                <FlowTabs />
              </SocketProvider>

              {showWelcomePopup && !runTour && (
                <WelcomePopup show onClose={() => setShowWelcomePopup(false)} />
              )}

              <Tooltip
                id={`app-tooltip`}
                style={{ zIndex: 100 }}
                delayShow={500}
              />
              {appMounted && runTour && (
                <AppTour run={runTour} setRun={setRunTour} />
              )}
            </DndProvider>
          </VisibilityProvider>
        </div>
      )}
    </>
  );
};

export default App;
