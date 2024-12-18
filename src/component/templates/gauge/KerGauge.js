import React from "react";
import ReactSpeedometer from "react-d3-speedometer";


const KerGauge = ({valueKer, title }) => {
  const normalizedValueKer = Math.min(Math.max(valueKer, 4), 6.6);
 
  return (
    <div style={{marginTop:'15px',padding:'15px'}}>
      <ReactSpeedometer
        minValue={4}
        maxValue={6.6}
        height={200}
        width={310}
        ringWidth={70}
        needleTransitionDuration={2500}
        needleHeightRatio={0.85}
        value={normalizedValueKer}
        customSegmentStops={[4,4.2,4.4,4.6,4.8,5,5.2,5.4,5.6,5.8,6,6.2,6.4,6.6]}
        customSegmentLabels={[]}
        startColor={normalizedValueKer === 0 ? "white" : "red"}
        endColor="green"
        needleTransition="easeElastic"
        needleColor={normalizedValueKer === 0 ? "white" : "blue"}
        currentValueText={`KER: ${valueKer}`}
        paddingHorizontal={10}
        paddingVertical={20}
        labelFontSize={14}
        valueTextFontSize={18}
        valueTextFontWeight={600}
        textColor="black"
      />
      {/* <h2 style={styles.title}>{title}</h2> */}
      </div>
  );
};

export default KerGauge;
