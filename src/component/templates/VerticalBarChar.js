import React from "react";
import { Bar } from "react-chartjs-2";
import { Grid, Label } from "semantic-ui-react";

const BarChart = ({ data, title }) => {
  return (
    <div>
      {title && <h2 style={{ textAlign: "center" }}>{title}</h2>}
      <Bar data={data} width={350} height={350} />
    </div>
  );
};

export default BarChart;
