import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

// const styles = {
//   title: {
//     fontSize: "18px",
//     color: "#000",
//   },
// };

const FfaGauge = ({ valueFfa, title }) => {
  const normalizedValueFfa = Math.min(Math.max(valueFfa, 2), 7);

  return (
    <div style={{ marginTop: "15px", padding: "15px" }}>
      <ReactSpeedometer
        minValue={2}
        maxValue={7}
        height={200}
        width={310}
        ringWidth={70}
        needleTransitionDuration={2500}
        needleHeightRatio={0.85}
        value={normalizedValueFfa}
        customSegmentStops={[2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7]}
        customSegmentLabels={[]}
        startColor={normalizedValueFfa === 0 ? "white" : "green"}
        endColor="red"
        needleTransition="easeElastic"
        needleColor={normalizedValueFfa === 0 ? "white" : "blue"}
        currentValueText={`FFA : ${valueFfa}`}
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

export default FfaGauge;
