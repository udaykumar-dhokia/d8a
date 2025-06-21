import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  FileText,
  Upload,
  Settings2,
  BarChart3,
  Clock,
  ArrowUpRight,
  LogOut,
  Trash2,
  FileCode,
  TrendingUp,
  FileSpreadsheet,
  FileJson,
  FileUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/api/axios";
import { formatFileName } from "@/utils/formatFileName";
import { toast } from "sonner";

interface File {
  id: number;
  fileName: string;
  created_at: string;
  size: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentFiles, setRecentFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    averageFileSize: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axiosInstance.get("/file/get-files", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const files: File[] = response.data?.message || [];

        if (!Array.isArray(files)) {
          setError("Invalid response format from server");
          return;
        }

        setRecentFiles(files.slice(0, 5));

        const totalSize = files.reduce(
          (sum, file) => sum + (file?.size || 0),
          0
        );

        setStats({
          totalFiles: files.length,
          totalSize,
          averageFileSize: files.length ? totalSize / files.length : 0,
        });
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async (file: File) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await axiosInstance.delete(
        `/file/delete/${encodeURIComponent(file.fileName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("File deleted successfully");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete file");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
    return (bytes / 1024 ** 3).toFixed(2) + " GB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "csv":
        return <FileSpreadsheet className="h-8 w-8 text-primary" />;
      case "pdf":
        return <FileJson className="h-8 w-8 text-primary" />;
      case "txt":
        return <FileText className="h-8 w-8 text-primary" />;
      case "py":
        return <FileCode className="h-8 w-8 text-primary" />;
      default:
        return <FileCode className="h-8 w-8 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <p className="text-destructive text-center font-semibold">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's a summary of your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/settings")}
            size="icon"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Files
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFiles}</div>
                <p className="text-xs text-muted-foreground">
                  Files in your workspace
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Size
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatFileSize(stats.totalSize)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Combined size of all files
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Size
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatFileSize(stats.averageFileSize)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average size per file
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!recentFiles || recentFiles.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center h-full">
                    <FileUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold">No Recent Files</h3>
                    <p>Upload your first file to see it here.</p>
                    <Button className="mt-4" onClick={() => navigate("/files")}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                ) : (
                  recentFiles.map((file) => (
                    <div
                      key={file?.id || Math.random()}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 truncate">
                        {getFileIcon(file?.fileName || "")}
                        <div className="truncate">
                          <p className="font-medium truncate">
                            {formatFileName(file?.fileName || "Unknown File")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {file?.created_at
                              ? formatDate(file.created_at)
                              : "Unknown Date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(
                              `/analyse/${encodeURIComponent(
                                file?.fileName || ""
                              )}`
                            )
                          }
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFile(file);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/files")}
              >
                View All Files
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <Button
                className="w-full justify-start gap-2"
                onClick={() => navigate("/files")}
              >
                <Upload className="h-4 w-4" />
                <span>Upload New File</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/files")}
              >
                <FileText className="h-4 w-4" />
                <span>Manage All Files</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "
              {selectedFile ? formatFileName(selectedFile.fileName) : ""}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedFile && handleDelete(selectedFile)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
