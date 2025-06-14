import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const MainLayout = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/user/get-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.message);
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
   <div className="flex min-h-screen overflow-hidden">
    <Sidebar user={userData} loading={loading} />
    <main className="flex-1 overflow-auto bg-gray-100 h-screen">
      <Outlet context={{ user: userData }} />
    </main>
  </div>

  );
};

export default MainLayout;
