import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { Button, Table, Input, Container, Popup, Icon, Label, Grid, Select } from "semantic-ui-react";
import { matchSorter } from "match-sorter";
import _ from "lodash";
import React from "react";
import { DELETE, UPDATE } from "../../redux/actions/types";
import { ActionDisable, UpdateResultHeader } from "../../utils/DataHelper";
import { NumberFormat } from "../Constants";

const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
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

const RenderTable = ({ columns, lphcolumns, data, tabletype, title, onRowClick, sticky, widths, index, detail, pagination, size, onCellClick, }) => {



  // ? Filter
  const fuzzyTextFilterFn = (rows, id, filterValue) => {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  };

  // ? Get Datas Formaated
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

  // ? FilterTypes
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

  // ? Filter
  fuzzyTextFilterFn.autoRemove = (val) => !val;

  // ? RowControl
  const rowcontrol = {
    Header: "Actions",
    accessor: "progress",
    Cell: ({ cell: { row, value } }) => {
      return (
        <div >
          <Icon color="blue" name="edit"
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

  // ? Column
  const column = _.filter(
    _.filter(columns, (o) => {
      return !_.isNull(o.tablecomponent);
    }),
    { groupcomponent: "component" }
  );



  // ? Get Columns Normally
  columns = React.useMemo(
    () =>
      _.concat(
        columns.map((v) => {
          // console.log(_.get(_.filter(v, v["groupcomponent"]), v["tablecomponent"]))
          // console.log("gc",v["groupcomponent"]);
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
            groupcomponent: v["groupcomponent"],
            textalign: v["textalign"]
          };
        })
      ),
    [columns]
  );



  // ? Groupped Columns Lph

  lphcolumns = React.useMemo(() => {
    const newColumns = [];

    columns.forEach((v) => {
      const headerText = v.Header;

      if (headerText !== 'NO' && headerText !== 'INDICATOR NAME' && headerText !== 'UOM') {
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
      } else {
        newColumns.push({
          Header: headerText,
          accessor: v.accessor,
          itemclass: v.itemclass,
          datatype: v.datatype,
          textalign: v.textalign,
          getSortByToggleProps: () => ({}),
        });
      }
    });

    return newColumns;
  }, [lphcolumns]);

  // ? Component
  const groupComponent = columns[0]["groupcomponent"]; // Ganti indeks sesuai dengan yang diinginkan




  data = React.useMemo(() => UpdateResultHeader(data), [data]);


  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, visibleColumns, state, preGlobalFilteredRows, setGlobalFilter, state: { pageIndex, pageSize },
  } = useTable({ columns, lphcolumns, data: datas, initialState: { pageIndex: 0 }, filterTypes },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    usePagination
  );


  // Render the UI for your table
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
          {groupComponent === 'componentlph' ? (
            <Table.Header style={{ backgroundColor: "gainsboro", position: "sticky", top: "0", zIndex: "1" }}>
              <Table.Row>
                   {lphcolumns.map((header, index) => (
                  <Table.HeaderCell
                    key={index}
                    colSpan={header.subHeaders ? header.subHeaders.length : 1}
                    rowSpan={header.subHeaders ? 1 : 2}
                    style={{ fontSize: "10px", textAlign: "center", border: "0.5px solid black" }}>
                    {header.Header}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
              {lphcolumns.map((header) => header.subHeaders) && (
                <Table.Row >
                  {lphcolumns.map((header) =>
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

            )}



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
