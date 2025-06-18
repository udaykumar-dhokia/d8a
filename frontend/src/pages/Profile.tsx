import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Calendar,
  FileText,
  HardDrive,
  Settings,
  Edit,
  Save,
  X,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";

interface UserData {
  id: number;
  email: string;
  fullName?: string;
  totalFiles: number;
  maxFiles: number;
  totalFileSize: number;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axiosInstance.get("/user/get-data", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data.message;
      setUser(userData);
      setEditForm({ fullName: userData.fullName || "" });
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch user data");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await axiosInstance.put("/user/update-profile", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(prev => prev ? { ...prev, fullName: editForm.fullName } : null);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ fullName: user?.fullName || "" });
    setIsEditing(false);
  };

  const formatFileSize = (bytes: number) => {
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStorageUsagePercentage = () => {
    if (!user) return 0;
    // Assuming a reasonable max file size limit for calculation
    const maxStorage = user.maxFiles * 50 * 1024 * 1024;
    return Math.min((user.totalFileSize / maxStorage) * 100, 100);
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
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">User data not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {user.fullName || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(user.created_at)}
                  </p>
                </div>
                {/* <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.updatedAt)}
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{user.totalFiles}</div>
                  <p className="text-sm text-muted-foreground">Files Uploaded</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{user.maxFiles}</div>
                  <p className="text-sm text-muted-foreground">File Limit</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {user.maxFiles - user.totalFiles}
                  </div>
                  <p className="text-sm text-muted-foreground">Files Remaining</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>File Usage</span>
                  <span>{user.totalFiles}/{user.maxFiles}</span>
                </div>
                <Progress 
                  value={(user.totalFiles / user.maxFiles) * 100} 
                  className="h-2"
                />
                {user.totalFiles >= user.maxFiles && (
                  <p className="text-xs text-destructive">Upload limit reached</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {formatFileSize(user.totalFileSize)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Storage Used</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {formatFileSize(user.totalFiles > 0 ? user.totalFileSize / user.totalFiles : 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Average File Size</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Storage Usage</span>
                  <span>{getStorageUsagePercentage().toFixed(1)}%</span>
                </div>
                <Progress value={getStorageUsagePercentage()} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Type</span>
                <Badge variant="secondary">Standard</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Limit</span>
                <Badge variant="outline">{user.maxFiles} files</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/files")}
              >
                <FileText className="h-4 w-4 mr-2" />
                View All Files
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 