import React from "react";
import { Table, Header } from "semantic-ui-react";
import _ from "lodash";
import { NumberFormat } from "../Constants";
import LoadingStatus from "./LoadingStatus";

const TableChart = ({ data, title }) => {
  // console.log(data["data"]);
  if (_.isEmpty(data) || _.isUndefined(data)) return <LoadingStatus />;

  return (
    <>
      <Header>
        <Header.Content>{title}</Header.Content>
      </Header>
      <Table
        celled
        compact={"very"}
        size={"small"}
        singleLine
        stackable
        striped
      >
        <Table.Header>
          <Table.Row>
            {_.filter(
              _.filter(data["component"], (o) => {
                return !_.isNull(o.prompt_ina);
              }),
              { groupcomponent: "component" }
            ).map((x, y) => {
              //// console.log(x)
              return (
                <Table.HeaderCell>
                  {x.prompt_ina.toUpperCase()}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {data["data"].map((x, y) => (
              <>
                <Table.Cell width={1}>{x.description}</Table.Cell>
                <Table.Cell width={1}>{x.oer_hi}</Table.Cell>
                <Table.Cell width={1}>{x.oer_bi}</Table.Cell>
                <Table.Cell width={1}>{x.oer_sbi}</Table.Cell>
              </>
            ))}
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default TableChart;
