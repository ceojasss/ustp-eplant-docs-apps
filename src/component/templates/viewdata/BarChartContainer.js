import React from "react"
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓

import { Bar } from "react-chartjs-2"



const BarChart = ({ chartStyle, content/*, dates, headerListener*/ }) => {
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

    const data = {
        labels,
        datasets: _.compact(datasets),
        options: {
            maintainAspectRatio: false,
            responsive: true,

        },
    }

    return <div className="chart-container"
        style={chartStyle}>
        <Bar id={`${content?.groupid}.${content?.code}`} data={data} />
    </div >
}

export default BarChart