import React from "react"
import ReactSpeedometer from "react-d3-speedometer";

import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓




const Gauge = ({ content/*, dates, headerListener*/ }) => {

    const meta = content.content?.metaData

    const labelFooter = ''// _.pickBy(meta, x => _.includes(x.name, 'label_'))[0]['name']

    const rows = content?.content?.rows

    const values = rows[0]

    const value = _.round(values?.val, 2)
    const minValue = _.round(values?.min_val, 2)
    const maxValue = _.round(values?.max_val, 2)
    const increment = _.round(values?.increment_val, 2)

    const incrementType = _.isEmpty(values?.increment_type) ? 'asc' : values?.increment_type

    const startColors = incrementType === 'desc' ? 'green' : 'red'
    const endcolors = incrementType === 'desc' ? 'red' : 'green'

    const label = values?.indicatorname

    let segmentsValue = []

    let x = minValue


    for (let index = minValue; index <= maxValue; index += increment) {

        segmentsValue.push(index)
    }

    let labels = _.map(value, (val) => val[labelFooter])

    const normalizedValue = Math.min(Math.max(value, _.min(segmentsValue)), _.max(segmentsValue));


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



    return <div className="chart-container">
        <ReactSpeedometer
            minValue={_.min(segmentsValue)}
            maxValue={_.max(segmentsValue)}
            height={200}
            width={310}
            ringWidth={70}
            needleTransitionDuration={2500}
            needleHeightRatio={0.85}
            value={normalizedValue}
            customSegmentStops={segmentsValue}
            customSegmentLabels={[]}
            startColor={normalizedValue === 0 ? "white" : startColors}
            endColor={endcolors}
            needleTransition="easeElastic"
            needleColor={normalizedValue === 0 ? "white" : "blue"}
            currentValueText={`${label}: ${value}`}
            paddingHorizontal={10}
            paddingVertical={20}
            labelFontSize={'14'}
            valueTextFontSize={'18'}
            valueTextFontWeight={'600'}
            textColor="black"
        />
        <p style={{ width: '100%', textAlign: 'center', fontSize: 'smaller', fontWeight: 'bold' }}>
            {labelFooter.replace('label_', '')}</p>
    </div >
}

export default Gauge