import React from "react"
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓


import { Pie } from "react-chartjs-2"

const colorMap = {};
const selectedColors = {};

const generateColor = () => {
    let randomColorString = "#";
    const arrayOfColorFunctions = "0123456789abcdef";
    for (let x = 0; x < 6; x++) {
        let index = Math.floor(Math.random() * 16);
        let value = arrayOfColorFunctions[index];

        randomColorString += value;
    }
    return randomColorString;
};

const newColorFind = id => {
    // If already generated and assigned, return
    if (colorMap[id]) return colorMap[id];

    // Generate new random color
    let newColor;

    do {
        newColor = generateColor();
    } while (selectedColors[newColor]);

    // Found a new random, unassigned color
    colorMap[id] = newColor;
    selectedColors[newColor] = true;

    // Return next new color
    return newColor;
}

const PieGraph = ({ content/*, dates, headerListener*/ }) => {

    const meta = content.content?.metaData

    //console.log(meta, _.pickBy(meta, x => _.includes(x.name, 'label_')))

    const labelFooter = _.pickBy(meta, x => _.includes(x.name, 'label_'))[0]['name']

    const value = content?.content?.rows

    let labels = _.map(value, (val) => val[labelFooter])


    const datasets = _.map(meta, m => {
        if (_.includes(m.name, '_value')) {

            let datas = [], borderColor = [], backgroundColor = []

            _.map(value, (c, idx) => {
                datas.push(c[m.name])
                //   borderColor.push("black")
                backgroundColor.push(newColorFind(idx))
            })


            return {
                //    label: m.name.replace('_value', ''),
                data: datas,
                borderColor: "black",
                backgroundColor: backgroundColor,
                borderWidth: 0.5
            }
        }
    })

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    padding: 10,
                }
            },
        },
    };


    const data = {
        labels,
        datasets: _.compact(datasets),
        options: options,
    }


    return <div className="chart-container">
        <Pie data={data}/*  options={options} */ />
        <p style={{ width: '100%', textAlign: 'center', fontSize: 'smaller', fontWeight: 'bold' }}>{labelFooter.replace('label_', '')}</p>
    </div >
}

export default PieGraph