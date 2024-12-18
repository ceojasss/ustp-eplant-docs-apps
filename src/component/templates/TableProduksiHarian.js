import React from "react";
import { Table } from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";

function formatNumber(number) {
  return new Intl.NumberFormat('id-ID',{maximumFractionDigits:1}).format(number);
}

const TableMillLph = ({ siteSelect, data, datacell, title }) => {

console.log('data : ', data);

  const headers = [
    {
      name: "INTI",
      color: "#009ef7",
      subHeaders: [
        { dataIndex: "GCM" },
        { dataIndex: "SMG" },
        { dataIndex: "SJE" },
        { dataIndex: "SBE" },
        { dataIndex: "SLM" },
        { dataIndex: "Total" },
      ],
    },
    {
      name: "PLASMA",
      color: "#009ef7",
      subHeaders: [
        { dataIndex: "GCM" },
        { dataIndex: "SMG" },
        { dataIndex: "SJE" },
        { dataIndex: "SBE" },
        { dataIndex: "SLM" },
        { dataIndex: "Total" },
      ],
    },
    // {
    //   name: "TOTAL HARIAN",
    //   color: "#009ef7",
    //   subHeaders: [
    //     { dataIndex: "GCM" },
    //     { dataIndex: "SMG" },
    //     { dataIndex: "SJE" },
    //     { dataIndex: "SBE" },
    //     { dataIndex: "SLM" },
    //     { dataIndex: "Total" },
    //   ],
    // }
  ];

  return (
    <>
      <Table
        celled
        compact={"very"}
        size={"Large"}
        singleLine
        stackable
        striped
        style={{ border: "1px solid gainsboro",width: "40%"  }}>
        <Table.Header>
          <Table.Row>
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
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.isUndefined(data)
            ? `Data Kosong`
            : data.map((data) => {
                const values = headers.flatMap((header) =>
                  header.subHeaders.map((th) => data[th.dataIndex])
                );
                return (
                  <Table.Row>
                    {values.map((v, i) => (
                      <Table.Cell
                        textAlign={typeof v === "number" ? "right" : "left"}
                        style={{ border: "1px solid black" }}
                        width={1}
                        key={i}
                      >
                         {isNaN(parseFloat(v)) || typeof v === "string"
                          ? v
                          : i >= 1
                          ? formatNumber(parseFloat(v))
                          : v}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
        </Table.Body>
      </Table>
    </>
  );
};
const mapStateToProps = (state) => {
  console.log('state produksi harian :', state.auth.siteSelect);
  return {
    siteSelect: state.auth.siteSelect,
  };
};

export default connect(mapStateToProps)(TableMillLph);
