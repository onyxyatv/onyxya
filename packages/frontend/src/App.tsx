import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Welcome from "@/pages/Welcome.tsx";
import Login from "@/pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />
  },
  {
    path: "/login",
    element: <Login />
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
