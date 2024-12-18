import React from "react";
import { Card, Grid, Header } from "semantic-ui-react";
import _ from "lodash";
import LoadingStatus from "./LoadingStatus";
import { NumberFormat } from "../Constants";

const CardChart = ({ data, title }) => {
  //if (_.isEmpty(data) || _.isUndefined(data)) return <LoadingStatus />;

  return (
    <Card>
      {/* <Header as='h2' size="medium" textAlign="center">
          <Header.Content>{title}</Header.Content>
        </Header> */}
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
      {_.isUndefined(data)
        ? "Data Kosong"
        : data.map((data, i) => {
            return (
              <Card.Content key={i}>
                <Grid columns={2}>
                  <Grid.Column>
                  <Card.Header key={i}>{data["DESCRIPTION"]}</Card.Header>
                  </Grid.Column>
                  <Grid.Column>
                  <Card.Meta key={i} textAlign="right" style={{ fontSize: "30px" }}>
                  {NumberFormat(parseFloat(data["VALUE"]).toFixed(2))}
                </Card.Meta>
                  </Grid.Column>
                </Grid>
              </Card.Content>
            );
          })}
    </Card>
  );
};

export default CardChart;
