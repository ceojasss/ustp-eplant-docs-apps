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
    Container,
    Popup,
    Icon,
    Label,
    Grid,
  } from "semantic-ui-react";
  import { matchSorter } from "match-sorter";
  import _ from "lodash";
  import React from "react";
  import { DELETE, UPDATE } from "../../redux/actions/types";
  import { ActionDisable, UpdateResultHeader } from "../../utils/DataHelper";
  import { NumberFormat } from "../Constants";
  
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
    if (typeof value === "number") {
      return `${NumberFormat(parseFloat(value).toFixed(2))}`;
    } else if (typeof value === "string") {
      return value;
    } else return "-";
  };
  
  const RenderTable = ({
    columns,
    data,
    tabletype,
    title,
    onRowClick,
    sticky,
    widths,
    index,
    detail,
    pagination,
    onCellClick
  }) => {
  
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
  
    const column = _.filter(
      _.filter(columns, (o) => {
        return !_.isNull(o.tablecomponent);
      }),
      { groupcomponent: "component" }
    );
  
    columns = React.useMemo(
      () =>
        _.concat(
          columns.map((v) => {
            // console.log(_.get(_.filter(v, v["groupcomponent"]), v["tablecomponent"]))
            // console.log(v["tablecomponent"]);
            return {
              Header: v["prompt_ina"],
              accessor: (data) => {
                // console.log(data);
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
            };
          })
        ),
      [columns]
    );
  
    data = React.useMemo(() => UpdateResultHeader(data), [data]);
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
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
    return (
      <>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />{" "}
        <Container
          style={{
            // overflowY: "scroll",
            display: "block",
            paddingRight: "0.5cm",
            maxHeight: "550px",
            width: "100vw",
            paddingBottom: "10px",
          }}
        >
          <Grid>
            <Grid.Column columns={2}>
              <Label style={{marginTop: "10px",display: title ? "inline-block" : "none", }}size="large">
                {title}{" "}
              </Label>
            </Grid.Column>
          </Grid>
          <Table compact striped sortable celled singleLine style={{ border: "1px solid black" }}
            {...getTableProps()}>
            <Table.Header
              style={{backgroundColor: "gainsboro",position: "sticky",top: "0",zIndex: "1",
              }}
            >
              {headerGroups.map((headerGroup) => (
                <Table.Row {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Table.HeaderCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{fontSize: "small",textAlign: "center",border: "1px solid black",}}
                      className={`table ${column.itemclass}`}>
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
            </Table.Header>
            <Table.Body {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <Table.Row className="column" {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
                      const value =
                        typeof cell.value === "string"
                          ? parseFloat(cell.value)
                          : cell.value;
                      const decimalPlaces = i === 0 ? 0 : 2;
                      const s =
                        cell.column.datatype === "number" &&
                        cell.row.index !== 1 &&
                        cell.row.index !== 2 &&
                        cell.row.index !== 3
                          ? parseFloat(cell.value).toFixed(0)
                          : cell.value;
  
                      const isDataUndefined = _.isUndefined(data);
                      return (
                        <Table.Cell
                          textAlign={typeof cell.column.datatype === "string"? "left" : "right" }
                          key={index}
                          {...cell.getCellProps()}
                          style={{  fontSize: "medium",border: "1px solid black",
                            textDecoration: index === 0 ? "underline" : "none",
                            color: index === 0 ? "blue" : "inherit",
                            cursor: index === 0 ? "pointer" : "auto", // Add cursor pointer to the first cell
                          }}
                          onClick={() => onCellClick(row.index, cell.column.index)}
                          content={
                            isDataUndefined
                              ? "Data Kosong"
                              : s === "NaN"
                              ? "-"
                              : s
                          }
                        />
                        
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Container>
        <Container
          id="Pagination"
          textAlign="center"
          style={{ display: pagination ? "block" : "none" }}
        >
          <Button.Group style={{ marginTop: "10px" }}>
            <Button
              color="blue"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              icon="angle double left"
            />
            <Button
              color="blue"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              icon="angle left"
            />
            <Button
              color="blue"
              onClick={() => nextPage()}
              disabled={!canNextPage}
              icon="angle right"
            />
            <Button
              color="blue"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              icon="angle double right"
            />
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
          {/* <Select
                              value={pageSize}
                              onChange={e => {
                                  console.log('change ')
                                  console.log(e.target.innerText)
                                  console.log('changes ')
                                  setPageSize(Number(e.target.innerText))
                              }}
                              options={[50].map(pageSize => ({ key: pageSize, value: pageSize, text: pageSize }))}
                          /> */}
        </Container>
      </>
    );
  };
  
  export default RenderTable;
  