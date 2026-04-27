import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Playground from "../pages/Playground";
import PracticeProblem from "../pages/PracticeProblem";
import CaseStudy from "../pages/CaseStudy";
import LearnTrack from "../pages/LearnTrack";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/practice/:problemId" element={<PracticeProblem />} />
        <Route path="/case-study/:caseId" element={<CaseStudy />} />
        <Route path="/learn/:trackId" element={<LearnTrack />} />
      </Routes>
    </Router>
  );
}