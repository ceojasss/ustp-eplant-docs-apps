import React from "react"
import { Statistic } from "semantic-ui-react"
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓

import { parseNumbertoString } from "../../../utils/FormComponentsHelpler"



const StatisticView = ({ content, dates, headerListener }) => {

    const value = content?.content?.rows

    const Display = () => {
        return <Statistic.Group horizontal size="tiny" style={{ marginTop: '10px', minHeight: '2.5cm', width: '20vw', }} >
            {_.map(value, (x, xkey) => {
                return <Statistic key={`s.${xkey}`} color="blue" style={{ marginBottom: '0cm' }}>
                    {
                        _.map(content.content.metaData, (v, vkey) => {
                            return (v.name === 'label') ? <Statistic.Label key={`{l${vkey}}`} style={{ width: '100px', textAlign: 'left' }}>{x[v.name]}</Statistic.Label>
                                : <Statistic.Value key={`{v${vkey}}`} style={{ width: '100px', textAlign: 'right' }} text > {v.dbTypeName === 'NUMBER' ? parseNumbertoString(x[v.name], 0) : x[v.name]}</Statistic.Value>
                        })
                    }
                </Statistic>
            })
            }        </Statistic.Group>
    }

    return <Display />

}

export default StatisticView