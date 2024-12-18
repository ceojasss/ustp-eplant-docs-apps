import React from "react";
import ReactSpeedometer from "react-d3-speedometer";



const BmGauge = ({valueBm, title }) => {
  const normalizedValueBm = Math.min(Math.max(valueBm, 0), 20);
 
  return (
    <div style={{marginTop:'15px',padding:'15px'}}>
      <ReactSpeedometer
        minValue={0}
        maxValue={20}
        height={200}
        width={280}
        ringWidth={70}
        needleTransitionDuration={2500}
        needleHeightRatio={0.85}
        value={normalizedValueBm}
        customSegmentLabels={[]}
        customSegmentStops={[0,2,4,6,8,10,12,14,16,18,20]}
        startColor={normalizedValueBm === 0 ? "white" : "green"}
        endColor="red"
        needleTransition="easeElastic"
        needleColor={normalizedValueBm === 0 ? "white" : "blue"}
        currentValueText={`Buah Mentah : ${valueBm}`}
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

export default BmGauge;
