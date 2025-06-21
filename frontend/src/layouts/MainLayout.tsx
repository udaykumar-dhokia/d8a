import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconFiles,
  IconLayoutDashboard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface User {
  fullName?: string;
  email: string;
  totalFiles?: number;
  maxFiles?: number;
}

const MainLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconLayoutDashboard className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Files",
      href: "/files",
      icon: <IconFiles className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUser className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Logout",
      href: "/login",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0" />,
    },
  ];
  const [open, setOpen] = React.useState(false);
  const mainLinks = links.slice(0, links.length - 1);
  const logoutLink = links[links.length - 1];

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/verify-token", {
          token,
        });
        if (response.data.user) {
          const userDataResponse = await axiosInstance.get("/user/get-data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (userDataResponse.data.message) {
            setUser(userDataResponse.data.message);
          }
        } else {
          throw new Error("No user data received");
        }
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Session expired. Please login again."
        );
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col rounded-md border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-900",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex flex-1 flex-col no-scrollbar">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {mainLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            {user && (
              <div className="my-4 flex flex-col gap-4">
                <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
                <motion.div
                  animate={{
                    display: open ? "flex" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="flex-col gap-2 px-2"
                >
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    File Limit
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user.totalFiles} / {user.maxFiles} files
                  </p>
                  <Progress
                    value={
                      user.totalFiles && user.maxFiles
                        ? (user.totalFiles / user.maxFiles) * 100
                        : 0
                    }
                    className="mt-2 h-2"
                  />
                </motion.div>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <img
                src={`https://avatar.vercel.sh/${user?.email}`}
                className="h-7 w-7 shrink-0 rounded-full"
                width={50}
                height={50}
                alt="Avatar"
              />
              <motion.div
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="overflow-hidden whitespace-pre"
              >
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {user?.fullName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {user?.email}
                </p>
              </motion.div>
            </div>
            <div className="my-4">
              <div className="h-px bg-neutral-200 dark:bg-neutral-700 mb-2" />
              <SidebarLink link={logoutLink} />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        d8a
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

export default MainLayout;
