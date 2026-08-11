import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "@/routes/route"; 
import { Toaster } from "@/components/ui/sonner"

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors  />
    </>
  );
}

export default App;