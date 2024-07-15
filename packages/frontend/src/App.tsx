import Home from "@/pages/Home";
import Login from "@/pages/Login";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MusicPlayer from "./components/music/musicPlayer";
import { Toaster } from "./components/ui/toaster";
import Media from "./pages/Media";
import Movies from "./pages/Movies";
import Music from "./pages/music/Music";
import MyPlaylist from "./pages/music/MyPlaylist";
import Series from "./pages/Series";
import EditUser from "./pages/settings/EditUser";
import Settings from "./pages/settings/Settings";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from "./utils/AuthContext";
import { MusicPlayerProvider } from "./utils/MusicPlayerContext";
import ProtectedRoute from "./utils/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <Router>
          <Toaster />
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
              path="/media"
              element={
                <ProtectedRoute permission="admin_read_media">
                  <Media />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/*"
              element={
                <ProtectedRoute role="admin">
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/user/:id"
              element={
                <ProtectedRoute role="admin">
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/music/playlist/:id"
              element={
                <ProtectedRoute>
                  <MyPlaylist />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
          <MusicPlayer />
        </Router>
      </MusicPlayerProvider>
    </AuthProvider>
  );
};

export default App;
