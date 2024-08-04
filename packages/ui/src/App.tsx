import { useContext, useEffect, useMemo, useState } from "react";
import FlowTabs, { FlowTab } from "./layout/main-layout/AppLayout";
import { ThemeContext } from "./providers/ThemeProvider";
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
import { getCurrentAppVersion } from "./config/config";
import { useTranslation } from "react-i18next";
import { getAllTabs } from "./services/tabStorage";
import { convertJsonToFlow } from "./utils/flowUtils";

interface AppProps {
  onLoadingComplete: () => void;
}
const App = ({ onLoadingComplete }: AppProps) => {
  const { dark } = useContext(ThemeContext);
  const { t } = useTranslation("version");
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [allTabs, setAllTabs] = useState<FlowTab[]>([]);

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
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get("ref_code");

    if (referralCode) {
      localStorage.setItem("referralCode", referralCode);
    }

    const currentAppVersion = getCurrentAppVersion();
    if (!!currentAppVersion && storedVersion !== currentAppVersion) {
      if (!storedVersion) {
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

  const loadIntroFile = async () => {
    const firstVisit = localStorage.getItem("firstVisit") !== "false";
    const savedFlowTabs = localStorage.getItem("flowTabs");

    if (firstVisit && !savedFlowTabs) {
      try {
        const response = await fetch("/samples/intro.json");
        if (!response.ok) {
          throw new Error("Failed to fetch intro file");
        }
        const jsonData = await response.json();
        const defaultTab: FlowTab = convertJsonToFlow(jsonData);

        localStorage.setItem("firstVisit", "false");

        return [defaultTab];
      } catch (error) {
        console.error("Cannot load sample file :", error);
      }
    }

    return [];
  };

  async function loadAppData() {
    try {
      await loadParameters();
      await loadExtensions();
      const defaultTabs = await loadIntroFile();
      const allTabs = await getAllTabs();
      if (allTabs.length === 0) {
        allTabs.push(...defaultTabs);
      }
      setAllTabs(allTabs);
    } catch (error) {
      console.error("Failed to load app data:", error);
      console.error("Default parameters will be loaded");
    } finally {
      loadAllNodesTypes();
      setConfigLoaded(true);
      setShowApp(true);
      onLoadingComplete();
    }
  }

  return (
    <>
      {configLoaded && (
        <div
          className={`${showApp ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out`}
          id="main-content"
        >
          <VisibilityProvider>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
              <SocketProvider>
                <FlowTabs tabs={allTabs} />
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
