import React from "react";
import { Table, Header } from "semantic-ui-react";
import _ from "lodash";
import { connect } from "react-redux";

const TableMillLpb = ({ siteSelect, data, datacell, title }) => {
  const headers = [
    { dataIndex: "NO" },
    { dataIndex: "INDICATORNAME" },
    { dataIndex: "YEAR" },
    { dataIndex: "ANNUAL" },
    { dataIndex: "JANUARI" },
    { dataIndex: "FEBRUARI" },
    { dataIndex: "MARET" },
    { dataIndex: "APRIL" },
    { dataIndex: "MEI" },
    { dataIndex: "JUNI" },
    { dataIndex: "JULI" },
    { dataIndex: "AGUSTUS" },
    { dataIndex: "SEPTEMBER" },
    { dataIndex: "OKTOBER" },
    { dataIndex: "NOVEMBER" },
    { dataIndex: "DESEMBER" },
  ];

  console.log(data);
  return (
    <>
      <Header>
        <Header.Content>{title}</Header.Content>
      </Header>
      <Table
         celled
         compact={"very"}
         size={"Large"}
         singleLine
         stackable
         striped
         style={{ border: "1px solid gainsboro" }}
      >
        <Table.Header>
          <Table.Row>
            {headers.map((header) => (
              <Table.HeaderCell style={{ backgroundColor: '#009ef7', color: 'white',border:"0.5px solid black" }} key={header.dataIndex} textAlign="center">
              {header.dataIndex}
            </Table.HeaderCell>
            
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((data, index) => {
            const values = headers.map((th) => data[th.dataIndex]);
            return (
              <Table.Row key={`row-${index}`}>
                {values.map((v, i) => (
                  <Table.Cell style={{border:"1px solid black"}} key={`cell-${index}-${i}`} width={1}>
                    {v}
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
  return {
    siteSelect: state.auth.siteSelect,
  };
};

export default connect(mapStateToProps)(TableMillLpb);

