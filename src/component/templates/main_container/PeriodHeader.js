import React from "react"
import ReactDatePicker from "react-datepicker"
import { connect } from "react-redux"

import InputMask from "react-input-mask";
import { Form, Grid, Input, Label } from "semantic-ui-react"
import { MONTHFORMAT } from "../../Constants"


const PeriodHeader = ({ periodaction, dateperiode }) => {

    if (!periodaction)
        return null

    return (<Grid.Column as={Form} floated='right' /*style={{ width: '2vw', marginLeft: '-30vw' }}*/ >
        <Input size='mini' >
            <Label size="tiny"  /*corner='left'*/ pointing='right' color="teal" icon='calendar alternate outline' style={{ paddingTop: '1em', paddingLeft: '1.3em' }} />
            <ReactDatePicker
                dateFormat={MONTHFORMAT}
                portalId="root-portal"
                showMonthYearPicker
                // showMonthDropdown
                // className={className}
                placeholderText="MM/YYYY"
                //name={name}
                value={dateperiode}
                // popperProps={{strategy: 'fixed'}} 
                onChange={async (e) => {
                    periodaction.onchange(e)
                }}
                onSelect={e => {
                    periodaction.onchange(e)
                }}
                selected={periodaction.value ? periodaction.value : null}
                customInput={
                    <InputMask mask="99/9999" style={{ textAlign: 'center', width: '9vw' }} />
                }
            />
        </Input>
    </Grid.Column>)
}

const mapStateToProps = (state) => {
    return {
        dateperiode: state.auth.tableDynamicControl.dateperiode
    }
}

export default connect(mapStateToProps)(PeriodHeader)