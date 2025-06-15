import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import Sidebar from "@/components/ui/Sidebar";

interface User {
  fullName?: string;
  email: string;
}

const MainLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/verify-token", { token });
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          throw new Error("No user data received");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar user={user} loading={loading} />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
