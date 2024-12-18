import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ data, options, containerStyle, title }) => {

  console.log(data)

  console.log(options)

  return (
    <div style={containerStyle}>
      {title && <h2 style={{ textAlign: "center" }}>{title}</h2>}
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
