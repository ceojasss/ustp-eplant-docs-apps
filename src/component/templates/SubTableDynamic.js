import React, { useState } from 'react'
import _ from 'lodash'
import { useTable, useExpanded, usePagination, useSortBy } from 'react-table'
import { Dimmer, Header, Icon, Loader, Modal } from 'semantic-ui-react';
import { Appresources } from './ApplicationResources';
import { getFormListComponent, parseNumbertoString } from '../../utils/FormComponentsHelpler';
import { toSingleXLS } from '../../utils/DataHelper';
import store from '../../redux/reducers';

function TablesDetail({ columns, data, header }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded }
    } = useTable(
        {
            columns,
            data,
            initialState: {

            },
        },
        useExpanded // We can useExpanded to track the expanded state
        // for sub components too!
    );

    const [detach, setDetach] = useState(false)


    if (_.isEmpty(data))
        return <Loader active inline='centered' content={Appresources.TRANSACTION_ALERT.LOADING_STATUS} />


    const table_visibility = getFormListComponent()



    const DetailTable = () => {
        return <React.Fragment>
            <Header size='small'>
                <Header.Content>
                    {header} &nbsp;
                    <Icon link name={detach ? 'window close outline' : 'external alternate'} color='green' onClick={() => {
                        setDetach(!detach)
                    }} /> &nbsp;
                    <Icon link name='file excel' color='green' onClick={() => {
                        toSingleXLS(data, header.substring(0, 29), header.substring(0, 29))
                    }} />
                </Header.Content>

            </Header>
            {/* style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1', fontSize: '8pt' }} */}
            <table className={detach ? "ui single line striped compact small table" : "ui small compact collapsing basic table "} {...getTableProps()} >
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, i) => (
                                // // console.log(_.get(table_visibility[i],'table_visibility'))
                                <th style ={detach? { position: 'sticky', top: '0', zIndex: '1',display: _.get(table_visibility[i], 'table_visibility') === 'GONE' && 'none'}: {display: _.get(table_visibility[i], 'table_visibility') === 'GONE' && 'none'}}/*{ display: _.get(table_visibility[i], 'table_visibility') === 'GONE' && 'none' }}*/ {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        return (<tr {...rowProps} key={rowProps.key}>
                            {row.cells.map((cell, i) => {
                                return (<td style={{ display: _.get(table_visibility[i], 'table_visibility') === 'GONE' && 'none' }} {...cell.getCellProps()}>
                                    {cell.column.datatype == 'oracledb.NUMBER' ? parseNumbertoString(cell.value) : cell.render('Cell')}
                                </td>);
                            })}
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </React.Fragment>
    }


    //    return <DetailTable />
    return <> {
        detach ? <Modal
            style={{ marginLeft: '30px' }}
            open={detach}
            onOpen={() => setDetach(true)}
            onClose={() => setDetach(false)}
            size={"fullscreen"}

        >
            <Modal.Content scrolling >
                <DetailTable />
            </Modal.Content>
        </Modal > : <DetailTable />
    }</>

}
export default TablesDetail