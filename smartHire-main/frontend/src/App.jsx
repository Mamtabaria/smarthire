import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import SkillGap from "./pages/SkillGap";
import LearningRoadmap from "./pages/LearningRoadmap";
import Assistant from "./pages/Assistant";
import ClientPostJob from "./pages/ClientPostJob";
import ClientApplicants from "./pages/ClientApplicants";
import ClientProfile from "./pages/ClientProfile";
import GlobalScrollReveal from "./components/GlobalScrollReveal";

function ProtectedRoute({ children, allowRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/login" replace />;
  if (allowRole && user.role !== allowRole) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <>
      <GlobalScrollReveal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/learning-roadmap" element={<LearningRoadmap />} />
          <Route path="/skill-gap" element={<SkillGap />} />

          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/post-job"
            element={
              <ProtectedRoute allowRole="client">
                <ClientPostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/applicants"
            element={
              <ProtectedRoute allowRole="client">
                <ClientApplicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/profile"
            element={
              <ProtectedRoute allowRole="client">
                <ClientProfile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
