import React from "react"
import _ from 'lodash'
import { Form, Grid, Input, Label } from "semantic-ui-react"
import ReactDatePicker from "react-datepicker"

import InputMask from "react-input-mask";
import { connect } from "react-redux"

import { DATEFORMAT } from "../../Constants"
import 'react-datepicker/dist/react-datepicker.css'
import { getFormComponent, getFormListComponent } from "../../../utils/FormComponentsHelpler";

const PeriodHeader = ({ periodaction, dateperiode }) => {

    if (!periodaction)
        return null

    return (<Grid.Column as={Form} floated='right' /*style={{ width: '2vw', marginLeft: '-30vw' }}*/ >
        <Input size='mini' >
            <Label size="medium"  /*corner='left'*/ pointing='right'
                color="teal"
                icon='calendar alternate outline'
                style={{ paddingTop: '1.0em', paddingLeft: '1.3em' }} />
            <ReactDatePicker
                dateFormat={DATEFORMAT}
                portalId="root-portal"
                // showMonthYearPicker
                //             showMonthDropdown
                //showYearDropdown
                // className={className}
                placeholderText="DD/MM/YYYY"
                //name={name}
                value={dateperiode}
                maxDate={new Date()}
                // popperProps={{strategy: 'fixed'}} 
                onChange={async (e) => {
                    // // console.log(field)
                    periodaction.onchange(e)
                }}
                onSelect={e => {
                    periodaction.onchange(e)
                }}
                selected={periodaction.value ? periodaction.value : null}
                customInput={
                    <InputMask mask="99/99/9999" style={{ textAlign: 'center', width: '9vw' }} />
                }
            />
        </Input>
    </Grid.Column>)
}

const mapStateToProps = (state) => {
    return {
        dateperiode: !_.isNil(getFormListComponent()) ? _.size(getFormListComponent()) > 0 ? _.get(getFormListComponent()[0], 'caltype') == 'true' ? state.auth.tableDynamicControl.dateperiodenow : state.auth.tableDynamicControl.dateperiode : _.get(getFormComponent()[0], 'caltype') : null
    }
}

export default connect(mapStateToProps)(PeriodHeader)