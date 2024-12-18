import React, { useEffect } from "react";
import _ from 'lodash'
import { connect, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

// *library imports placed above ↑
// *local imports placed below ↓
import { setEditData } from '../../../../redux/actions'
import Form from "./Form_RHF";
import { INDEXDATATRANSAKSI, PREFIX_EDIT } from "../../../Constants";
import { DOCUMENT_TITLE } from "../../../../redux/actions/types";
import { getFormTitle } from "../../../../utils/FormComponentsHelpler";
import LoadingStatus from "../../../templates/LoadingStatus";

const FormEdit = ({ data, units, trx }) => {
    let navigate = useNavigate()
    let titles

    const { id } = useParams();
    const dispatch = useDispatch()

    //    // console.log('helo')


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


    if (_.isEmpty(data))
        return (
            <LoadingStatus />)

    //// console.log(data)

    //return (<LoadingStatus />)
    return (<Form
        initialValues={data}
        defaultValues={units}
        title={titles} />
    )
}

const mapStateToProps = (state) => {
    return {
        units: state.auth.selectedValue,
        trx: Object.values(state)[INDEXDATATRANSAKSI],
        data: state.auth.datatoedit,
        periode: state.auth.tableDynamicControl.dateperiode,
    }
}


export default connect(mapStateToProps)(FormEdit)
