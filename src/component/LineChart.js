import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ chartData }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Test Line Chart</h2>
      <Line data={chartData} width={500} height={350} />
    </div>
  );
}

export default LineChart;
