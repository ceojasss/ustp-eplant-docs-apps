import React from "react";
import { Line } from "react-chartjs-2";
import { Grid, Label } from "semantic-ui-react";

const LineChart = ({ data, title, label }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <Line data={data} width={375} height={275} />
      <Grid>
        <Grid.Column textAlign="center">
          <label>{label}</label>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default LineChart;
