import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Download, ChartSpline, RefreshCcw, File, Folder } from "lucide-react";
import axiosInstance from "../api/axios.ts";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface File {
	id: number;
	created_at: string;
	fileName: string;
	fileUrl: string;
	updatedAt: string;
	email: string;
}

const Files: React.FC = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

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
			const data: File[] = response.data.message;
			setFiles(data);
			setFilteredFiles(data);
			console.log(data);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message || "Failed to fetch files");
		} finally {
			setLoading(false);
		}
	};

  // Initial fetch
	useEffect(() => {
		fetchFiles();
	}, []);

  // Filter by search query
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
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
		if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
		return (bytes / 1024 ** 3).toFixed(2) + " GB";
	};
	const totalFileSize = formatFileSize(
		files.reduce((sum, file) => sum + (file.size || 0), 0)
		);
	const totalFiles = files.length;

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white w-full h-[5rem] flex items-center justify-between p-4 shadow-sm">
				<h1 className="text-3xl font-bold text-gray-800">Files</h1>
				<div className="flex items-center gap-2 w-1/3">
					<Input
						className="w-full focus:outline-none focus-visible:ring-0 focus:shadow-sm border-gray-300"
						placeholder="Search your files here..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Search className="text-gray-500" />
				</div>
			</nav>

			<div className="p-6">
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<p className="text-lg text-gray-600">Loading...</p>
					</div>
					) : error ? (
					<div className="flex justify-center items-center h-64">
						<p className="text-lg text-red-500">{error}</p>
					</div>
					) : filteredFiles.length === 0 ? (
					<div className="flex justify-center items-center h-64">
						<p className="text-lg text-gray-600">
							{searchQuery ? "No files match your search." : "No files found."}
						</p>
					</div>
					) : (
					<div className="flex flex-col gap-6">
            		{/* Card Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-700">
										<File className="w-5 h-5 text-blue-500" />
										Total Files
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold text-gray-900">{totalFiles}</p>
								</CardContent>
								<CardFooter className="text-sm text-gray-500">
									Number of files uploaded
								</CardFooter>
							</Card>
							<Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-700">
										<Folder className="w-5 h-5 text-green-500" />
										Total File Size
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold text-gray-900">{totalFileSize}</p>
								</CardContent>
								<CardFooter className="text-sm text-gray-500">
									Total size of all files
								</CardFooter>
							</Card>
						</div>
            		{/* File Table */}
						<Card className="w-full">
							<CardHeader>
								<CardTitle className="flex justify-between items-center">
									<p>Your Files</p>
									<Button variant="outline" className="hover:cursor-pointer" onClick={fetchFiles}>
										<RefreshCcw /> Refresh
									</Button>
								</CardTitle>

							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>File Name</TableHead>
											<TableHead>Uploaded At</TableHead>
											<TableHead>Updated At</TableHead>
											<TableHead>Size</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredFiles.map((file) => (
											<TableRow key={file.id}>
												<TableCell className="font-medium">
													{file.fileName.substring(26)}
												</TableCell>
												<TableCell>{formatDate(file.created_at)}</TableCell>
												<TableCell>{formatDate(file.updatedAt)}</TableCell>
												<TableCell>{formatFileSize(file.size)}</TableCell>
												<TableCell>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															className="hover:cursor-pointer bg-green-100 text-green-500"
															onClick={() => window.open(file.fileUrl, "_blank")}
														>
															<ChartSpline className="text-green-500" /> Analyse
														</Button>
														<Button
															variant="outline"
															size="sm"
															className="hover:cursor-pointer bg-blue-100"
															onClick={() => window.open(file.fileUrl, "_blank")}
														>
															<Download className="text-primary" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															className="hover:cursor-pointer bg-red-100"
															onClick={() => window.open(file.fileUrl, "_blank")}
														>
															<Trash2 className="text-red-500" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
											))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
					)}
				</div>
			</div>
			);
};

export default Files;