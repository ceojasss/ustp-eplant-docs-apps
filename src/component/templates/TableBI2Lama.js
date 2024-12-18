import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import {
  Button,
  Table,
  Input,
  Select,
  Container,
  Popup,
  Icon,
  Divider,
  TableHeader,
  TableHeaderCell,
  Grid,
  Label,
} from "semantic-ui-react";
import styled from "styled-components";

import { matchSorter } from "match-sorter";

import { StylesTable } from "./TableStyles";

import _ from "lodash";
import React from "react";
import { DELETE, DELETE_STREAM, UPDATE } from "../../redux/actions/types";
import { ActionDisable, UpdateResultHeader } from "../../utils/DataHelper";
import { NumberFormat , headersprodhariann, headersyieldpotensii} from "../Constants";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

};

const formatData = (value) => {
  if (typeof (value) === "number") {
    return `${NumberFormat(parseFloat(value).toFixed(2))}`;
  } else if (typeof (value) === "string") {
    return value;
  }
  else
    return "-";
}

const RenderTable = ({
  columns,
  data,
  title,
  onRowClick,
  sticky,
  widths,
  index,
  pagination
}) => {
  // // console.log(columns)
  // Use the state and functions returned from useTable to build your UI
  const fuzzyTextFilterFn = (rows, id, filterValue) => {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  };

  const datas = React.useMemo(
    () =>
      _.map(data, (d) => {
        return _.mapValues(d, (value, key) => {
          if (value instanceof Object) {
            let stringVal = "";
            _.map(Object.keys(value), (z, i) => {
              stringVal += (i > 0 ? " - " : "") + value[z];
            });
            return stringVal;
          }

          return formatData(value);
        });
      }),
    [data]
  );

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = (val) => !val;

  const rowcontrol = {
    Header: "Actions",
    accessor: "progress",
    Cell: ({ cell: { row, value } }) => {
      return (
        <div /* style={{ textAlign: "center" }} */>
          {/*    <Button.Group size="tiny">
                        <Popup
                            content='Update Data'
                            hideOnScroll
                            trigger={<Button primary icon="edit" onClick={() => onRowClick(UPDATE, row)} />}
                        />
                        <Button.Or />
                        <Popup
                            content='Delete Data'
                            hideOnScroll
                            trigger={<Button negative icon="delete" onClick={() => onRowClick(DELETE, row)} />}
                        />
                    </Button.Group> */}
          <Icon
            color="blue"
            name="edit"
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={() => onRowClick(UPDATE, row)}
            disabled={ActionDisable(row)}
          />
          <Icon
            color="red"
            name="delete"
            style={{ marginLeft: "5px", cursor: "pointer" }}
            onClick={() => onRowClick(DELETE, row)}
            disabled={ActionDisable(row)}
          />
        </div>
      );
    },
  };


  let groupComponents;

  columns = React.useMemo(
    () =>
      _.concat(
        groupComponents = columns.map((v) => {
          //// console.log(_.get(_.filter(v, v["groupcomponent"]), v["tablecomponent"]))
          return {
            Header: v["prompt_ina"],
            accessor: (data) => {
              //// console.log(data)
              return _.size(_.get(data, v["tablecomponent"])) > 40 ? (
                <Popup
                  content={_.get(data, v["tablecomponent"])}
                  trigger={
                    <div>{`${_.get(data, v["tablecomponent"]).substring(
                      0,
                      40
                    )} ...`}</div>
                  }
                />
              ) : (
                _.get(data, v["tablecomponent"])
              );
            },
            itemclass: v["itemclass"],
            datatype: v["datatype"],
            GroupComponent: v["groupcomponent"]
          };
        })
      ),
    [columns]
  );

  // Memeriksa check jenis tipe isi columns array atau object
  // if (Array.isArray(columns)) {
  //   console.log('Ini adalah array.');
  // } else {
  //   console.log('Ini bukan array.');
  // }
  // console.log(typeof columns);
  const mappedValues = _.map(columns, column => column.GroupComponent);
  const uniqueValues = _.uniq(Object.values(mappedValues));
  // console.log('Group component : ',uniqueValues);

  const filteredgroupcomponent = uniqueValues
  // console.log('filteredgroupcomponent : ' , filteredgroupcomponent[0]);




  data = React.useMemo(() => UpdateResultHeader(data), [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    visibleColumns,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: datas,
      initialState: { pageIndex: 0 },
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    usePagination
  );
  // Render the UI for your table
  // const filteredgroupcomponent = 'componentproduksiharian';

  let tableContent = (
    <>
      {headerGroups.map((headerGroup) => (
        <Table.Row {...headerGroup.getHeaderGroupProps()}>
          {console.log('headerGroup.headers : ', headerGroup)}
          {headerGroup.headers.map((column) => (
            <Table.HeaderCell
              {...column.getHeaderProps(column.getSortByToggleProps())}
              style={{
                fontSize: "small",
                textAlign: "center",
                border: "1px solid black",
              }}
              className={`table ${column.itemclass}`}
            >
              {column.render("Header")}
              <span>
                {column.isSorted
                  ? column.isSortedDesc
                    ? " 🔽"
                    : " 🔼"
                  : ""}
              </span>
            </Table.HeaderCell>
          ))}
        </Table.Row>
      ))}
    </>
  );

  // Check the condition and update the table content if necessary
  if (filteredgroupcomponent[0] === 'componentproduksiharian') {
    const headersTanggal = headersprodhariann[0].subHeaders[0].dataIndex 
    tableContent = (
      <>
        <Table.Row>
          
          {console.log('headers produksi hariann: ', headersTanggal)}
          {headersprodhariann.map((header) => (
            <Table.HeaderCell
              colSpan={header.subHeaders.length}
              textAlign="center"
              style={{
                backgroundColor: header.color,
                color: "white",
                border: "1px solid black",
              }}
              key={header.name}
            >
              {header.name}
            </Table.HeaderCell>
          ))}
        </Table.Row>
        <Table.Row>
          {headersprodhariann.map((header) =>
            header.subHeaders.map((subHeader) => (
              <Table.HeaderCell
                style={{
                  border: "1px solid black",
                  textAlign: "center",
                }}
                key={subHeader.dataIndex}
              >
                {subHeader.dataIndex}
              </Table.HeaderCell>
            ))
          )}
        </Table.Row>
      </>
    );
  } else if (filteredgroupcomponent[0] === 'componentyieldpotensi') {
    tableContent = (
      <>
        <Table.Row>
          {console.log('headers : ', headersyieldpotensii)}
          {headersyieldpotensii.map((header) => (
            <Table.HeaderCell
              colSpan={header.subHeaders.length}
              textAlign="center"
              style={{
                backgroundColor: header.color,
                color: "white",
                border: "1px solid black",
              }}
              key={header.name}
            >
              {header.name}
            </Table.HeaderCell>
          ))}
        </Table.Row>
        <Table.Row>
          {headersyieldpotensii.map((header) =>
            header.subHeaders.map((subHeader) => (
              <Table.HeaderCell
                style={{
                  border: "1px solid black",
                  textAlign: "center",
                }}
                key={subHeader.dataIndex}
              >
                {subHeader.dataIndex}
              </Table.HeaderCell>
            ))
          )}
        </Table.Row>
      </>
    );
  }

  return (
    <>
      {/* <Table.Row>
                                    <Table.HeaderCell
                                        colSpan={visibleColumns.length}
                                        style={{ textAlign: "left" }}> */}
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      {/* </Table.HeaderCell>
                                </Table.Row> */}
      <Container
        style={{
          overflowY: "scroll",
          display: "block",
          /*paddingLeft: '0.5cm',*/ paddingRight: "1.5cm",
          maxHeight: "550px",
          width: "86vw",
          paddingBottom: "5px",
        }}
      >
        {/* <Label size="large" pointing='below'>{title}</Label> */}
        <Table
          compact
          striped
          sortable
          celled
          singleLine
          style={{ border: "1px solid black" }}
          {...getTableProps()}
        >
          <Table.Header
            style={{
              backgroundColor: "gainsboro",
              position: "sticky",
              top: "0",
              zIndex: "1",
            }}
          >

            {/* jika group component == 'componentproduksiharian, maka jalankan header ini */}
            {/* <Table.Row>
              {console.log('headers : ', headers)}
              {headers.map((header) => (
                <Table.HeaderCell

                  colSpan={header.subHeaders.length}
                  textAlign="center"
                  style={{
                    backgroundColor: header.color,
                    color: "white",
                    border: "1px solid black",
                  }}
                  key={header.name}
                >
                  {header.name}
                </Table.HeaderCell>
              ))}
            </Table.Row>
            <Table.Row>
              {headers.map((header) =>
                header.subHeaders.map((subHeader) => (
                  <Table.HeaderCell
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                    }}
                    key={subHeader.dataIndex}
                  >
                    {subHeader.dataIndex}
                  </Table.HeaderCell>
                ))
              )}
            </Table.Row> */}


            {/* jika bukan maka, jalankan header ini */}

            {/* {console.log('headerGroups : ', headerGroups)}
            {headerGroups.map((headerGroup) => (
              <Table.Row {...headerGroup.getHeaderGroupProps()}>
                {console.log('headerGroup.headers : ', headerGroup)}
                {headerGroup.headers.map((column) => (
                  <Table.HeaderCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      fontSize: "small",
                      textAlign: "center",
                      border: "1px solid black",
                    }}
                    className={`table ${column.itemclass}`}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            ))} */}
            {tableContent}
          </Table.Header>
          <Table.Body {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Table.Row className="column" {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const value = typeof cell.value === "string" ? parseFloat(cell.value) : cell.value;
                    const decimalPlaces = i === 0 ? 0 : 2;
                    const s = cell.column.datatype === "number" && cell.row.index !== 1 && cell.row.index !== 2 && cell.row.index !== 3 ? parseFloat(cell.value).toFixed(0) : cell.value;
                    // // console.log(s)

                    // if (cell.row.cells[0]) {
                    //     return <th {...cell.getCellProps()}>{cell.render('Cell')}</th>
                    // } else {

                    return (
                      <Table.Cell
                        key={index}
                        //{// console.log(cell)}
                        {...cell.getCellProps()}
                        style={{
                          fontSize: "medium",
                          border: "1px solid black",
                          // textAlign: "center"
                          // textAlign: typeof cell.value === "number" ? "right" : "center"
                          textAlign: index === 0 ? "left" : "right"
                        }}
                        content={s === "NaN" ? "-" : s}
                      />
                    );
                  })}

                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Container>

      <Container textAlign="center">
        <Button.Group style={{ marginTop: '10px' }}>
          <Button color='blue' onClick={() => gotoPage(0)} disabled={!canPreviousPage} icon='angle double left' />

          <Button color='blue' onClick={() => previousPage()} disabled={!canPreviousPage} icon='angle left' />

          <Button color='blue' onClick={() => nextPage()} disabled={!canNextPage} icon='angle right' />

          <Button color='blue' onClick={() => gotoPage((pageCount - 1))} disabled={!canNextPage} icon='angle double right' />
        </Button.Group>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <Input
            type="number"
            min={1}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <Select
          value={pageSize}
          onChange={e => {
            // console.log('change ')
            // console.log(e.target.innerText)
            // console.log('changes ')
            setPageSize(Number(e.target.innerText))
          }}
          options={[10, 20, 30, 40, 50, 100].map(pageSize => ({ key: pageSize, value: pageSize, text: pageSize }))}
        />
      </Container>
    </>
  );
};

export default RenderTable;
