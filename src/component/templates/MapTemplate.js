import React from "react";
import { Table, Header } from "semantic-ui-react";
import _ from "lodash";

const TableMap = ({ data, datacell, title, description, oer_hi, oer_bi, oer_sbi }) => {

  const tableHeaders = [
    { dataIndex: 'DESCRIPTION' },
    { dataIndex: 'OER_HI' },
    { dataIndex: 'OER_BI' },
    { dataIndex: 'OER_SBI' },
  ];

  return (
    <>
    <Header>
        <Header.Content>{title}</Header.Content>
      </Header>
      <Table celled compact={"very"} size={"small"} singleLine stackable striped>
        <Table.Header>
          <Table.Row>
          {tableHeaders.map((header) => (
              <Table.HeaderCell>{header.dataIndex}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {data.map((data) => {
            const values = tableHeaders.map((th) => data[th.dataIndex]);
            return (
              <Table.Row>
                {values.map((v) => (
                  <Table.Cell width={1}>{v}</Table.Cell>
                ))}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};

export default TableMap;

