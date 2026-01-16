import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Home from "./Home.jsx";
import FeedingLog from "./feedingLog.jsx";
import SleepLog from "./pages/sleeplog";
import DiaperLog from "./pages/DiaperLog";
import GrowthTracker from "./pages/GrowthTracker";
import Vaccinations from "./pages/Vaccinations";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Routes>
         <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/feedingLog" element={<FeedingLog />} />
        <Route path="/sleeplog" element={<SleepLog />} />
        <Route path="/diaperLog" element={<DiaperLog />} />
        <Route path="/growthTracker" element={<GrowthTracker />} />
        <Route path="/vaccinations" element={<Vaccinations />} />
      </Routes>
    </>
  );
}

export default App;
