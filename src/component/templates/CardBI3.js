import React from "react";
import { Card, Grid, Header } from "semantic-ui-react";
import _ from "lodash";
import { NumberFormat } from "../Constants";

const CardChart3 = ({ data, title }) => {


  // if (_.isEmpty(data) || _.isUndefined(data)) return <LoadingStatus />;

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
              {!_.isUndefined(data["component"]) || _.isNull(data["component"]) ? _.filter(
                _.filter(data["component"], (o) => {
                  return !_.isNull(o.tablecomponent);
                }),
                { groupcomponent: "cardfour" }
              ).map((x, y) => {
                //// console.log(x)
                return (
                  <Card.Header
                    style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "5px" }}
                  >
                    {(x.prompt_ina).toUpperCase()}
                  </Card.Header>
                );
              }) : "-"}
            </Card.Content>
          </Grid.Column>
          <Grid.Column>
            {_.isNull(data["data"][0]) || _.isUndefined(data["data"][0]) ? "Data Kosong" : Object.entries(data["data"][0]).map(([x, y]) => {
              return (
                <Card.Content>
                  <Card.Meta style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "5px" }}>
                    {NumberFormat(parseFloat(y).toFixed(0))}
                  </Card.Meta>
                </Card.Content>
              );
            })}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card>
  );
};

export default CardChart3;
