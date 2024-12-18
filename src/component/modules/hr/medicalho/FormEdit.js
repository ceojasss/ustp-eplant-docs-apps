import React, { useEffect } from "react";
import { connect, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import _ from 'lodash'

// *library imports placed above ↑
// *local imports placed below ↓

import { setEditData } from '../../../../redux/actions'
import Form from "./Form_RHF";
import { INDEXDATATRANSAKSI, PREFIX_EDIT } from "../../../Constants";
import { getFormTitle, InitDefaultValues } from "../../../../utils/FormComponentsHelpler";
import LoadingStatus from "../../../templates/LoadingStatus";
import SetupVehicleMasterForm from "./Form_RHF";
import { DOCUMENT_TITLE } from "../../../../redux/actions/types";



const FormEdit = ({ trx, data }) => {
    let navigate = useNavigate()
    let titles

    const { id } = useParams();
    const dispatch = useDispatch()

    useEffect(() => {
        if (_.isUndefined(trx)) {
            navigate('../')
        }
        let docTitle = getFormTitle('Document No : ') + id

        dispatch({ type: DOCUMENT_TITLE, payload: docTitle })

        return () => (dispatch(setEditData(null)))
    }, [id])


    if (trx)
        titles = getFormTitle(PREFIX_EDIT)


    console.log('trx', trx, data)

    if (_.isEmpty(data))
        return (
            <LoadingStatus />)

    return (<SetupVehicleMasterForm
        initialValues={data}
        title={titles} />
    )
}

const mapStateToProps = (state) => {
    return {
        trx: Object.values(state)[INDEXDATATRANSAKSI],
        data: state.auth.datatoedit
    }
}

export default connect(mapStateToProps)(FormEdit)
