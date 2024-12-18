import React from "react";
import { Card, Statistic, Header, Grid } from "semantic-ui-react";
import _ from "lodash";
import LoadingStatus from "./LoadingStatus";
import { NumberFormat } from "../Constants";

const StatsChart = ({ data, title }) => {


  // if (_.isEmpty(data) || _.isUndefined(data)) return <LoadingStatus />;

  // console.log('statschart',data)
  return (
    <>
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
        <Card.Content textAlign="center">
          <Header as="h1">
            <Header.Content>
              <Header.Subheader>
                <Statistic.Group size="mini" color="blue" widths={2}>
                  <Grid columns={2} divided>
                    <Grid.Row>
                      <Grid.Column>
                        <Statistic>
                          {!_.isUndefined(data["component"]) || _.isNull(data["component"]) ? _.filter(
                            _.filter(data["component"], (o) => {
                              return !_.isNull(o.tablecomponent);
                            }),
                            { groupcomponent: "cardone" }
                          ).map((x, y) => {
                            //// console.log(x)
                            return (
                              <Statistic.Label style={{ paddingBottom: "7px", textAlign: "left" }}>
                                {x.prompt_ina}
                              </Statistic.Label>
                            );
                          }) : "-"}
                        </Statistic>
                      </Grid.Column>
                      <Grid.Column>
                        <Statistic size="mini">
                          {Object.entries(data["data"][0]).map(([x, y]) => {
                            return (
                              <Statistic.Value style={{ textAlign: "right", paddingBottom: "5px" }}>
                                {NumberFormat(parseFloat(y).toFixed(0))}
                              </Statistic.Value>
                            );
                          })}
                        </Statistic>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Statistic.Group>
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Card.Content>
      </Card>
    </>
  );
};

export default StatsChart;
