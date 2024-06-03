import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Welcome from "@/pages/Welcome.tsx";
import Login from "@/pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Welcome />
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
