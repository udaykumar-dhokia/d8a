import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Download, ChartSpline } from "lucide-react";
import axiosInstance from "../api/axios.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Define the File interface based on the provided data structure
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

	useEffect(() => {
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
			} catch (err: any) {
				setError(err.response?.data?.message || err.message || "Failed to fetch files");
			} finally {
				setLoading(false);
			}
		};

		fetchFiles();
	}, []);

  // Handle search filtering
	useEffect(() => {
		const filtered = files.filter((file) =>
			file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
			);
		setFilteredFiles(filtered);
	}, [searchQuery, files]);

  // Format date for display
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

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
					<Card className="w-full">
						<CardHeader>
							<CardTitle>Your Files</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>File Name</TableHead>
										<TableHead>Uploaded At</TableHead>
										<TableHead>Updated At</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredFiles.map((file) => (
										<TableRow key={file.id}>
											<TableCell className="font-medium">{file.fileName.substr(26)}</TableCell>
											<TableCell>{formatDate(file.created_at)}</TableCell>
											<TableCell>{formatDate(file.updatedAt)}</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														className="hover:cursor-pointer bg-green-100 text-green-500"
														onClick={() => window.open(file.fileUrl, "_blank")}
													>
														<ChartSpline className="text-green-500"/> Analyse
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="hover:cursor-pointer bg-blue-100"
														onClick={() => window.open(file.fileUrl, "_blank")}
													>
														<Download className="text-primary"/>
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
					)}
				</div>
			</div>
			);
};

export default Files;