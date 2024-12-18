import React from "react";
import { Card, Grid, Header } from "semantic-ui-react";
import _ from "lodash";
import LoadingStatus from "./LoadingStatus";
import { NumberFormat } from "../Constants";

const CardChart2 = ({ data, title }) => {
  // const tableHeaders = [
  //   { dataIndex: "TERSEDIA" },
  //   { dataIndex: "OPS" },
  //   { dataIndex: "STB" },
  //   { dataIndex: "BRK" },
  // ];

  // // console.log(_.mapKeys(tableHeaders))

  // return (
  //   <Card>
  //     <label style={{textAlign: "center", fontSize: "20px", backgroundColor: "skyblue", paddingBottom: "3px", paddingTop: "3px"}}>{title}</label>
  //     <Grid columns={2}>
  //       <Grid.Row>
  //         <Grid.Column>
  //         <Card.Content>
  //           {tableHeaders.map((header,i) => (
  //               <Card.Header key={i} style={{textAlign: "center",  fontWeight: 'bold'}}>{header.dataIndex}</Card.Header>
  //           ))}
  //         </Card.Content>
  //         </Grid.Column>
  //         <Grid.Column>
  //         {data.map((data,i) => {
  //           const values = tableHeaders.map((th) => data[th.dataIndex]);
  //           return (
  //             <Card.Content key={i}>
  //               {values.map((v,i) => (
  //                 <Card.Meta key={i} style={{textAlign: "center"}}>{v}</Card.Meta>
  //               ))}
  //             </Card.Content>
  //           );
  //         })}
  //         </Grid.Column>
  //       </Grid.Row>
  //     </Grid>
  //   </Card>
  // );

  if (_.isEmpty(data) || _.isUndefined(data)) return <LoadingStatus />;

  return (
    <Card>
      <label
        style={{
          textAlign: "center",
          fontSize: "20px",
          backgroundColor: "skyblue",
          paddingBottom: "3px",
          paddingTop: "3px",
        }}
      >
        {title}
      </label>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Card.Content>
              {_.filter(
                _.filter(data["component"], (o) => {
                  return !_.isNull(o.prompt_ina);
                }),
                { groupcomponent: "cardthree" }
              ).map((x, y) => {
                //// console.log(x)
                return (
                  <Card.Header
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {x.prompt_ina.toUpperCase()}
                  </Card.Header>
                );
              })}
            </Card.Content>
          </Grid.Column>
          <Grid.Column>
            <Card.Content>
              {Object.entries(data["data"][0]).map(([x, y]) => {
                return (
                  <Card.Meta style={{ textAlign: "center" }}>
                    {NumberFormat(parseFloat(y).toFixed(2))}
                  </Card.Meta>
                );
              })}
            </Card.Content>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card>
  );
};

export default CardChart2;
