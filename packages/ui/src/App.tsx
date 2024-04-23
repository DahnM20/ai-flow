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
    await loadExtensions();
    await loadParameters();
    loadAllNodesTypes();
    setIsLoaded(true);
  }

  if (!isLoaded) return <> Loading </>;

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
        <Tooltip id={`app-tooltip`} style={{ zIndex: 100 }} delayShow={400} />
      </DndProvider>
    </VisibilityProvider>
  );
};

export default App;
