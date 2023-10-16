import { useContext, useEffect } from "react";
import FlowTabs from "./FlowTabs"
import { ThemeContext } from "./providers/ThemeProvider";
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'

const App = () => {

    const { dark } = useContext(ThemeContext);

    useEffect(() => {
        if (dark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [dark])


    return <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <FlowTabs />
    </DndProvider>
}



export default App;