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

const App = () => {
  const { dark } = useContext(ThemeContext);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [runTour, setRunTour] = useState(false);

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
  }, []);

  return (
    <VisibilityProvider>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        {runTour && <AppTour run={runTour} setRun={setRunTour} />}
        <FlowTabs />
        {showWelcomePopup && !runTour && (
          <WelcomePopup show onClose={() => setShowWelcomePopup(false)} />
        )}
      </DndProvider>
    </VisibilityProvider>
  );
};

export default App;
