import React, { useEffect, useState } from "react";
import { useTable, usePagination, useFilters, useGlobalFilter, useAsyncDebounce, useRowSelect } from 'react-table'
import { Button, Table, Input, Select, Container, Divider, Label, Grid, Form } from "semantic-ui-react"
import { matchSorter } from "match-sorter";
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓
import { LovSelected, setActionModals } from "../../redux/actions";
import { Appresources } from "./ApplicationResources";
import { setLoadingModalBtn, setModalStates } from "../../redux/actions";
import ReactDatePicker from "react-datepicker";
import { DATEFORMAT } from "../Constants";
import ReactInputMask from "react-input-mask";
import format from 'dateformat'
import { process_initvh } from "../modules/vehicle/vehicleavailability/FormAction";




const RenderList = ({ columns, data }) => {
    const dispatch = useDispatch()

    const [startDate, setStartDate] = useState(null);

    useEffect(() => {

    }, [startDate])
    return (
        <>

            <Grid>
                <Grid.Column as={Form} >
                    <Container style={{ /*overflowY: 'scroll', display: 'block', paddingLeft: '10px', height: '35vh', width: '100vw',*/ paddingBottom: '5px' }}>
                        {/* <ReactDatePicker
                        dateFormat={DATEFORMAT}
                        portalId="root-portal"
                        placeholderText="DD/MM/YYYY"
                        // isClearable={canEdit == 'false' || canEdit == false || readonly === 'true' ? false : true}
                        // disabled={(!undiscomponent || !canEdit || readonly === 'true') && true}
                        // openToDate={(_.isUndefined(field.value) ? (_.isEmpty(startperiode) ? Date.now() : startperiode) : field.value)}
                        adjustDateOnChange
                        // selected={(_.isUndefined(field.value) ? (default_value === 'sysdate' ? sysdate : null) : field.value)}
                        onChange={async (props) => {
                            //setValue(name, props)
                            //  // // // console.log(props)
                            // field.onChange(props)
                            // checkDependencies()
                        }}
                        onKeyDown={
                            (e) => {
                                //     // // // // console.log('down', e)
                                //  setValue(name, new date())
                                if (!isNaN(parseToDate(e.target.value))) {
                                    setValue(name, parseToDate(e.target.value))
                                }
                            }
                        }

                        customInput={<InputMask mask="99/99/9999" style={{ textAlign: 'center' }} />}
                    /> */}
                        <Label pointing='below' prompt content={'Pilih Tanggal'} />
                        <ReactDatePicker
                            dateFormat={DATEFORMAT}
                            // portalId="root-portal"
                            style={{ textAlign: 'center' }}
                            placeholderText="DD/MM/YYYY"
                            selected={startDate}
                            adjustDateOnChange
                            onChange={(date) =>
                                setStartDate(date)
                                // // console.log(date)
                            }
                            customInput={<ReactInputMask mask="99/99/9999" style={{ textAlign: 'center' }} />}
                        />

                        {/*   <pre>Daftar vehicle
                    <code>
                        {JSON.stringify(
                            {
                                selectedRowIds: selectedRowIds,
                                'selectedFlatRows[].original': selectedFlatRows.map(
                                    d => d.original
                                ),
                            },
                            null,
                            2
                        )}
                    </code>
                </pre> */}
                    </Container>
                </Grid.Column>
            </Grid>
            {/* 
    Pagination can be built however you'd like. 
    This is just a very basic UI implementation:
  */}
            <Container textAlign="center">

                <Button
                    floated="left"
                    icon='cancel'
                    labelposition="left"
                    negative
                    onClick={() => dispatch(setModalStates(Appresources.BUTTON_LABEL.LABEL_CANCEL))}
                    content={Appresources.BUTTON_LABEL.LABEL_CANCEL}
                />

                <Button
                    size="medium"
                    floated="right"
                    icon='pencil'
                    labelposition="right"
                    positive
                    content={Appresources.BUTTON_LABEL.LABEL_LANJUT_TRX}
                    onClick={() => {
                        let value
                        //  if (_.isNull(startDate)){
                        //     value = null
                        //  } else {
                        // const value= format(startDate, 'dd-mm-yyyy')
                        value = _.replace(new Date(startDate).toLocaleDateString('en-GB'), new RegExp("/", "g"), "-")
                        //  }
                        // const a = format(startDate, 'dd-mm-yyyy')
                        // const a = startDate

                        // // console.log([a],startDate)
                        // // console.log(typeof startDate)
                        dispatch(process_initvh({ tdate: value }))
                        setTimeout(() => {
                            dispatch(setActionModals(Appresources.BUTTON_LABEL.LABEL_LANJUT_TRX, [value]))
                        }, 1000);
                        // setStartDate(value)
                    }}
                    disabled={_.isNull(startDate) ? true : false}
                />
            </Container>
        </>
    )
}


export default connect(null, LovSelected)(RenderList)