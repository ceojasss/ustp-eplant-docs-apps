import React, { useEffect } from "react";
import _ from 'lodash'
import { connect, useDispatch } from 'react-redux'
import dateFormat, { masks } from "dateformat";
import { useNavigate } from 'react-router-dom'
import { Header, Label } from "semantic-ui-react";

// *library imports placed above ↑
// *local imports placed below ↓
import { createData } from "./FormAction";
import { DialogConfirmation } from '../../../../redux/actions'
import Form from "./Form_RHF";
import { DATEFORMAT, INDEXDATATRANSAKSI, MONTHFORMAT, PREFIX_NEW } from "../../../Constants";
import { SAVE } from "../../../../redux/actions/types";
import { getFormTitle, InitDefaultValues } from "../../../../utils/FormComponentsHelpler";
import LoadingStatus from "../../../templates/LoadingStatus";

const FormCreate = ({ units, trx }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    let titles
    // console.log(units)
    useEffect(() => {

        if (_.isNil(trx)){
            navigate('../')
        }InitDefaultValues();
    }, [trx, navigate])

    if (!_.isNil(trx)) {
        titles = getFormTitle(PREFIX_NEW)
        if(_.isUndefined(units))
        return (<LoadingStatus/>)
    }
    return (<Form
        title={titles}
        defaultValues={units}
    />)
}
const mapStateToProps = (state) => {
    //console.log(state.auth)
    return {
        units: state.auth.transactionInfo,
        trx: Object.values(state)[INDEXDATATRANSAKSI]
    }

}

export default connect(mapStateToProps, { createData })(FormCreate)
