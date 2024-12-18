import React, { useEffect } from "react";
import _ from 'lodash'
import { connect, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// *library imports placed above ↑
// *local imports placed below ↓
import { createData } from "./FormAction";
import Forms from "./Form_RHF";
import { INDEXDATATRANSAKSI, PREFIX_NEW } from "../../../Constants";
import { getFormTitle, InitDefaultValues } from "../../../../utils/FormComponentsHelpler";
import LoadingStatus from "../../../templates/LoadingStatus";
import { RESET_QR_COMPONENT } from "../../../../redux/actions/types";

const FormCreate = ({ trx, defaultValue }) => {
    const navigate = useNavigate()
    let titles
    const dispatch = useDispatch()
    titles = getFormTitle(PREFIX_NEW)

    dispatch({type: RESET_QR_COMPONENT })
    useEffect(() => {

        if (_.isNil(trx))
            navigate('../')


        InitDefaultValues();

    }, [trx/* , navigate */])


    if (_.isEmpty(defaultValue))
        return (<LoadingStatus />)

    //  // console.log('create', titles)//, trx, navigate)

    return (<Forms
        title={titles}
        initialValues={defaultValue}
    />)
}


const mapStateToProps = (state) => {
    return {
        defaultValue: state.auth.formDefaultValue,
        trx: Object.values(state)[INDEXDATATRANSAKSI]
    }

}

export default connect(mapStateToProps, { createData })(FormCreate)
