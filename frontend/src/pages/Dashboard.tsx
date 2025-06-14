import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
	FileText,
	Upload,
	Settings2,
	BarChart3,
	FileChartLine,
	Clock,
	ArrowUpRight,
	LogOut
} from "lucide-react";
import axiosInstance from "@/api/axios";
// import { toast } from "sonner";

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
	const [stats, setStats] = useState({
		totalFiles: 0,
		totalSize: 0,
		analyzedFiles: 0,
		averageFileSize: 0
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
					headers: { Authorization: `Bearer ${token}` }
				});

				const files: File[] = response.data.message;
				setRecentFiles(files.slice(0, 5)); // Get 5 most recent files

				// Calculate stats
				const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
				setStats({
					totalFiles: files.length,
					totalSize,
					analyzedFiles: files.filter(f => f.fileName.includes("analyzed")).length,
					averageFileSize: files.length ? totalSize / files.length : 0
				});
			} catch (err: any) {
				setError(err.response?.data?.message || "Failed to fetch dashboard data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
		if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
		return (bytes / 1024 ** 3).toFixed(2) + " GB";
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	}

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

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<Button variant="outline" onClick={handleLogout} className="gap-2">
					<LogOut className="h-4 w-4" />
					Logout
				</Button>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Button 
					variant="outline" 
					className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5"
					onClick={() => navigate("/files")}
				>
					<FileText className="h-6 w-6 text-primary" />
					<span>View All Files</span>
				</Button>
				<Button 
					variant="outline" 
					className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5"
					onClick={() => navigate("/files")}
				>
					<Upload className="h-6 w-6 text-primary" />
					<span>Upload New File</span>
				</Button>
				<Button 
					variant="outline" 
					className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5"
					onClick={() => navigate("/settings")}
				>
					<Settings2 className="h-6 w-6 text-primary" />
					<span>Settings</span>
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Files</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
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
						<CardTitle className="text-sm font-medium">Total Size</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
						<p className="text-xs text-muted-foreground">
							Combined file size
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Analyzed Files</CardTitle>
						<FileChartLine className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.analyzedFiles}</div>
						<p className="text-xs text-muted-foreground">
							Files with analysis
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Average File Size</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatFileSize(stats.averageFileSize)}</div>
						<p className="text-xs text-muted-foreground">
							Per file
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Recent Activity
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recentFiles.length === 0 ? (
							<p className="text-muted-foreground text-center py-4">No recent files</p>
						) : (
							recentFiles.map((file) => (
								<div
									key={file.id}
									className="flex items-center justify-between p-4 rounded-lg border"
								>
									<div className="flex items-center gap-4">
										<FileText className="h-8 w-8 text-primary" />
										<div>
											<p className="font-medium">{file.fileName.substring(26)}</p>
											<p className="text-sm text-muted-foreground">
												{formatDate(file.created_at)}
											</p>
										</div>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => navigate(`/analyse/${encodeURIComponent(file.fileName)}`)}
									>
										<ArrowUpRight className="h-4 w-4" />
									</Button>
								</div>
							))
						)}
					</div>
				</CardContent>
				<CardFooter>
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
	);
}

export default Dashboard;