import "./App.css";
import "./theme.scss";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";

function App() {
  const [theme, setTheme] = useState("dark");

  return (
    <div className={`App ${theme}`}>
      <Router>
        <NavBar />

        <SideBar theme={theme} />
        <Body />
      </Router>
    </div>
  );
}

export default App;
