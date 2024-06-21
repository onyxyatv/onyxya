import Home from "@/pages/Home";
import Login from "@/pages/Login";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import Series from "./pages/Series";
import EditUser from "./pages/settings/EditUser";
import Settings from "./pages/settings/Settings";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute"; // Assurez-vous que vous avez ce composant pour gérer les routes protégées

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/music"
            element={
              <ProtectedRoute>
                <Music />
              </ProtectedRoute>
            }
          />
          <Route
            path="/series"
            element={
              <ProtectedRoute>
                <Series />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/user/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
