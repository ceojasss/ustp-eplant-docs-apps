import React from "react"
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓

import { Bar, Chart } from "react-chartjs-2"



const Barline = ({ chartStyle, content/*, dates, headerListener*/ }) => {
    //console.log(meta, _.pickBy(meta, x => _.includes(x.name, 'label_')))

    const meta = content.content?.metaData
    const labelFooter = _.pickBy(meta, x => _.includes(x.name, 'label_'))[0]['name']
    const value = content?.content?.rows

    let labels = _.map(value, (val) => val[labelFooter])

    let minnes, maxxes, stepincr

    const datasets = _.map(meta, m => {
        if (_.includes(m.name, '_value')) {

            let datas = [], borderColor = [], backgroundColor = []
            let type


            const identifier = m.name.replace('_value', '')

            _.map(value, c => {
                datas.push(c[m.name])
                borderColor.push(c[m.name.replace('_value', '_bordercolor')])
                backgroundColor.push(c[m.name.replace('_value', '_bgcolor')])

                type = c[`${identifier}_type`]

                minnes = c['min_y']
                maxxes = c['max_y']

                stepincr = c['increment_y']
            })

            return {
                label: m.name.replace('_value', ''),
                type: type,
                data: datas,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            }
        }
    })

    //console.log(datasets)


    const opts = {
        maintainAspectRatio: true,
        responsive: true, scales: {
            y: {
                min: minnes,
                max: maxxes,
                ticks: {
                    // forces step size to be 50 units
                    stepSize: stepincr
                }
            }
        }
    }

    const data = {
        labels,
        datasets: _.compact(datasets),
        /*     options: {
                maintainAspectRatio: true,
                responsive: true, scales: {
                    y: {
                        min: 15,
                        max: 30,
                    }
                }
            }, */
    }

    //  console.log(data.datasets)


    return <div className="chart-container"
        style={chartStyle}>
        <Chart type='bar' id={`${content?.groupid}.${content?.code}`} data={data} options={opts} />
        {/*   <Bar id={`${content?.groupid}.${content?.code}`} data={data} /> */}
    </div >
}

export default Barline