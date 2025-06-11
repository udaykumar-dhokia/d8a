import { NavLink } from "react-router-dom";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios"; // Added for proper error handling
import axiosInstance from "../../api/axios.ts";
import logo from "../../assets/logo.png";
import { LayoutDashboard, FileChartLine, Settings2, CircleUser, Upload } from "lucide-react";
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
import { toast } from "sonner"


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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

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
      toast("File uploaded successfully!");
      resetUploadState();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data?.message || "Failed to upload file.");
      } else {
        toast((error as isAxiosError).message || "An error occurred during upload.");
      }
      resetUploadState();
    }
  }, [resetUploadState]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop,
  });

  return (
    <div className="flex flex-col w-64 min-h-screen bg-white border-r p-4">
      <div className="mb-6">
        <a href="/" className="flex items-center gap-2 text-3xl text-primary font-bold">
          <img className="h-12 w-auto" src={logo} alt="Analytix" />
          <span>d8a</span>
        </a>
      </div>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            resetUploadState();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="w-full py-6 text-md bg-primary hover:cursor-pointer hover:bg-primary-dark transition-colors duration-200">
            <Upload className="mr-2 h-5 w-5" />
            Upload File
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Excel File</DialogTitle>
            <DialogDescription>
              Upload Excel files (.xlsx, .xls, .csv) up to 50MB. View file summary after upload.
            </DialogDescription>
          </DialogHeader>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
              ? "Drop the file here ..."
              : "Drag & drop an Excel file here, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: .xlsx, .xls, .csv (max 50MB)
            </p>
          </div>

          {fileRejections?.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {fileRejections[0].errors[0].code === "file-invalid-type"
              ? "Invalid file type. Please upload an Excel file (.xlsx, .xls, .csv)."
              : fileRejections[0].errors[0].code === "file-too-large"
              ? "File is too large. Maximum size is 50MB."
              : "An error occurred while uploading the file."}
            </div>
            )}

          {uploadedFile && (
            <div className="mt-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileChartLine className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[300px]">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {isUploading && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={resetUploadState}
                  >
                    Cancel
                  </button>
                  )}
              </div>
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
                )}
            </div>
            )}

          {uploadResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-green-600">Upload Summary</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>File URL:</strong>{" "}
                  <a
                    href={uploadResult.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {uploadResult.fileUrl}
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Columns:</strong> {uploadResult.columns.join(", ")}
                </p>
                <div className="mt-2">
                  <strong className="text-sm text-gray-600">Summary:</strong>
                  <pre className="text-xs text-gray-600 bg-white p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(uploadResult.summary, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            )}
        </DialogContent>
      </Dialog>

      <div className="flex-1 mt-8">
        <ul className="flex flex-col space-y-2">
          {menu.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {name}
            </NavLink>
          </li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-gray-600 border-t pt-4">
        {loading ? (
          <p>Loading user...</p>
          ) : user ? (
          <div className="flex items-center gap-2">
            <CircleUser className="h-5 w-5" />
            <div>
              <p className="font-semibold">{user.fullName || user.email}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          ) : (
          <p>Not logged in</p>
          )}
        </div>
      </div>
      );
};

export default Sidebar;