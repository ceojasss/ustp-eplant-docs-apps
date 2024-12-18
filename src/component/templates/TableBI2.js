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
import { NumberFormat } from "../Constants";

{
  /* <Grid.Column floated='right' width={5} >
        <Input
            size="small"
            value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} records...`}
                style={{
                    fontSize: "1.1rem",
                    border: "0"
                }}
        />
    </Grid.Column> */
}

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

  // return (
  //     <Grid.Column floated='right' width={5} style={{ marginTop: '-55px' }}>
  //         <Input
  //             size="small"
  //             value={value || ""}
  //             onChange={(e) => {
  //                 setValue(e.target.value);
  //                 onChange(e.target.value);
  //             }}
  //             placeholder={`Search : ${count} records...`}
  //             style={{
  //                 fontSize: "1.1rem",
  //                 border: "0"
  //             }}
  //         />
  //     </Grid.Column>
  // );
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
  pagination,
  produksiharian,
  size
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

  
  columns = React.useMemo(
    () =>
      _.concat(
        columns.map((v) => {
          //// console.log(_.get(_.filter(v, v["groupcomponent"]), v["tablecomponent"]))  
          return {
            Header: v["prompt_ina"],
            accessor: (data) => {
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
            groupcomponent: v["groupcomponent"],
            promptcomponent: v["prompt_ina"],
            textalign: v["textalign"]
          };
        })
      ),
    [columns]
  );

  console.log('columns here : ', columns);
  const mappedValues = _.map(columns, column => column.groupcomponent);
  const uniqueValues = _.uniq(Object.values(mappedValues));
  const filteredgroupcomponent = uniqueValues
  console.log('filteredgroupcomponent : ', filteredgroupcomponent[0]);

  const mappedPromps = _.map(columns, column => column.promptcomponent);
  const uniquePromps = _.uniq(Object.values(mappedPromps));
  const filteredPromps = uniquePromps
  console.log('filteredPromps : ', filteredPromps);


  produksiharian = React.useMemo(() => {
    const newColumns = [];

    columns.forEach((v) => {
      const headerText = v.Header;
      // console.log('headerText :', headerText);

      const [prefix, suffix] = headerText.split(' ');

      const newColumn = {
        Header: prefix,
        subHeaders: [],
        accessor: v.accessor,
        itemclass: v.itemclass,
        datatype: v.datatype,
        textalign: v.textalign,
        isSorted: false,
        isSortedDesc: false,
        getSortByToggleProps: () => ({}),
      };

      if (suffix && !newColumn.subHeaders.includes(suffix)) {
        newColumn.subHeaders.push(suffix);
      }

      const existingColumn = newColumns.find((col) => col.Header === prefix);
      if (!existingColumn) {
        newColumns.push(newColumn);
      } else {
        existingColumn.subHeaders = Array.from(
          new Set(existingColumn.subHeaders.concat(newColumn.subHeaders))
        );
      }


      // if (headerText !== 'INTI' && headerText !== 'PLASMA') {
      //   const [prefix, suffix] = headerText.split(' ');

      //   const newColumn = {
      //     Header: prefix,
      //     subHeaders: [],
      //     accessor: v.accessor,
      //     itemclass: v.itemclass,
      //     datatype: v.datatype,
      //     textalign: v.textalign,
      //     isSorted: false,
      //     isSortedDesc: false,
      //     getSortByToggleProps: () => ({}),
      //   };

      //   if (suffix && !newColumn.subHeaders.includes(suffix)) {
      //     newColumn.subHeaders.push(suffix);
      //   }

      //   const existingColumn = newColumns.find((col) => col.Header === prefix);
      //   if (!existingColumn) {
      //     newColumns.push(newColumn);
      //   } else {
      //     existingColumn.subHeaders = Array.from(
      //       new Set(existingColumn.subHeaders.concat(newColumn.subHeaders))
      //     );
      //   }
      // } 
      // else 
      // {
      //   newColumns.push({
      //     Header: headerText,
      //     accessor: v.accessor,
      //     itemclass: v.itemclass,
      //     datatype: v.datatype,
      //     textalign: v.textalign,
      //     getSortByToggleProps: () => ({}),
      //   });
      // }
    });
    console.log('newColumns : ', newColumns);

    return newColumns;
  }, [produksiharian]);

  console.log('filteredgroupcomponent :', filteredgroupcomponent[0]);


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
      produksiharian,
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

  let tableHeader;

  if (filteredgroupcomponent[0] === 'componentproduksiharian' || filteredgroupcomponent[0] === 'componentyieldpotensi') {
    tableHeader = (
      <Table.Header style={{ backgroundColor: "gainsboro", position: "sticky", top: "0", zIndex: "1" }}>
        <Table.Row>
          {produksiharian.map((header, index) => (
            <Table.HeaderCell
              key={index}
              colSpan={header.subHeaders ? header.subHeaders.length : 1}
              rowSpan={header.subHeaders && header.subHeaders.length > 0 ? 1 : 2}
              style={{ fontSize: "10px", textAlign: "center", border: "0.5px solid black" }}
            >
              {header.Header}
            </Table.HeaderCell>
          ))}
        </Table.Row>
  
        {produksiharian.map((header) => header.subHeaders) && (
          <Table.Row>
            {produksiharian.map((header) =>
              header.subHeaders && header.subHeaders.map((subHeader, subIndex) => (
                <Table.HeaderCell
                  key={subIndex}
                  style={{ fontSize: "10px", textAlign: "center", border: "0.5px solid black" }}
                >
                  {subHeader}
                  <span>
                    {subHeader.isSorted
                      ? subHeader.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </Table.HeaderCell>
              ))
            )}
          </Table.Row>
        )}
      </Table.Header>
    );
  } else {
    tableHeader = (
      <Table.Header style={{ backgroundColor: "gainsboro", position: "sticky", top: "0", zIndex: "1" }}>
        {headerGroups.map((headerGroup) => (
          <Table.Row {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Table.HeaderCell
                {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{ fontSize: '10px', textAlign: "center", border: "0.5px solid black " }}
              >
                {column.render("Header")}
                <span>
                  {column.isSorted ? column.isSortedDesc ? " 🔽" : " 🔼" : ""}
                </span>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
    );
  }
  


  return (
    <>
      {/* <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter}/>{" "} */}

      <Container style={{ display: "block", paddingRight: "0.5cm", maxHeight: "550px", width: "80vw", paddingBottom: "10px" }}>
        <Grid>
          <Grid.Column columns={2}>
            {/*Title Section */}
            <Label style={{ marginTop: "10px", display: title ? "inline-block" : "none" }} size="large"> {title}{" "}</Label>
          </Grid.Column>
        </Grid>
        <Table size="mini" compact striped sortable celled singleLine style={{ border: "1.1px solid black" }}
          {...getTableProps()}>

          {/*Jika Group Component = 'componentlph' */}
          
          {/* {groupComponent === 'componentproduksiharian' ? (
            <Table.Header style={{ backgroundColor: "gainsboro", position: "sticky", top: "0", zIndex: "1" }}>
              <Table.Row>
                {produksiharian.map((header, index) => {
                  console.log("Current Header:", header.subHeaders); // Output ke konsol

                  return (
                    <Table.HeaderCell
                      key={index}
                      colSpan={header.subHeaders ? header.subHeaders.length : 1}
                      rowSpan={header.subHeaders && header.subHeaders.length > 0 ? 1 : 2}
                      // rowSpan={
                      //   (header.subHeaders && header.subHeaders.length > 0) ||
                      //   (header.subHeaders && header.subHeaders.includes('Harian'))
                      //     ? 1
                      //     : 2
                      // }
                      style={{ fontSize: "10px", textAlign: "center", border: "0.5px solid black" }}
                    >
                      {header.Header}
                    </Table.HeaderCell>
                  );
                })}
              </Table.Row>

              {produksiharian.map((header) => header.subHeaders) && (
                <Table.Row >
                  {produksiharian.map((header) =>
                    header.subHeaders && header.subHeaders.map((subHeader, subIndex) => (
                      <Table.HeaderCell
                        key={subIndex}
                        style={{ fontSize: "10px", textAlign: "center", border: "0.5px solid black" }}>
                        {subHeader}
                        <span>
                          {subHeader.isSorted
                            ? subHeader.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </Table.HeaderCell>
                    ))
                  )}
                </Table.Row>
              )}
            </Table.Header>

          ) :
            (
              <Table.Header style={{ backgroundColor: "gainsboro", position: "sticky", top: "0", zIndex: "1" }}>
                {headerGroups.map((headerGroup) => (
                  <Table.Row  {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <Table.HeaderCell
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        style={{ fontSize: '10px', textAlign: "center", border: "0.5px solid black " }}>
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? column.isSortedDesc ? " 🔽" : " 🔼" : ""}
                        </span>
                      </Table.HeaderCell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>

            )} */}
            {tableHeader}





          <Table.Body {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Table.Row className="column" {...row.getRowProps()}>
                  {/* Menambahkan kolom nomor indeks */}
                  {/* <Table.Cell textAlign="center">{i + 1}</Table.Cell> */}
                  {row.cells.map((cell) => {
                    const value = typeof cell.value === "string" ? parseFloat(cell.value) : cell.value;
                    const decimalPlaces = i === 0 ? 0 : 2;
                    const s = cell.column.datatype === "number" && cell.row.index !== 1 && cell.row.index !== 2 && cell.row.index !== 3
                      ? parseFloat(cell.value).toFixed(0)
                      : cell.value;

                    return (
                      <Table.Cell
                        textAlign={typeof cell.column.textalign === "string" ? cell.column.textalign === "center" ? "center" : "left" : "right"}
                        key={index}
                        {...cell.getCellProps()}
                        style={{
                          fontSize: "10.2px",
                          border: "0.2px solid black",
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
      <Container id="Pagination" style={{ textAlign: "center", display: pagination ? "inline-block" : "none" }}>
        <Button.Group style={{ marginTop: "10px" }}>
          <Button color="teal" onClick={() => gotoPage(0)} disabled={!canPreviousPage} icon="angle double left" />
          <Button color="teal" onClick={() => previousPage()} disabled={!canPreviousPage} icon="angle left" />
          <Button color="teal" onClick={() => nextPage()} disabled={!canNextPage} icon="angle right" />
          <Button color="teal" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} icon="angle double right" />
        </Button.Group>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <Input
            type="number"
            min={1}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <Select
          id="Size"
          value={pageSize}
          style={{ display: size ? "inline-block" : "none", position: "fixed", marginTop: "9px", marginLeft: "2px" }}
          onChange={(e) => {
            setPageSize(Number(e.target.innerText));
          }}
          options={[10, 20, 30, 40].map((pageSize) => ({
            key: pageSize, value: pageSize, text: pageSize,
          }))}
        />
      </Container>
    </>
  );
};

export default RenderTable;
