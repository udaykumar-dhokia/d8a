import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(50);
  const [allData, setAllData] = useState<Row[]>([]);
  const [loadingData, setLoadingData] = useState(false);

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
        setCurrentPage(1); // Reset to first page if no data
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

  // Fetch data when page changes
  useEffect(() => {
    fetchAllData();
  }, [currentPage, pageSize, fileName]);

  // Reset to first page when changing page size
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Analysis of {decodeURIComponent(fileName || "")}
        </h1>
        {loading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
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
        </Tabs>
      )}
    </div>
  );
};

export default AnalyseFile;
