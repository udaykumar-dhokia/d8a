import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import HistogramPlot from "@/components/HistogramPlot";
import ScatterPlot from "@/components/ScatterPlot";
import BoxPlot from "@/components/BoxPlot";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatFileName } from "@/utils/formatFileName";
import { toast } from "sonner";

type Row = { [key: string]: any };
// type Describe = { [column: string]: { [stat: string]: number | string } };
type Info = {
  columns: string[];
  dtypes: string[]; 
  nullCounts: number[];
  shape: [number, number];
};

const AnalyseFile = () => {
  const { fileName } = useParams();
  const [head, setHead] = useState<Row[]>([]);
  const [tail, setTail] = useState<Row[]>([]);
  // const [describe, setDescribe] = useState<Describe>({});
  const [info, setInfo] = useState<Info | null>(null);
  const [nullCounts, setNullCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(50);
  const [allData, setAllData] = useState<Row[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedXColumn, setSelectedXColumn] = useState<string>("");
  const [selectedYColumn, setSelectedYColumn] = useState<string>("");
  const [selectedBoxPlotColumn, setSelectedBoxPlotColumn] = useState<string>("");

  const fileUrl = `https://tciincekcqrncwqewmql.supabase.co/storage/v1/object/public/datasets/${fileName}`;

  const transformDanfoOutput = (dfObject: any) => {
    const keys = Object.keys(dfObject);
    const length = dfObject[keys[0]].length;
    return Array.from({ length }, (_, i) => {
      const row: any = {};
      keys.forEach((key) => {
        row[key] = dfObject[key][i];
      });
      return row;
    });
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await axiosInstance.delete(`/file/delete/${encodeURIComponent(fileName || "")}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("File deleted successfully");
      // Redirect to files page
      window.location.href = "/files";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete file");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const fetchAllData = async () => {
    if (!fileName) return;
    setLoadingData(true);
    try {
      const response = await axiosInstance.post(`/analyse/view`, { 
        fileUrl,
        page: currentPage,
        pageSize 
      });
      
      // Handle empty data case
      if (Object.keys(response.data.data).length === 0) {
        setAllData([]);
        setCurrentPage(1);
      } else {
        setAllData(transformDanfoOutput(response.data.data));
      }
      
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (err: any) {
      setError(err.response?.data?.message || "Error loading data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentPage, pageSize, fileName]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      if (!fileName) return;
      setLoading(true);
      setError(null);

      try {
        const [headRes, tailRes, infoRes, nullCountsRes] = await Promise.all([
          axiosInstance.post(`/analyse/head`, { fileUrl }),
          axiosInstance.post(`/analyse/tail`, { fileUrl }),
          axiosInstance.post(`/analyse/info`, { fileUrl }),
          axiosInstance.post(`/analyse/null-counts`, { fileUrl }),
        ]);

        setHead(transformDanfoOutput(headRes.data.head)); 
        setTail(transformDanfoOutput(tailRes.data.tail));
        setInfo(infoRes.data.info);
        setNullCounts(nullCountsRes.data.nullCounts);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error loading file");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileName]);

  const renderTable = (title: string, data: Row[]) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-x-auto" style={{ maxHeight: '400px' }}>
          <div className="min-w-full inline-block align-middle">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-background z-10">
                <tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <th key={key} className="border px-4 py-2 text-left font-semibold whitespace-nowrap bg-background">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="border px-4 py-2 whitespace-nowrap">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );


  const renderInfo = () => {
    if (!info) return null;
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dataset Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-muted-foreground">Shape</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{info.shape[0]} rows</Badge>
                  <Badge variant="outline">{info.shape[1]} columns</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-muted-foreground">Total Null Values</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {Object.values(nullCounts).reduce((a, b) => a + b, 0)} nulls
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Column Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-x-auto" style={{ maxHeight: '400px' }}>
              <div className="min-w-full inline-block align-middle">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr>
                      <th className="border px-4 py-2 text-left font-semibold whitespace-nowrap bg-background">Column Name</th>
                      <th className="border px-4 py-2 text-left font-semibold whitespace-nowrap bg-background">Data Type</th>
                      <th className="border px-4 py-2 text-left font-semibold whitespace-nowrap bg-background">Null Count</th>
                      <th className="border px-4 py-2 text-left font-semibold whitespace-nowrap bg-background">Null Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.columns.map((col, idx) => {
                      const nullCount = nullCounts[col] || 0;
                      const nullPercentage = ((nullCount / info.shape[0]) * 100).toFixed(2);
                      return (
                        <tr key={col} className="hover:bg-muted/50">
                          <td className="border px-4 py-2 whitespace-nowrap font-medium">{col}</td>
                          <td className="border px-4 py-2 whitespace-nowrap">
                            <Badge variant="outline">{info.dtypes[idx]}</Badge>
                          </td>
                          <td className="border px-4 py-2 whitespace-nowrap">
                            {nullCount > 0 ? (
                              <Badge variant="destructive">{nullCount}</Badge>
                            ) : (
                              <Badge variant="secondary">0</Badge>
                            )}
                          </td>
                          <td className="border px-4 py-2 whitespace-nowrap">
                            {nullCount > 0 ? (
                              <Badge variant="destructive">{nullPercentage}%</Badge>
                            ) : (
                              <Badge variant="secondary">0%</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Types Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(
                info.dtypes.reduce((acc, type) => {
                  acc[type] = (acc[type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="font-medium">{type}</span>
                  <Badge variant="outline">{count} columns</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loadingData}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loadingData}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );

  const renderFullData = () => (
    <Card>
      <CardHeader>
        <CardTitle>Complete Dataset</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingData ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : allData.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No data available
          </div>
        ) : (
          <>
            <div className="relative w-full overflow-x-auto" style={{ maxHeight: '600px' }}>
              <div className="min-w-full inline-block align-middle">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr>
                      {Object.keys(allData[0] || {}).map((key) => (
                        <th key={key} className="border px-4 py-2 text-left font-semibold whitespace-nowrap bg-background">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="border px-4 py-2 whitespace-nowrap">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {renderPagination()}
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderScatterPlot = () => {
    if (!info) return null;

    // Filter numeric columns
    const numericColumns = info.columns.filter((_, idx) => 
      info.dtypes[idx] === "float32" || info.dtypes[idx] === "int32"
    );

    if (numericColumns.length < 2) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Not enough numeric columns for scatter plot</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Scatter Plot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">X-Axis Column</label>
                <Select
                  value={selectedXColumn}
                  onValueChange={setSelectedXColumn}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select X-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Y-Axis Column</label>
                <Select
                  value={selectedYColumn}
                  onValueChange={setSelectedYColumn}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedXColumn && selectedYColumn && (
              <ScatterPlot
                fileUrl={fileUrl}
                xColumn={selectedXColumn}
                yColumn={selectedYColumn}
                title={`${selectedXColumn} vs ${selectedYColumn}`}
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderBoxPlot = () => {
    if (!info) return null;

    // Filter numeric columns
    const numericColumns = info.columns.filter((_, idx) => 
      info.dtypes[idx] === "float32" || info.dtypes[idx] === "int32"
    );

    if (numericColumns.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No numeric columns available for box plot</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Box Plot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Column</label>
                <Select
                  value={selectedBoxPlotColumn}
                  onValueChange={setSelectedBoxPlotColumn}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedBoxPlotColumn && (
              <BoxPlot
                fileUrl={fileUrl}
                column={selectedBoxPlotColumn}
                title={`${selectedBoxPlotColumn} Distribution`}
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Analysis of {formatFileName(decodeURIComponent(fileName || ""))}
        </h1>
        <div className="flex items-center gap-2">
          {loading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete File
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="view">View File</TabsTrigger>
            <TabsTrigger value="head">Head</TabsTrigger>
            <TabsTrigger value="tail">Tail</TabsTrigger>
            <TabsTrigger value="histograms">Histograms</TabsTrigger>
            <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
            <TabsTrigger value="boxplot">Box Plot</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {renderInfo()}
          </TabsContent>

          <TabsContent value="view">
            {renderFullData()}
          </TabsContent>

          <TabsContent value="head">
            {renderTable("First 5 Rows", head)}
          </TabsContent>

          <TabsContent value="tail">
            {renderTable("Last 5 Rows", tail)}
          </TabsContent>

          <TabsContent value="histograms">
            <Card>
              <CardHeader>
                <CardTitle>Numeric Column Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                {info && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {info.columns.map((col, idx) => {
                      const type = info.dtypes[idx];
                      if (type === "float32" || type === "int32") {
                        return (
                          <HistogramPlot
                            key={col}
                            fileUrl={fileUrl}
                            column={col}
                            title={`${col} Distribution`}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scatter">
            {renderScatterPlot()}
          </TabsContent>

          <TabsContent value="boxplot">
            {renderBoxPlot()}
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{formatFileName(decodeURIComponent(fileName || ""))}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalyseFile;
