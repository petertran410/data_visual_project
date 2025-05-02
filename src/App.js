import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Density from "./Density/Density";
import Diploma from "./Diploma/Diploma";
import PoorHouseholds from "./PoorHouseholds/PoorHouseholds";
import GDP from "./GDP/GDP";
import ColSideBar from "./Sidebar/ColSideBar";
import Home from "./Home-2/Home";
function App() {
  return (
    <Router>
      <div className="flex">
        {/* <ColSideBar /> */}
        <div className="w-4/5">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/Density" element={<Density />} />
            <Route path="/GDP" element={<GDP />} />
            <Route path="/Diploma" element={<Diploma />} />
            <Route path="/PoorHouseholds" element={<PoorHouseholds />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
