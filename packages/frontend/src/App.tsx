import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login.tsx";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Music from "./pages/Music";

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
