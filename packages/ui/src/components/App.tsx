import { useContext, useEffect } from "react";
import FlowTabs from "./FlowTabs"
import { ThemeContext } from "./providers/ThemeProvider";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';

const App = () => {

    const { dark } = useContext(ThemeContext);

    useEffect(() => {
        if (dark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [dark])



    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }

    return <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
        <FlowTabs />
    </DndProvider>
}



export default App;