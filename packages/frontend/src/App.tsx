import Home from "@/pages/Home";
import Login from "@/pages/Login.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Media from "./pages/Media";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import Series from "./pages/Series";
import EditUser from "./pages/settings/EditUser";
import Settings from "./pages/settings/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/movies",
    element: <Movies />,
  },
  {
    path: "/music",
    element: <Music />,
  },
  {
    path: "/media",
    element: <Media />,
  },
  {
    path: "/series",
    element: <Series />,
  },
  {
    path: "/settings/*",
    element: <Settings />,
  },
  {
    path: "/settings/user/:id",
    element: <EditUser />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
