import React from "react"
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓

import { Bar } from "react-chartjs-2"



const BarChartHorizontal = ({ chartStyle, content/*, dates, headerListener*/ }) => {
    //console.log(meta, _.pickBy(meta, x => _.includes(x.name, 'label_')))

    const meta = content.content?.metaData
    const labelFooter = _.pickBy(meta, x => _.includes(x.name, 'label_'))[0]['name']
    const value = content?.content?.rows

    let labels = _.map(value, (val) => val[labelFooter])


    const datasets = _.map(meta, m => {
        if (_.includes(m.name, '_value')) {

            let datas = [], borderColor = [], backgroundColor = []

            _.map(value, c => {
                datas.push(c[m.name])
                borderColor.push(c[m.name.replace('_value', '_bordercolor')])
                backgroundColor.push(c[m.name.replace('_value', '_bgcolor')])
            })


            return {
                label: m.name.replace('_value', ''),
                data: datas,
                borderColor: borderColor,
                backgroundColor: backgroundColor
            }
        }
    })

    const options = {
        indexAxis: 'y',
        responsive: true,
        aintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
                //   text: labelFooter,
                font: {
                    size: 20, // Ukuran teks judul
                },
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const data = {
        labels,
        datasets: _.compact(datasets),
        /*  options: options, */
    }



    return <div className="chart-container"
        style={chartStyle}>
        <Bar data={data} options={options} />
    </div >
}

export default BarChartHorizontal