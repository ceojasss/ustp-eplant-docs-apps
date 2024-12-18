
import React, { useEffect } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

// *library imports placed above ↑
// *local imports placed below ↓
import Form from "./Form_RHF";
import { INDEXDATATRANSAKSI, PREFIX_EDIT } from "../../../Constants";
import { getFormTitle } from "../../../../utils/FormComponentsHelpler";
import LoadingStatus from "../../../templates/LoadingStatus";

const FormEdit = ({ data, units, trx }) => {
    let navigate = useNavigate()

    const { id } = useParams();

    useEffect(() => {

        if (_.isUndefined(trx)) {
            navigate('../')
        }

        //   return () => (dispatch(setEditData(null)))

    }, [id])


    if (_.isEmpty(data))
        return (
            <LoadingStatus />)


    return (<Form
        initialValues={data}
        defaultValues={units}
        title={getFormTitle(PREFIX_EDIT)}
    />
    )
}

const mapStateToProps = (state) => {
    return {
        units: state.auth.selectedValue,
        trx: Object.values(state)[INDEXDATATRANSAKSI],
        data: state.auth.datatoedit,
    }
}


export default connect(mapStateToProps)(FormEdit)
