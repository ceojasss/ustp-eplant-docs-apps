import TableMillLph from "./lph/List";
import TableMillLpb from "./lpb/List";
import TableMillRph from "./rph/List";
import TableMillRpb from "./rpb/List";
import TableMillGrad from "./analisaoerker/tablegrading/List";
import OerGauge from "./analisaoerker/oerkerffa/Oer/List";
import KerGauge from "./analisaoerker/oerkerffa/Ker/List";
import FfaGauge from "./analisaoerker/oerkerffa/Ffa/List";
import TrashGauge from "./analisaoerker/gauge/trash/List";
import BrondolanGauge from "./analisaoerker/gauge/berondolan/List";
import TpGauge from "./analisaoerker/gauge/tangkaipanjang/List";
import BmGauge from "./analisaoerker/gauge/buahmentah/List";
import TableMillTabKerja from "./millovertime/tabkerja/List";
import TableMillTabEmp from "./millovertime/tabemp/List";
import TableMillCost from "./millcost/tablecost/List";
import TableMillTbsOlah from "./millcost/tabletbsolah/List";
import TableMillCostTbsOlah from "./millcost/costtbsolah/List";
import TableMillPalmProd from "./millcost/palmprod/List";
import TableMillCostPalmProd from "./millcost/costpalmprod/List";
import TableMillMillCostThisMonth from "./millcostallsite/tablethismonth/List";
import TableMillOverTimeToDate from "./millcostallsite/tabletodate/List";
import TableMillOverBiayaMonth from "./millcostallsite/biayathismonth/List";
import TableMillOverTimeBiayaToDate from "./millcostallsite/biayatodate/List";
import ChartRankKerja from "./millovertime/rankkerja/List";
import ChartRankEmp from "./millovertime/rankemp/List";
import TableBiayaOlah from './millcost/biayapengolahan/List';
import TableBiayaRawat from './millcost/biayaperawatan/List';
import TableBiayaUmum from './millcost/biayaumum/List';
import ChartBar from "./analisaoerker/gradffb/List";
import BreedChart from "./analisaoerker/breeder/List";
import UmurChart from "./analisaoerker/umur/List";
import LineJamTbs from "./analisaoerker/jamtbs/List";
import "./mill.css";
import ContentHeader from "../../../templates/ContentHeader";
import { Grid, Select, Tab } from "semantic-ui-react";
import { useState } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { Bar } from "react-chartjs-2";


const List = ({ siteSelect, siteSelected }) => {

  const siteOptions = [
    { value: "GCM", text: "GCM" },
    { value: "USTP", text: "USTP" },
    { value: "SMG", text: "SMG" },
    { value: "SJE", text: "SJE" },
    { value: "SBE", text: "SBE" },
    { value: "SLM", text: "SLM" },
  ];

  const workOptions = [
    { value: "411", text: "Maintenance Senior Mandor Maintenance" },
    { value: "412", text: "Maintenance Mandor Maintenance" },
    { value: "413", text: "Maintenance Helper/Operator Maintenance" },
    { value: "421", text: "Proses Senior Mandor Proses" },
    { value: "422", text: "Proses Mandor Proses" },
    { value: "423", text: "Proses Helper/Operator Proses" },
    { value: "424", text: "Proses Analys Lab" },
    { value: "431", text: "Umum dan Administrasi Kerani Pabrik" },
    { value: "432", text: "Umum dan Administrasi General Service" },
    { value: "433", text: "Umum dan Administrasi Driver Kend. Opr/Umum" },
    { value: "434", text: "Umum dan Administrasi Driver/Helper DT" },
    { value: "435", text: "Umum dan Administrasi Security" },
    { value: "436", text: "Umum dan Administrasi_SHE / Sustainability" },
  ];

  const [work, setWork] = useState(workOptions["0"].value);

  const [site, setSite] = useState(siteOptions["0"].value);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSiteChange = (e, site) => {
    setSite(site.value);
    console.log(site.value);
  };
  const handleWorkChange = (e, work) => {
    setWork(work.value);
    console.log(work.value);
  };
  const dateDefault = new Date();


  const [date, setDate] = useState(dateDefault);

  const handleDateChange = (date) => {
    setDate(date);

  };

  const handleTabChange = (e, { activeIndex }) => {
    setActiveIndex(activeIndex);
  };


  
  

  const panes = [
    /*Laporan Produksi Harian */
    {
      menuItem: "Laporan Produksi Harian",
      render: () => (
        <Tab.Pane className="container"
        // style={{backgroundColor:'#A9A9A9'}}
        >
          <div className="date-picker-container">
            <label className="label">Tanggal:</label>
            <DatePicker className="ui input date-picker"
              selected={date}
              dateFormat="dd/MM/yyyy"
              onChange={handleDateChange}
            />
          </div>
          {/* <div className="table-container"> */}
            <TableMillLph p_date={format(date, "dd-MM-yyyy")} />
          {/* </div> */}
        </Tab.Pane>
      ),
    },
    //  /*Laporan Produksi Harian */
     /*Laporan Produksi Bulanan */
    {
      menuItem: "Laporan Produksi Bulanan",
      render: () => (
        <Tab.Pane className="container" style={{backgroundColor:'#A9A9A9'}}>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column>
                <label>Tahun:</label>
                <DatePicker
                  className="ui input date-picker"
                  selected={date}
                  dateFormat="yyyy"
                  showYearPicker
                  onChange={handleDateChange}
                />
              </Grid.Column>
              <Grid.Column>
                <label>Site:</label>
                <Select
                  className="ui dropdown select-site"
                  placeholder="Select Site"
                  options={siteOptions}
                  onChange={handleSiteChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <TableMillLpb p_site={site} p_year={format(date, "yyyy")} />
        </Tab.Pane>
      ),
    },
    /*Laporan Produksi Bulanan */
    /*Analisa Oer Ker */
    {
      menuItem: "Analisa OER/KER",
      render: () => (
        <Tab.Pane className="container" style={{backgroundColor:'#A9A9A9'}}>
          <Grid columns={5}>
            <Grid.Row>
              <Grid.Column>
                <label>Tanggal:</label>
                <DatePicker
                  className="ui input date-picker"
                  selected={date}
                  dateFormat="dd/MM/yyyy"
                  onChange={handleDateChange}
                />
              </Grid.Column>
              <Grid.Column>
                <label>Site:</label>
                <Select
                  className="ui dropdown select-site"
                  placeholder="Select Site"
                  options={siteOptions}
                  onChange={handleSiteChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div style={{ position:'relative', zIndex:'0',border: "2px solid black",overflow: "scroll", marginTop: "1rem", display: "flex", }}>
            <div id="GridMerah" style={{padding: "1rem",flex: "0 0 auto",minWidth: "120vh",textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{display:'flex',flexDirection:'row',padding:'1.5rem'}}>
                    <div id="GaugeOer" style={{ justifyContent: "center",flexDirection: "column",marginTop: "10px",padding:'3px', border:'1px solid black',borderRadius:'4px'}}>
                      <OerGauge p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                    </div>
                    <span style={{ marginRight: "25px" }}></span>
                    <div id="GaugeKer" style={{ justifyContent: "center",flexDirection: "column",marginTop: "10px",padding:'3px', border:'1px solid black',borderRadius:'4px'}}>
                      <KerGauge p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                    </div>
                    <span style={{ marginRight: "25px" }}></span>
                    <div id="GaugeFfa" style={{ justifyContent: "center",flexDirection: "column",marginTop: "10px",padding:'3px', border:'1px solid black',borderRadius:'4px'}}>
                      <FfaGauge p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                    </div>
                    <span style={{ marginRight: "25px" }}></span>                
                  </div>
                  {/* <div style={ {display:'flex',flexDirection:'row',padding:'1.5rem',}}>
                    <div id="TrashGauge" style={{ justifyContent: "center",flexDirection: "column",marginTop: "10px",padding:'3px', border:'1px solid black',borderRadius:'4px'}}>
                        <TrashGauge p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                    </div>
                    <span style={{ marginRight: "15px" }}></span>
                    <div id="GaugeBrondolan" style={{ justifyContent: "center",flexDirection: "column",marginTop: "10px",padding:'3px', border:'1px solid black',borderRadius:'4px'}}>
                      <BrondolanGauge p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                    </div>
                    <span style={{ marginRight: "15px" }}></span>
                    <div id="GaugeTangkaiPanjang" style={{ justifyContent: "center",flexDirection: "column",marginTop: "10px",padding:'3px', border:'1px solid black',borderRadius:'4px'}}>
                      <TpGauge p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                    </div>
                    <span style={{ marginRight: "15px" }}></span>
                    <div id="GaugeBuahMentah" style={{ justifyContent: "center",flexDirection: "column",marginTop: "10px",padding:'3px', border:'1px solid black',borderRadius:'4px'}}>
                      <BmGauge p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                    </div>
                  </div> */}
                  <div style={{display:'flex',flexDirection:'row',padding:'1.5rem'}}>
                  <div style={{marginTop: "4rem",display: "flex",justifyContent: "center",}} >
                      <LineJamTbs p_date={format(date, "dd-MM-yyyy")}p_site={site}/>
                    </div>
                  </div>
            </div>
            <div id="GridHijau" style={{ display: "flex", justifyContent: "center" }}>
              <div style={{borderRadius: "4px",marginTop: "2rem",padding: "1.0rem",
                  flex: "0 0 auto",minWidth: "50vh",display: "flex",flexDirection: "column",alignItems: "center",}}>
                <div
                  style={{border: "1.5px solid black",borderRadius: "4px",paddingTop: "1.6rem",overflow:'scroll', marginBottom: "3.5rem",justifyContent: "center",
                    display: "flex",width: "55vh",height: "50vh",}}>
                  <ChartBar p_date={format(date, "dd-MM-yyyy")} p_site={site} />
                </div>
                <div style={{display: "flex",marginTop:'1.1rem',
                    flexDirection: "column",  alignItems: "center", borderRadius: "4px",padding: "1rem",justifyContent: "center",
                    width: "70vh", height: "65vh",}}>
                  <TableMillGrad p_date={format(date, "dd-MM-yyyy")}p_site={site}/>
                </div>
              </div>
            </div>
            <div id="GridAbu" style={{borderRadius: "4px", marginTop: "1.5rem",margin: "1.5rem",
                marginRight: "1.5rem",padding: "1.5rem",  flex: "0 0 auto",  minWidth: "50vh",}}>
              <div  style={{border: "1.5px solid black", borderRadius: "4px",paddingTop: "1.5rem", marginBottom: "4.5rem",
                  justifyContent: "center",display: "flex", width: "45vh", height: "50vh",}}>
                <BreedChart p_date={format(date, "dd-MM-yyyy")} p_site={site} />
              </div>
              <div style={{border: "1.5px solid black",borderRadius: "4px",paddingTop: "1rem",marginTop: "3.5rem",justifyContent: "center",
                  display: "flex",width: "45vh",  height: "50vh", }}>
                <UmurChart p_date={format(date, "dd-MM-yyyy")} p_site={site} />
              </div>
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    /*Analisa Oer Ker */
    /*Rekapan Produksi Harian*/
    {
      menuItem: "Rekapan Produksi Harian",
      render: () => (
        <Tab.Pane className="container" style={{backgroundColor:'#A9A9A9'}}>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <label>Periode:</label>
                <DatePicker
                  className="ui input date-picker"
                  selected={date}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  showFullMonthYearPicker
                  onChange={handleDateChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <TableMillRph
            p_year={format(date, "yyyy")}
            p_month={format(date, "MM")}
          />
        </Tab.Pane>
      ),
    },
    /*Rekapan Produksi Harian*/
    /*Rekapan Produksi Bulanan*/
    {
      menuItem: "Rekapan Produksi Bulanan",
      render: () => (
        <Tab.Pane className="container" style={{backgroundColor:'#A9A9A9'}}>
          <Grid columns={5}>
            <Grid.Row>
              <Grid.Column>
                <label>Tahun:</label>
                <DatePicker
                  className="ui input date-picker"
                  selected={date}
                  dateFormat="yyyy"
                  showYearPicker
                  onChange={handleDateChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <TableMillRpb p_year={format(date, "yyyy")} />
        </Tab.Pane>
      ),
    },
    /*Rekapan Produksi Bulanan*/
    /*Mill Over Time*/
    {
      menuItem: "Mill Overtime",
      render: () => (
        <Tab.Pane className="container" style={{backgroundColor:'#A9A9A9'}}>
          <Grid columns={3}>
            <Grid.Row>
            <div className="date-picker-container" style={{marginLeft:'12px'}}>
            <label className="label">Period:</label>
            <DatePicker
                  className="ui input date-picker"
                  selected={date}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  showFullMonthYearPicker
                  onChange={handleDateChange}
                />
          </div>
              <Grid.Column>
                <label>Site:</label>
                <Select
                  className="ui dropdown select-site"
                  placeholder="Select Site"
                  options={siteOptions}
                  onChange={handleSiteChange}
                />
              </Grid.Column>
              <Grid.Column>
                <label>Pekerjaan:</label>
                <Select
                  className="ui dropdown select-site"
                  placeholder="Select Work"
                  options={workOptions}
                  onChange={handleWorkChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={2} stackable>
            <Grid.Column>
              <div
                style={{
                  border: "3px solid black",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  overflow: "auto",
                  padding: "1rem",
                  marginTop:'1rem',
                  zIndex:'0',
                  position:'relative'
                }}
              >
                <ChartRankKerja
                  p_month={format(date, "MM")}
                  p_year={format(date, "yyyy")}
                  p_site={site}
                />
              </div>
            </Grid.Column>
            <Grid.Column>
              <div>
                <TableMillTabKerja
                  p_month={format(date, "MM")}
                  p_year={format(date, "yyyy")}
                  p_site={site}
                />
              </div>
            </Grid.Column>
          </Grid>
          <Grid columns={2} stackable>
            <Grid.Column>
              <div
                style={{
                  border: "3px solid black",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  overflow: "auto",
                  padding: "1rem",
                  marginTop:'1rem',
                }}
              >
                <ChartRankEmp
                  p_month={format(date, "MM")}
                  p_year={format(date, "yyyy")}
                  p_site={site}
                  p_group={work}
                />
              </div>
            </Grid.Column>
            <Grid.Column>
              <div>
                <TableMillTabEmp
                  p_month={format(date, "MM")}
                  p_year={format(date, "yyyy")}
                  p_site={site}
                  p_group={work}
                />
              </div>
            </Grid.Column>
          </Grid>
        </Tab.Pane>
      ),
    },
    /*Mill OverTime*/
    /*Mill Cost*/
    {
      menuItem: "Mill Cost",
      render: () => (
        <Tab.Pane className="container" style={{backgroundColor:'#A9A9A9'}}>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column>
                <label>Year:</label>
                <DatePicker
                  className="ui input date-picker"
                  selected={date}
                  dateFormat="yyyy"
                  showYearPicker
                  onChange={handleDateChange}
                />
              </Grid.Column>
              <Grid.Column>
                <label>Site:</label>
                <Select
                  className="ui dropdown select-site"
                  placeholder="Select Site"
                  options={siteOptions}
                  onChange={handleSiteChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <TableMillCost p_site={site} p_year={format(date, "yyyy")} />
          <TableMillTbsOlah p_site={site} p_year={format(date, "yyyy")} />
          <TableMillCostTbsOlah p_site={site} p_year={format(date, "yyyy")} />
          <TableMillPalmProd p_site={site} p_year={format(date, "yyyy")} />
          <TableMillCostPalmProd p_site={site} p_year={format(date, "yyyy")} />
          <TableBiayaOlah p_site={site} p_year={format(date, "yyyy")} />
          <TableBiayaRawat p_site={site} p_year={format(date, "yyyy")} />
          <TableBiayaUmum p_site={site} p_year={format(date, "yyyy")} />
        </Tab.Pane>
      ),
    },
    /*Mill Cost*/
    /*Mill Cost All Site*/
    {
      menuItem: "Mill Cost All Site",
      render: () => (
        <Tab.Pane className="container" style={{backgroundColor:'#A9A9A9'}}>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column>
                <label>Period:</label>
                <DatePicker
                  className="ui input date-picker"
                  selected={date}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  showFullMonthYearPicker
                  onChange={handleDateChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <TableMillMillCostThisMonth
            p_month={format(date, "MM")}
            p_year={format(date, "yyyy")}
          />
          <TableMillOverTimeToDate
            p_month={format(date, "MM")}
            p_year={format(date, "yyyy")}
          />
          <TableMillOverBiayaMonth
            p_period={format(date, "MM")}
            p_year={format(date, "yyyy")}
          />
          <TableMillOverTimeBiayaToDate
            p_period={format(date, "MM")}
            p_year={format(date, "yyyy")}
          />
        </Tab.Pane>
      ),
    },
    /*Mill Cost All Site*/
  ];

  return (
    <ContentHeader >
      <Tab 
        style={{ marginTop:'-20px', overflowY: "scroll" ,overflowX:'hidden', 
        backgroundColor:'#A9A9A9'}}
        panes={panes}
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
      />
    </ContentHeader>
   
  );
};

const mapStateToProps = (state) => {
  return {
    siteSelect: state.auth.siteSelect,
  };
};
 
export default connect(mapStateToProps)(List);
