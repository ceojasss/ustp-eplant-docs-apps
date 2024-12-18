import React from "react";
import ReactSpeedometer from "react-d3-speedometer";



const TrashGauge = ({valueTrash, title }) => {
  const normalizedValueTrash = Math.min(Math.max(valueTrash, 0), 20);
 
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
        value={normalizedValueTrash}
        customSegmentLabels={[]}
        customSegmentStops={[0,2,4,6,8,10,12,14,16,18,20]}
        startColor={normalizedValueTrash === 0 ? "white" : "green"}
        endColor="red"
        needleTransition="easeElastic"
        needleColor={normalizedValueTrash === 0 ? "white" : "blue"}
        currentValueText={`Kotoran : ${valueTrash}`}
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

export default TrashGauge;
