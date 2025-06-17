import { useEffect, useRef } from 'react';
import axiosInstance from '@/api/axios';
import { Chart, registerables } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

interface BoxPlotProps {
  fileUrl: string;
  column: string;
  title?: string;
}

const BoxPlot = ({ fileUrl, column, title }: BoxPlotProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchBoxPlotData = async () => {
      try {
        const response = await axiosInstance.post('/analyse/box-plot', {
          fileUrl,
          column,
        });

        const { data } = response.data.boxPlot;

        // Calculate statistics
        const sortedData = [...data].sort((a, b) => a - b);
        const q1 = sortedData[Math.floor(sortedData.length * 0.25)];
        const median = sortedData[Math.floor(sortedData.length * 0.5)];
        const q3 = sortedData[Math.floor(sortedData.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        // Find outliers
        const outliers = sortedData.filter(
          (value) => value < lowerBound || value > upperBound
        );

        // Find min and max (excluding outliers)
        const min = sortedData.find((value) => value >= lowerBound) || q1;
        const max = [...sortedData].reverse().find((value) => value <= upperBound) || q3;

        // Get overall min and max from the raw data for Y-axis scaling
        const overallMin = Math.min(...data);
        const overallMax = Math.max(...data);

        // Set a larger fixed buffer for the y-axis range to ensure all points are visible
        const buffer = 20; // Increased buffer significantly for maximum outlier visibility
        const yAxisMin = overallMin - buffer;
        const yAxisMax = overallMax + buffer;

        // Destroy previous chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create new chart
        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          if (ctx) {
            chartInstance.current = new Chart(ctx, {
              type: 'boxplot',
              data: {
                labels: [column],
                datasets: [{
                  label: column,
                  data: [{
                    min,
                    q1,
                    median,
                    q3,
                    max,
                    outliers
                  }],
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgb(54, 162, 235)',
                  borderWidth: 1,
                  outlierBackgroundColor: 'rgba(255, 99, 132, 0.5)',
                  outlierBorderColor: 'rgb(255, 99, 132)',
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: title || `${column} Distribution`
                  },
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: 'Value'
                    },
                    min: yAxisMin,
                    max: yAxisMax,
                    ticks: {
                      callback: (value) => Number(value).toFixed(2)
                    }
                  }
                }
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching box plot data:', error);
      }
    };

    fetchBoxPlotData();

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [fileUrl, column, title]);

  return (
    <div className="w-full h-[800px] p-4 bg-white rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  );
};

export default BoxPlot; 