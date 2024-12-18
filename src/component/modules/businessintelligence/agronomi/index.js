import 'leaflet/dist/leaflet.css'
import ContentHeader from "../../../templates/ContentHeader";
import _ from "lodash";
import TableAreaStatement from "./Produksi/ArealStatement/Lists"
import TableProduksiHarian from "./Produksi/ProduksiHarian/Lists"
import TableProduksiBulanan from "./Produksi/ProduksiBulanan/Lists"
import TableProduksiBulananDetail from "./Produksi/ProduksiBulananDetail/Lists"
import { getFormComponent, InitValidation, useYupValidationResolver } from "../../../../utils/FormComponentsHelpler";
import { Form as FormUI } from 'semantic-ui-react'
import { useNavigate, useLocation } from "react-router-dom";
import "../../../Public/CSS/Agro.css";
import { useForm, FormProvider } from "react-hook-form";
import TableYieldByAge from "./Produksi/Yieldbyage/Lists"
import TableYieldPotensi from "./Produksi/Yieldpotensi/Lists"
import TableActBudget from "./Produksi/ActBudget/Lists"
import TableActPot from "./Produksi/ActPot/Lists"
import ReactDatePicker from "react-datepicker";
import { Grid, Select, Tab, Segment } from "semantic-ui-react";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import LoadingStatus from "../../../templates/LoadingStatus";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ComponentAdaptersGroup from "../../../templates/forms/ComponentAdaptersGroup";
import moment from 'moment-timezone';




const Agronomi = ({ formComps }) => {
  // let site = 'SMG'
  // let p_date = '11-04-2018'
  // const navigate = useNavigate()

  // useEffect(() => {
  //   if (_.isEmpty(formComps))
  //     console.log('form component',formComps)
  //       navigate('../')

  //   /** initialized default validation schema form */
  // }, [navigate])


  const plasmaOptions = [
    { value: "INTI", text: "INTI" },
    { value: "PLASMA", text: "PLASMA" },
    { value: "INTIPLASMA", text: "INTIPLASMA" }
  ]

  // const plasma = plasmaOptions[0].value
  // console.log('plasma',plasma)

  const siteOptions = [
    { value: "USTP", text: "USTP" },
    { value: "SLM", text: "SLM" },
    { value: "SJE", text: "SJE" },
    { value: "SMG", text: "SMG" },
    { value: "GCM", text: "GCM" },
    { value: "SBE", text: "SBE" },


  ]

  // const site = siteOptions[0].value
  // console.log('site',site)

  const estateOptions = [
    { value: "KBN1", text: "KBN1" },
    { value: "KBN2", text: "KBN2" },
    { value: "KBN3", text: "KBN3" },
    { value: "KBN4", text: "KBN4" },
    { value: "KBN5", text: "KBN5" },
    { value: "ALL", text: "ALL" }
  ]


  const afdelingOptions = [
    { value: "ALL", text: "ALL" },
    { value: "AFD-XII", text: "AFD-XII" },
    { value: "AFD-XIII", text: "AFD-XIII" },
    { value: "AFD-XIV", text: "AFD-XIV" },
    { value: "AFD-XIX", text: "AFD-XIX" },
    { value: "AFD-XV", text: "AFD-XV" },
    { value: "AFD-XVI", text: "AFD-XVI" },
    { value: "AFD-XVII", text: "AFD-XVII" },
    { value: "AFD-XVIII", text: "AFD-XVIII" },
    { value: "AFD-I", text: "AFD-I" },
  ]




  // date / year
  // const dateDefault = new Date()

  // date h-1
  const [date, setDate] = useState(moment().subtract(1, 'days').toDate());


  const handleDateChange = (date) => {
    setDate(date)
    console.log('cek tanggal', date)
  }

  // date / month

  const monthDefault = new Date()
  const [month, setMonth] = useState(monthDefault);

  const handleMonthChange = (month) => {
    setMonth(month)
    console.log('cek bulan', month)
  }

  // site
  const [site, setSite] = useState(siteOptions[0].value)
  const handleSiteChange = (e, site) => {
    setSite(site.value)
    // console.log('site.value : ',site.value)

   
  }

  

  // plant
  const plantDefault = new Date()
  const [plant, setPlant] = useState(plantDefault);

  const handlePlantChange = (plant) => {
    setPlant(plant)
    console.log('cek plant', plant)
  }

  // estate / estate
  const [estate, setestate] = useState(estateOptions["0"].value)
  const handleestateChange = (e, estate) => {
    setestate(estate.value)
    console.log(estate.value)
  }

  // afdeling / division
  const [afdeling, setAfdeling] = useState(afdelingOptions["9"].value)
  const handleAfdelingChange = (e, afdeling) => {
    setAfdeling(afdeling.value)
    console.log(afdeling.value)
  }

  // plasma / inti / intiplasma
  const [plasma, setPlasma] = useState(plasmaOptions[0].value)
  const handlePlasmaChange = (e, plasma) => {
    setPlasma(plasma.value)
    console.log(plasma.value)
  }


  const panes = [
    {
      menuItem: 'Produksi',
      render: () => (
        <Tab.Pane>
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: 'Areal Statement', render: () =>
                (
                  <Grid divided='vertically' >
                    <Grid.Row columns={2}  >
                      <Grid.Column>
                      <div className="date-picker-container">
                        <label>Tahun :  </label>
                        <ReactDatePicker 
                          className="ui input date-picker"
                          selected={date} 
                          dateFormat="yyyy" 
                          onChange={handleDateChange}
                          showYearPicker 
                        />
                      </div>
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Plasma : </label>
                        <Select 
                           className="ui input select-plasma"
                           placeholder={plasma}
                           options={plasmaOptions} 
                           onChange={handlePlasmaChange} 
                           onSelect={handlePlasmaChange}
                           defaultValue={{value:plasma , label:plasma}} 
                           selected={plasma}
                        />

                      </Grid.Column>
                     </Grid.Row>
                    <div className='table-data'>
                      <TableAreaStatement 
                        p_intiplasma={plasma} 
                        p_year={format(date, "yyyy")} 
                      />
                    </div>

                  </Grid>

                )
              },

              {
                menuItem: 'Produksi Harian', render: () =>
                (
                  <Grid divided='vertically' >
                    <Grid.Row columns={2}  >
                      <Grid.Column>
                        <label>Tanggal : </label>         
                          <ReactDatePicker 
                            className="ui input date-picker"
                            selected={date} 
                            dateFormat="dd/MM/yyyy" 
                            onChange={handleDateChange}
                          />
                      </Grid.Column>
                    </Grid.Row>
                   
                   <div className="table-data">
                    <TableProduksiHarian 
                      p_date={format(date, "dd-MM-yyyy")} 
                    />
                   </div>

                  </Grid>

                )
              },
              {
                menuItem: 'Produksi Bulanan', render: () =>
                (
                  <Grid divided='vertically' columns={2}>
                    {/* <Grid divided='vertically' columns={2}> */}
                    <Grid.Row >
                      <Grid.Column>
                        <label>Tahun : </label>
                        <ReactDatePicker 
                          className="ui input date-picker"
                          showYearPicker 
                          selected={date} 
                          dateFormat="yyyy" 
                          onChange={handleDateChange}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Site :</label>
                        <Select 
                          className="ui input select-site"
                          placeholder={ site }
                          options={siteOptions}
                          defaultValue={{value:site , label:site}} 
                          onChange={handleSiteChange} 
                          onSelect={handleSiteChange}
                          // selected={site}
                          selected={site}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Tahun Plant : </label>
                        <ReactDatePicker 
                          className="ui input date-picker"
                          showYearPicker 
                          selected={plant} 
                          dateFormat="yyyy" 
                          onChange={handlePlantChange} 
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Estate : </label>
                        <Select 
                          className="ui input select-estate"
                          placeholder={estate}
                          options={estateOptions} 
                          onChange={handleestateChange} 
                          onSelect={handleestateChange}
                          defaultValue={{value:estate , label:estate}} 
                          selected={estate}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Afdeling : </label>
                        <Select 
                          className="ui input select-afdeling"
                          placeholder={afdeling}
                          options={afdelingOptions} 
                          onChange={handleAfdelingChange} 
                          onSelect={handleAfdelingChange}
                          defaultValue={{value:afdeling , label:afdeling}} 
                          selected={afdeling}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Plasma : </label>
                        <Select 
                           className="ui input select-plasma"
                           placeholder={plasma}
                           options={plasmaOptions} 
                           onChange={handlePlasmaChange} 
                           onSelect={handlePlasmaChange}
                           defaultValue={{value:plasma , label:plasma}} 
                           selected={plasma}
                        />
                      </Grid.Column>
                      {/* <Grid.Column >
                    <TableProduksiBulanan  p_year={format(date, "yyyy")} p_site={site}  
                    p_plant={format(plant, "yyyy")} p_estate={estate} p_division={afdeling} p_intiplasma={plasma}  /> 
                  </Grid.Column> */}
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column >
                        <div className="table-data">
                          <TableProduksiBulanan 
                            className="table-data"
                            p_year={format(date, "yyyy")} 
                            p_site={site}
                            p_plant={format(plant, "yyyy")} 
                            p_estate={estate} p_division={afdeling} 
                            p_intiplasma={plasma} 
                          />
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                )
              },
              {
                menuItem: 'Produk Bulanan Detail', render: () =>
                (
                  <Grid divided='vertically' >
                    <Grid.Row columns={2}  >
                      <Grid.Column>
                        <label>Tahun : </label>
                        <ReactDatePicker 
                          className="ui input date-picker"
                          selected={date} 
                          dateFormat="yyyy" 
                          onChange={handleDateChange}
                          showYearPicker 
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Tahun Plant : </label>
                        <ReactDatePicker 
                          className="ui input date-picker"
                          showYearPicker 
                          selected={plant} 
                          dateFormat="yyyy" 
                          onChange={handlePlantChange} 
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Plasma : </label>
                        <Select 
                           className="ui input select-plasma"
                           placeholder={plasma}
                           options={plasmaOptions} 
                           onChange={handlePlasmaChange} 
                           onSelect={handlePlasmaChange}
                           defaultValue={{value:plasma , label:plasma}} 
                           selected={plasma}
                        />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column style={{ marginLeft: '20px' }}>
                      <div className="table-data">
                        <TableProduksiBulananDetail 
                          p_intiplasma={plasma} 
                          p_year={format(date, "yyyy")} 
                          p_plant={format(plant, "yyyy")} 
                        />
                      </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                )
              },
              {
                menuItem: 'Yield By Age', render: () =>
                (
                  <Grid divided='vertically' >
                    <Grid.Row columns={2}  >
                      <Grid.Column>
                        <label> Pilih Site :</label>
                        <Select 
                          className="ui input select-site"
                          placeholder={site}
                          options={siteOptions} 
                          onChange={handleSiteChange} 
                          defaultValue={{value:site , label:site}} 
                          onSelect={handleSiteChange}
                          selected={site}

                          // className="ui dropdown select-site"
                          // placeholder="Select Site"
                          // options={siteOptions}
                          // onChange={handleSiteChange}

                     
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Plasma : </label>
                        <Select 
                          className="ui input select-plasma"
                          placeholder={plasma}
                          options={plasmaOptions} 
                          onChange={handlePlasmaChange} 
                          onSelect={handlePlasmaChange}
                          defaultValue={{value:plasma , label:plasma}} 
                          selected={plasma}

                          // className="ui dropdown select-plasma"
                          // placeholder="Select plasma"
                          // options={plasmaOptions}
                          // onChange={handlePlasmaChange}

                        />
                      </Grid.Column>
                      {/* <Grid.Column>
                    <TableYieldByAge p_site={site} p_intiplasma={plasma}  />
                  </Grid.Column> */}
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <div className="table-data">
                          <TableYieldByAge 
                            p_site={site} 
                            p_intiplasma={plasma} 
                          />
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                )
              },
              {
                menuItem: 'Yield vs Potensi', render: () =>
                (
                  <Grid divided='vertically' >
                    <Grid.Row columns={2}  >
                      <Grid.Column>
                        <label>Periode :  </label>
                        <ReactDatePicker
                          className="ui input date-picker"
                          selected={date}
                          dateFormat="M/yyyy"
                          onChange={handleDateChange}
                          showMonthYearPicker
                          showFullMonthYearPicker
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Pilih Plasma : </label>
                        <Select 
                          className="ui input select-plasma"
                          placeholder={plasma}
                          options={plasmaOptions} 
                          onChange={handlePlasmaChange} 
                          onSelect={handlePlasmaChange}
                          defaultValue={{value:plasma , label:plasma}} 
                          selected={plasma}
                        />
                      </Grid.Column>
                      {/* <Grid.Column>
                    <TableYieldPotensi p_month={format(date, "M")} p_year={format(date, "yyyy")}  p_intiplasma={plasma}  />
                  </Grid.Column> */}
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <div className="table-data">
                          <TableYieldPotensi 
                            p_month={format(date, "M")} 
                            p_year={format(date, "yyyy")} 
                            p_intiplasma={plasma} 
                          />
                        </div>
                      </Grid.Column>
                      
                    </Grid.Row>
                  </Grid>

                )
              },
              {
                menuItem: 'Act vs Budget', render: () =>
                (
                  <Grid divided='vertically' >
                    <Grid.Row columns={3}>
                        <Grid.Column>
                          <label>Periode :  </label>
                          
                          <ReactDatePicker
                            className="ui input date-picker"  
                            selected={date}
                            dateFormat="M/yyyy"
                            onChange={handleDateChange}
                            showMonthYearPicker
                            showFullMonthYearPicker
                          />
                          
                        </Grid.Column>
                        <Grid.Column>
                          <label>Pilih Plasma : </label>
                            <Select 
                              className="ui input select-plasma"
                              placeholder={plasma}
                              options={plasmaOptions} 
                              onChange={handlePlasmaChange} 
                              onSelect={handlePlasmaChange}
                              defaultValue={{value:plasma , label:plasma}} 
                              selected={plasma}
                            />
                        </Grid.Column>
                        <Grid.Column>
                          <label>Pilih Site :</label>
                          <Select 
                            className="ui input select-site"
                            placeholder={site}
                            options={siteOptions} 
                            onChange={handleSiteChange} 
                            defaultValue={{value:site , label:site}} 
                            onSelect={handleSiteChange}
                            selected={site}
                          />

                            
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <div className="table-data">
                          <TableActBudget 
                            p_month={format(date, "M")} 
                            p_year={format(date, "yyyy")} 
                            p_site={site} 
                            p_intiplasma={plasma} />
                          </div>
                        </Grid.Column>
                      </Grid.Row>
                  </Grid>


                )
              },
              {
                menuItem: 'Act vs Pot', render: () =>
                (
                  <Grid divided='vertically' >
                    <Grid.Row columns={3}>
                        <Grid.Column>
                          <label>Periode :  </label>
                          <ReactDatePicker
                            className="ui input date-picker" 
                            selected={date}
                            dateFormat="M/yyyy"
                            onChange={handleDateChange}
                            showMonthYearPicker
                            showFullMonthYearPicker
                          />
                        </Grid.Column>
                        <Grid.Column>
                          <label> Pilih Plasma : </label>
                            <Select 
                               className="ui input select-plasma"
                               placeholder={plasma}
                               options={plasmaOptions} 
                               onChange={handlePlasmaChange} 
                               onSelect={handlePlasmaChange}
                               defaultValue={{value:plasma , label:plasma}} 
                               selected={plasma}
                            />
                        </Grid.Column>
                        <Grid.Column>
                        <label>Pilih Site :</label>
                          <Select 
                            className="ui input select-site"
                            placeholder={site}
                            options={siteOptions} 
                            onChange={handleSiteChange} 
                            defaultValue={{value:site , label:site}} 
                            onSelect={handleSiteChange}
                            selected={site}
                          />
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <div className="table-data">
                          <TableActPot 
                            p_month={format(date, "M")} 
                            p_year={format(date, "yyyy")} 
                            p_site={site} 
                            p_intiplasma={plasma} 
                          />
                          </div>
                        </Grid.Column>
                      </Grid.Row>
                  </Grid>



                  //   <Grid divided='vertically' >
                  //   <Grid.Row columns={3}  >
                  //   <div >
                  //     <Grid.Column>
                  //       <label>Periode :  </label>
                  //       <ReactDatePicker 
                  //         selected={date} 
                  //         dateFormat="M/yyyy" 
                  //         onChange={handleDateChange} 
                  //       showMonthYearPicker
                  //       showFullMonthYearPicker 
                  //       />
                  //     </Grid.Column>
                  //    </div>
                  //     <Grid.Column>
                  //     <div >
                  //       <label> Plasma : </label>
                  //       <Select placeholder="Select Plasma" options={plasmaOptions} onChange={handlePlasmaChange} />
                  //     </div>
                  //     </Grid.Column>
                  //     <Grid.Column>
                  //       <div>
                  //         <label>Pilih Site :</label>
                  //         <Select placeholder="Select Site" options={siteOptions} onChange={handleSiteChange} />
                  //       </div>
                  //     </Grid.Column>
                  //     <Grid.Column >
                  //       <TableActBudget  p_month={format(date, "M")} p_year={format(date, "yyyy")} p_site={site} p_intiplasma={plasma}  /> 
                  //     </Grid.Column>

                  //   </Grid.Row>
                  //   {/* <Grid.Row>
                  //     <Grid.Column >
                  //       <TableActBudget  p_month={format(date, "M")} p_year={format(date, "yyyy")} p_site={site} p_intiplasma={plasma}  /> 
                  //     </Grid.Column>
                  //   </Grid.Row> */}
                  // </Grid>

                )
              },
      

            ]}
          />
        </Tab.Pane>
      )
    },
    { menuItem: 'Panen', render: () => <Tab.Pane>Panen</Tab.Pane> },
    { menuItem: 'Rawat / Pupuk', render: () => <Tab.Pane>Rawat</Tab.Pane> },
    { menuItem: 'Biaya', render: () => <Tab.Pane>Biaya</Tab.Pane> },
  ]




  const RenderForm = React.memo(() => {
    if (!formComps)
      return <LoadingStatus />

    return (
      <Segment raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px" }}>
        <FormUI as={'form'}>
          <FormProvider >
            <ComponentAdaptersGroup
              key="0.componentgroup"
              components={_.groupBy(formComps, 'grouprowsseq')}
            />
          </FormProvider>
        </FormUI>
      </Segment>
    )
  })


  return (
    <>
      <ContentHeader
        children={<RenderForm />}
      >
        <Tab.Pane style={{ overflow: 'scroll', overflowY: "scroll" ,overflowX:'hidden'}}>
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </Tab.Pane>
      </ContentHeader>
    </>
  );
};


const mapStateToProps = (state) => {
  return {
    siteSelect: state.auth.siteSelect,
    formComps: getFormComponent()
  }
}
export default connect(mapStateToProps)(Agronomi);


