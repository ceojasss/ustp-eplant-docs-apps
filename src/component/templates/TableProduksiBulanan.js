import React, { useState } from "react";
import { Table, Header, Grid } from "semantic-ui-react";
import _ from "lodash";
import { AgChartsReact } from 'ag-charts-react';
import { getData } from '../templates/data'

const TableProduksiBulanan = ({ data, title}) => {

  const tableHeaders = [
    { dataIndex: 'URUT' },
    { dataIndex: 'DESCR' },
    { dataIndex: 'BLN01' },
    { dataIndex: 'BLN02' },
    { dataIndex: 'BLN03' },
    { dataIndex: 'BLN04' },
    { dataIndex: 'BLN05' },
    { dataIndex: 'BLN06' },
    { dataIndex: 'BLN07' },
    { dataIndex: 'BLN08' },
    { dataIndex: 'BLN09' },
    { dataIndex: 'BLN10' },
    { dataIndex: 'BLN11' },
    { dataIndex: 'BLN12' },
    { dataIndex: 'TOTAL' },
  ];



  return (
    <>
    <Grid>
      <Grid.Row>
        <Grid.Column>
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
        </Grid.Column>
      </Grid.Row>
    </Grid>
    </>
  );
};

export default TableProduksiBulanan;

