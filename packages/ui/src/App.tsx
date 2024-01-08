import { useContext, useEffect, useState } from "react";
import FlowTabs from "./layout/main-layout/AppLayout"
import { ThemeContext } from "./providers/ThemeProvider";
import '@aws-amplify/ui-react/styles.css';
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import WelcomePopup from "./components/popups/WelcomePopup";
const App = () => {

    const { dark } = useContext(ThemeContext);
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);

    useEffect(() => {
        if (dark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [dark])

    useEffect(() => {
        const storedVersion = localStorage.getItem("appVersion");

        const currentAppVersion = process.env.REACT_APP_VERSION;
        if (!!currentAppVersion && storedVersion !== currentAppVersion) {
            setShowWelcomePopup(true);
            localStorage.setItem("appVersion", currentAppVersion);
        }
    }, []);


    return <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <FlowTabs />
        {showWelcomePopup &&
            <WelcomePopup show onClose={() => setShowWelcomePopup(false)} />
        }
    </DndProvider>
}



export default App;