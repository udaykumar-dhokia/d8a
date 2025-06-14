import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.post("/auth/verify-token", { token });
      } catch (err: any) {
        localStorage.removeItem("token");
        navigate("/login");
        toast.error(err.response?.data?.message || "Session expired. Please login again.");
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
