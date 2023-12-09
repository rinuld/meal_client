import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarGraph = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // console.log(data);
  console.log("Render Graph");

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy the existing chart
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.years,
        datasets: [
          {
            label: 'Target',
            data: data.targetReach,
            backgroundColor: 'rgba(16, 101, 68, 1)',
            borderColor: 'rgba(16, 101, 68, 1)',
            borderWidth: 1,
          },
          {
            label: 'Actuals',
            data: data.actualReach,
            backgroundColor: 'rgba(163, 198, 57, 1)',
            borderColor: 'rgba(163, 198, 57, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BarGraph;
