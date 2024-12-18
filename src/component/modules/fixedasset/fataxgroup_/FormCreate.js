import React, { useEffect } from "react";
import _ from 'lodash'
import { connect, useDispatch } from 'react-redux'
import { createData } from "./FormAction";
import { DialogConfirmation } from '../../../../redux/actions'
import { useNavigate } from 'react-router-dom'
import SetupBankForm from "./Form_RHF";

import { INDEXDATATRANSAKSI } from "../../../Constants";
import { SAVE } from "../../../../redux/actions/types";

const FormCreate = ({ trx }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    let titles

    useEffect(() => {

        if (_.isNil(trx)) {
            navigate('../')
        }

    }, [trx, navigate])

    if (!_.isNil(trx))
        titles = _.find(trx.data.component, { 'itemname': 'TITLE' })['prompt_ina']


    const onSubmit = (data) => {

        //        console.log('submit data', new Date().format(DATEFORMAT).toString(data['dateregistered']))
        //  dispatch(DialogConfirmation(SAVE))

    }


    return (<SetupBankForm
        //    formSubmit={onSubmit}
        title={`${titles} - New`}
    />)
}


const mapStateToProps = (state) => {
    return {
        trx: Object.values(state)[INDEXDATATRANSAKSI]
    }
}

export default connect(mapStateToProps, { createData })(FormCreate)
