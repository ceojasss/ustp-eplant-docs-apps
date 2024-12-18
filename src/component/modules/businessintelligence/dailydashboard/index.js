import Chart from "chart.js/auto";
import ContentHeader from "../../../templates/ContentHeader";
//import _ from "lodash";
import StatsChart from "./Prod/index";
import StatsChart2 from "./Bgt/index";
import ChartLine from "./ActBgt/index";
import CardPanen from "./Panen/index";
import CardRawat from "./Rawat/index";
import CardAlatBerat from "./AlatBerat/index";
import CardDumpTruck from "./DumpTruck/index";
import CardRotasiPanen from "./RotasiPanen/index";
import ChartLineOER from "./Oer/index";
import ChartLineKER from "./Ker/index";
import TableChart from "./CPO/index";
import TableChartKER from "./Kernel/index";
import { Grid, GridColumn, Segment, Select } from "semantic-ui-react";
import { connect } from "react-redux";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import SitePicker from "../../../templates/main_container/SitePicker";
import BIDatePicker from "../../../templates/main_container/BIDatePicker";
import dateFormat from "dateformat";
import {
  BIDatePickerHandler,
  BISitePickerHandler,
} from "../../../../utils/BIHelper";
import LoadingStatus from "../../../templates/LoadingStatus";
import _ from "lodash";

const Charts = ({ site, date }) => {

  if (_.isUndefined(site)) return <LoadingStatus />;
  return (
    <>
      <ContentHeader>
        <Segment>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column>
              <label style={{ fontSize: "17px" }}>Pilih Tanggal:</label>
                <BIDatePicker
                  pickedDateAction={BIDatePickerHandler( date )}
                />
              </Grid.Column>
              <Grid.Column>
              <label style={{ fontSize: "17px" }}>Pilih Site:</label>
                <SitePicker pickedSiteAction={BISitePickerHandler({ site })} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={5}>
            <Grid.Row>
              <Grid.Column>
                <StatsChart site={site} p_date={date} />
              </Grid.Column>
              <Grid.Column>
                <StatsChart2 site={site} p_date={date} />
              </Grid.Column>
              <Grid.Column>
                <CardAlatBerat site={site} p_date={date} />
                <CardDumpTruck site={site} p_date={date} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={5}>
            <Grid.Row>
              <Grid.Column>
                <CardPanen site={site} p_date={date} />
              </Grid.Column>
              <Grid.Column>
                <CardRawat site={site} p_date={date} />
              </Grid.Column>
              <Grid.Column>
                <CardRotasiPanen site={site} p_date={date} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column>
                <ChartLine site={site} p_date={date} />
              </Grid.Column>
              <Grid.Column>
                <ChartLineOER site={site} p_date={date} />
              </Grid.Column>
              <Grid.Column>
                <ChartLineKER site={site} p_date={date} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <TableChart site={site} p_date={date} />
              </Grid.Column>
              <Grid.Column>
                <TableChartKER site={site} p_date={date} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </ContentHeader>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    date: state.businessintelligence.pickedDate,
    site: state.businessintelligence.pickedSite,
  };
};

export default connect(mapStateToProps)(Charts);

