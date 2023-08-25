import { useContext, useEffect } from "react";
import FlowTabs from "./FlowTabs"
import { ThemeContext } from "./providers/ThemeProvider";

const App = () => {

    const { dark } = useContext(ThemeContext);

    useEffect(() => {
        if (dark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [dark])

    return <FlowTabs />
}



export default App;