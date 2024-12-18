import React from 'react';
import { SubRows } from './SubRow';
import _ from 'lodash'
import LoadingStatus from "./LoadingStatus"
import { Icon, Loader, Popup } from 'semantic-ui-react';
import { ActionDisable, DeleteAuthorized, runReport } from '../../utils/DataHelper';
import { DELETE, PROCESS, UPDATE } from '../../redux/actions/types';

export function SubRowAsync({ row, rowProps, column, visibleColumns, onDispatchdetail, datasdetail, header, onRowClick }) {
  const [loading, setLoading] = React.useState(true);

  //column =

  const rowcontrol = {
    Header: 'Actions',
    accessor: 'progress',
    Cell: ({ cell: { row, value } }) => <div style={{ textAlign: "center" }}>
      {
        !_.isUndefined(row.original.approveaction) && <Popup
          content='Approve ?'
          position='top center'
          color='green'
          trigger={
            <Icon.Group style={{ marginRight: '10px', cursor: 'pointer' }}                            >
              <Icon name='file text outline'
                color={(ActionDisable(row) ? 'grey' : 'green')}
                disabled={ActionDisable(row)}
                onClick={() => onRowClick(PROCESS, row)} />
              <Icon corner name='checkmark' color='green' />
            </Icon.Group>} />}
      <Popup
        content='Run Report'
        position='top center'
        trigger={
          <Icon color='red' name='file pdf outline' style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => runReport(row)} />
        } />
      <Popup
        content='Edit Data'
        position='top center'
        trigger={
          <Icon color='blue' name='edit' style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => onRowClick(UPDATE, row)} disabled={ActionDisable(row)} />} />
      <Popup
        content='Delete Data'
        position='top center'
        trigger={
          <Icon color='red' name='delete' style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => onRowClick(DELETE, row)} disabled={DeleteAuthorized(row)} />} />
    </div >
  }

  React.useEffect(() => {

    onDispatchdetail(row)
    setLoading(false)

  }, []);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      datadetail={datasdetail}
      column={React.useMemo(() => (_.concat(rowcontrol, column.map((v) => { return { Header: v['prompt_ina'], accessor: v['tablecomponent'], datatype: v['datatype'] } }))))}
      header={header}
      loading={loading}
    />
  );
}