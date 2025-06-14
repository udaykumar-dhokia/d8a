import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AnalyseFile from "./pages/AnalyseFile";
import Files from "./pages/Files";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "@/components/ui/sonner"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout children={undefined} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/files" element={<Files />} />
              <Route path="/settings" element={<Dashboard />} />
              <Route path="/analyse/:fileName" element={<AnalyseFile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    <Toaster />

      {/*<ToastContainer />*/}
    </>
  );
}

export default App;
