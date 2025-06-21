import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Features from "./pages/Features";
import Blog from "./pages/Blog";
import Pricing from "./pages/Pricing";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AnalyseFile from "./pages/AnalyseFile";
import Files from "./pages/Files";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          element={
            <PublicLayout>
              <Outlet />
            </PublicLayout>
          }
        >
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        {/* Protected Routes with Theme */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <ThemeProvider defaultTheme="system">
                <MainLayout />
              </ThemeProvider>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/files" element={<Files />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analyse/:fileName" element={<AnalyseFile />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
