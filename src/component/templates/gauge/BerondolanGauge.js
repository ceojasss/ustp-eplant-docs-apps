import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const BrondolanGauge = ({ valueBrondolan, title }) => {
  const normalizedValueBrondolan = Math.min(Math.max(valueBrondolan, 0), 20);

  const segmentColors = [
    "#000000",
    "#ff4500",
    "#ff8c00",
    "#ffa500",
    "#ffd700",
    "#ffff00",
    "#adff2f",
    "#7fff00",
    "#32cd32",
    "#008000",
    "#006400",
  ];

  return (
    <div style={{ marginTop: "15px", padding: "15px" }}>
      <ReactSpeedometer
        minValue={0}
        maxValue={20}
        height={200}
        width={280}
        ringWidth={70}
        needleTransitionDuration={2500}
        needleHeightRatio={0.85}
        value={normalizedValueBrondolan}
        customSegmentLabels={[]}
        customSegmentStops={[0,1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
        segmentColors={[
          "#9e2119",
          "#9e9119",
          "#69b919",
          "#69b919",
          "#3ab919",
          "#3ab919",
          "#69b919",
          "#69b919",
          "#5c9e19",
          "#5c9e19",
          "#9e2119"
        ]}
        needleTransition="easeElastic"
        needleColor={normalizedValueBrondolan === 0 ? "white" : "blue"}
        currentValueText={`Berondolan: ${valueBrondolan}`}
        paddingHorizontal={10}
        paddingVertical={20}
        labelFontSize={14}
        valueTextFontSize={18}
        valueTextFontWeight={600}
        textColor="black"
      />
    </div>
  );
};

export default BrondolanGauge;
