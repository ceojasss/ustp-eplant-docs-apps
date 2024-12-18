import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const OerGauge = ({ valueOer, title }) => {
  const normalizedValueOer = Math.min(Math.max(valueOer, 23), 25.5);

  return (
    <div
      style={{
        marginTop:'15px',padding:'15px'
      }}
    >
      <ReactSpeedometer
        minValue={23}
        maxValue={25.5}
        height={200}
        width={310}
        ringWidth={70}
        needleTransitionDuration={2500}
        needleHeightRatio={0.85}
        value={normalizedValueOer}
        customSegmentStops={[23, 23.5, 24, 24.5, 25, 25.5]}
        customSegmentLabels={[]}
        startColor={normalizedValueOer === 0 ? "white" : "red"}
        endColor="green"
        needleTransition="easeElastic"
        needleColor={normalizedValueOer === 0 ? "white" : "blue"}
        currentValueText={`OER : ${valueOer}`}
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

export default OerGauge;
