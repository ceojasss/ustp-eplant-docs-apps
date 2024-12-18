import React from 'react';
import { SubRows } from './SubRow';
import _ from 'lodash'

export function SubRowAsync({ row, rowProps, column, visibleColumns, onDispatchdetail, datasdetail, header }) {
  const [loading, setLoading] = React.useState(true);

  //column =


  React.useEffect(() => {

    console.log(row)

    onDispatchdetail(row)
    setLoading(false)

  }, []);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      datadetail={datasdetail}
      column={React.useMemo(() => (_.concat(column.map((v) => { return { Header: v['prompt_ina'], accessor: v['tablecomponent'], datatype: v['datatype'] } }))), [])}
      header={header}
      loading={loading}
    />
  );
}