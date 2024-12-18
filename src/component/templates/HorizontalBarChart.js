import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, title }) => {
  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      title:{
        display:true,
        text : title,
        font: {
          size: 20, // Ukuran teks judul
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <Bar data={data} options={options} width={100} height={70} />
  );
};

export default BarChart;
