import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import axiosInstance from '@/api/axios';

Chart.register(...registerables);

interface ScatterPlotProps {
  fileUrl: string;
  xColumn: string;
  yColumn: string;
  title?: string;
}

const ScatterPlot = ({ fileUrl, xColumn, yColumn, title }: ScatterPlotProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchScatterPlotData = async () => {
      try {
        const response = await axiosInstance.post('/analyse/scatter-plot', {
          fileUrl,
          xColumn,
          yColumn,
        });

        const { data, xColumn: xCol, yColumn: yCol, pointCount } = response.data.scatterPlot;

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          if (ctx) {
            chartInstance.current = new Chart(ctx, {
              type: 'scatter',
              data: {
                datasets: [{
                  label: `${xCol} vs ${yCol}`,
                  data: data,
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: title || `${xCol} vs ${yCol} (${pointCount} points)`,
                    font: {
                      size: 16,
                      weight: 'bold'
                    }
                  },
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: xCol,
                      font: {
                        weight: 'bold'
                      }
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: yCol,
                      font: {
                        weight: 'bold'
                      }
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                },
                interaction: {
                  mode: 'nearest',
                  intersect: false
                }
              },
            });
          }
        }
      } catch (error) {
        console.error('Error fetching scatter plot data:', error);
      }
    };

    fetchScatterPlotData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [fileUrl, xColumn, yColumn, title]);

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ScatterPlot; 