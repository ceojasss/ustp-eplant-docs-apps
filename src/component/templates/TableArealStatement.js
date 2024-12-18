import React from "react";
import { Table, Header } from "semantic-ui-react";
import _ from "lodash";

const TableArealStatement = ({ data, columns, title, year, plantingyear, area, gcm, smg, sbe, slm }) => {

  const tableHeaders = [
    { dataIndex: 'YEAR' },
    { dataIndex: 'PLANTINGYEAR' },
    { dataIndex: 'AREA' },
    { dataIndex: 'GCM' },
    { dataIndex: 'SMG' },
    { dataIndex: 'SBE' },
    { dataIndex: 'SLM' },
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

export default TableArealStatement;

