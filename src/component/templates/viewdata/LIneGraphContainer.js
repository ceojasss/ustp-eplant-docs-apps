import React from "react"
import _ from 'lodash'
import Chart from 'chart.js/auto'
import { Line } from "react-chartjs-2"
// *library imports placed above ↑
// *local imports placed below ↓




const LineGraph = ({ content, chartStyle }) => {

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

    const data = {
        labels,
        datasets: _.compact(datasets),
        options: {
            maintainAspectRatio: false,
            responsive: true,
        },
    }



    return <div className="chart-container" style={chartStyle}>
        <Line data={data} />
        <p style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 'smaller',
            fontWeight: 'bold'
        }}>{labelFooter.replace('label_', '')}</p>
    </div >
}

export default LineGraph