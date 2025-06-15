import { NavLink } from "react-router-dom";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import axiosInstance from "../../api/axios.ts";
import { LayoutDashboard, FileChartLine, Settings2, CircleUser, Upload, ChevronRight, LogOut } from "lucide-react";
import { Button } from "./button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface User {
  fullName?: string;
  email: string;
}

interface UploadResult {
  fileUrl: string;
  columns: string[];
  summary: any;
}

interface SidebarProps {
  user: User | null;
  loading: boolean;
}

const Sidebar = ({ user, loading }: SidebarProps) => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [, setUploadResult] = useState<UploadResult | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Files", path: "/files", icon: FileChartLine },
    { name: "Settings", path: "/settings", icon: Settings2 },
  ];

  const resetUploadState = useCallback(() => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadResult(null);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", token);

      const response = await axiosInstance.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          }
        },
      });

      setUploadResult(response.data);
      toast.success("File uploaded successfully!");
      resetUploadState();
      navigate("/files");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to upload file.");
      } else {
        toast.error((error as Error).message || "An error occurred during upload.");
      }
      resetUploadState();
    }
  }, [resetUploadState, navigate]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className={cn(
      "h-screen bg-background border-r transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          <a href="/" className={cn(
            "flex items-center gap-2 text-primary font-bold transition-all duration-300",
            isCollapsed ? "text-xl" : "text-3xl"
          )}>
            {!isCollapsed && <span>d8a</span>}
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed ? "rotate-180" : ""
            )} />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Upload Button */}
          <Dialog
            onOpenChange={(open) => {
              if (!open) {
                resetUploadState();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className={cn(
                "w-full py-6 text-md bg-primary hover:bg-primary/90 transition-all duration-200",
                isCollapsed ? "px-2" : "px-4"
              )}>
                <Upload className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Upload File"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload CSV File</DialogTitle>
                <DialogDescription>
                  Upload CSV files (.csv) up to 50MB. View file summary after upload.
                </DialogDescription>
              </DialogHeader>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200",
                  isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
                  isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the file here ..."
                    : "Drag & drop a CSV file here, or click to browse"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Accepted format: .csv (max 50MB)
                </p>
              </div>

              {fileRejections?.length > 0 && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {fileRejections[0].errors[0].code === "file-invalid-type"
                    ? "Invalid file type. Please upload a CSV file (.csv)."
                    : fileRejections[0].errors[0].code === "file-too-large"
                    ? "File is too large. Maximum size is 50MB."
                    : "An error occurred while uploading the file."}
                </div>
              )}

              {uploadedFile && (
                <div className="mt-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileChartLine className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[300px]">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {isUploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/90"
                        onClick={resetUploadState}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  {isUploading && (
                    <div className="mt-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploading: {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed && "justify-center"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile and Logout */}
        <div className="p-4 border-t space-y-4">
          {loading ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              {!isCollapsed && <div className="h-4 w-24 bg-muted rounded animate-pulse" />}
            </div>
          ) : user ? (
            <>
              <div className={cn(
                "flex flex-col gap-2 p-3 rounded-lg bg-muted/50",
                isCollapsed && "items-center"
              )}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CircleUser className="h-6 w-6 text-primary" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.fullName || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="text-xs text-muted-foreground pl-13">
                    <p>Member since {new Date().toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-destructive",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="ml-2">Logout</span>}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;