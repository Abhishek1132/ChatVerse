import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import { useColorMode } from "@chakra-ui/react";

function App() {
  const { colorMode } = useColorMode();
  return (
    <div
      className="App"
      style={{ backgroundColor: colorMode === "light" ? "whitesmoke" : "" }}
    >
      <Routes>
        <Route path="/" element={<Homepage />} exact />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
