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



const SetupBankEdit = ({ trx, data }) => {
    let navigate = useNavigate()
    let titles

    const { id } = useParams();
    const dispatch = useDispatch()

    useEffect(() => {

        if (_.isUndefined(trx)) {
            navigate('../')
        }
        InitDefaultValues();
        return () => (dispatch(setEditData(null)))

    }, [id])


    if (trx)
        titles = getFormTitle(PREFIX_EDIT)


    if (_.isEmpty(data))
        return (
            <LoadingStatus />)

    console.log(data)

    return (<Form
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

export default connect(mapStateToProps)(SetupBankEdit)
