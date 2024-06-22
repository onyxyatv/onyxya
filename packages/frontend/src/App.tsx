import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login.tsx";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Music from "./pages/Music";
import Settings from "./pages/settings/Settings";
import EditUser from "./pages/settings/EditUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/movies",
    element: <Movies />
  },
  {
    path: "/music",
    element: <Music />
  },
  {
    path: "/series",
    element: <Series />
  },
  {
    path: "/settings/*",
    element: <Settings />
  },
  {
    path: "/settings/user/:id",
    element: <EditUser />
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
