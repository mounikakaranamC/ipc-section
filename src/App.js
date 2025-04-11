import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/ipc/home.jsx";
import IPC from "./components/ipc/ipc.jsx";
import CRPC from "./components/ipc/crpc.jsx";
import IEA from "./components/ipc/iea.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ipc" element={<IPC />} />
        <Route path="/crpc" element={<CRPC />} />
        <Route path="/iea" element={<IEA />} />
      </Routes>
    </Router>
  );
}

export default App;
