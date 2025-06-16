import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import axiosInstance from '@/api/axios';

// Register Chart.js components
Chart.register(...registerables);

interface BoxPlotProps {
  fileUrl: string;
  column: string;
  title?: string;
}

interface BoxPlotData {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
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

        const { min, q1, q2, q3, max, outliers } = response.data.boxPlot;

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          if (ctx) {
            const boxPlotData: BoxPlotData = {
              min,
              q1,
              median: q2,
              q3,
              max,
              outliers,
            };

            chartInstance.current = new Chart(ctx, {
              type: 'boxplot',
              data: {
                labels: [column],
                datasets: [{
                  label: column,
                  data: [boxPlotData],
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  outlierBackgroundColor: 'rgba(255, 99, 132, 0.5)',
                  outlierBorderColor: 'rgba(255, 99, 132, 1)',
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: title || `${column} Box Plot`,
                  },
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: column,
                    },
                  },
                },
              },
            } as any); // Type assertion needed due to custom chart type
          }
        }
      } catch (error) {
        console.error('Error fetching box plot data:', error);
      }
    };

    fetchBoxPlotData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [fileUrl, column, title]);

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  );
};

export default BoxPlot; 