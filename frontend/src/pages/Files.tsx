import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Trash2, 
  Download, 
  ChartSpline, 
  RefreshCcw, 
  File, 
  Folder,
  Upload,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import axiosInstance from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { formatFileName } from "@/utils/formatFileName";

interface FileData {
  id: number;
  created_at: string;
  fileName: string;
  fileUrl: string;
  updatedAt: string;
  email: string;
  size: number;
}

const Files: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/file/get-files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: FileData[] = response.data.message;
      setFiles(data);
      setFilteredFiles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch files");
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    const filtered = files.filter((file) =>
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchQuery, files]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
    return (bytes / 1024 ** 3).toFixed(2) + " GB";
  };

  const totalFileSize = formatFileSize(
    files.reduce((sum, file) => sum + (file.size || 0), 0)
  );
  const totalFiles = files.length;

  const onDrop = async (acceptedFiles: globalThis.File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", token);

      await axiosInstance.post("/file/upload", formData, {
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

      toast.success("File uploaded successfully!");
      fetchFiles(); // Refresh the file list
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop,
  });

  const handleDelete = async (file: FileData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await axiosInstance.delete(`/file/delete/${file.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("File deleted successfully");
      fetchFiles(); // Refresh the file list
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Files</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchFiles}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <File className="w-5 h-5 text-primary" />
                Total Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalFiles}</p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Number of files uploaded
            </CardFooter>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Folder className="w-5 h-5 text-primary" />
                Total Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalFileSize}</p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Combined file size
            </CardFooter>
          </Card>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the file here..."
              : "Drag & drop a file here, or click to select"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supported format: .csv (max 50MB)
          </p>
          {isUploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Files Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">
                  {searchQuery ? "No files match your search." : "No files found."}
                </p>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          {formatFileName(file.fileName)}
                        </TableCell>
                        <TableCell>{formatDate(file.created_at)}</TableCell>
                        <TableCell>{formatDate(file.updatedAt)}</TableCell>
                        <TableCell>{formatFileSize(file.size || 0)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => window.open(`/analyse/${encodeURIComponent(file.fileName)}`)}
                              >
                                <ChartSpline className="h-4 w-4 mr-2" />
                                Analyse
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => window.open(file.fileUrl, "_blank")}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedFile(file);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
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

export default Files;