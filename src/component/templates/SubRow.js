import React from 'react';
import TablesDetail from './SubTableDynamic';
import _ from 'lodash'
import { Dimmer, Loader } from 'semantic-ui-react';
import { Appresources } from './ApplicationResources';

export function SubRows({ visibleColumns, column, datadetail, loading, header }) {
    if (loading) {
        return (
            <Dimmer active inverted>
                <Loader content={Appresources.TRANSACTION_ALERT.LOADING_STATUS} size="small" />
            </Dimmer>)
        {/* <tr>
                <td colSpan={visibleColumns.length - 1}>
                    Loading...
                </td>
            </tr> */}

    }

    // error handling here :)
    if (datadetail === "undefined") {
        return (<p> No details Found </p>)
    }


    //    // console.log(datadetail)

    const datadetails = _.map(datadetail, (data) => {
        return _.mapValues(data, (value, key) => {


            if (value instanceof Object) {
                let stringVal = ''
                _.map(Object.keys(value), (z, i) => {
                    stringVal += (i > 0 ? ' - ' : '') + value[z]
                })
                return stringVal;
            }

            return value
        })
    }
    )


    // // console.log(datadetails)

    return (
        <tr>
            <td colSpan={visibleColumns.length + 1}>
                {/* <Styles> */}
                <TablesDetail
                    columns={column}
                    data={datadetails}
                    header={header}
                />
                {/* </Styles> */}
            </td>
        </tr>)
}