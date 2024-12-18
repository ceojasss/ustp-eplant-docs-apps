import React, { useEffect } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// *library imports placed above ↑
// *local imports placed below ↓

import Form from "./Form_RHF";
import { INDEXDATATRANSAKSI, PREFIX_NEW } from "../../../Constants";
import { getFormTitle } from "../../../../utils/FormComponentsHelpler";

const FormCreate = ({ trx }) => {
    const navigate = useNavigate()
    let titles

    useEffect(() => {

        if (_.isNil(trx)) {
            navigate('../')
        }

    }, [trx, navigate])

    if (!_.isNil(trx))
        titles = getFormTitle(PREFIX_NEW)

    return (<Form title={titles} />)
}


const mapStateToProps = (state) => {
    return {
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        trx: Object.values(state)[INDEXDATATRANSAKSI]
    }
}

export default connect(mapStateToProps)(FormCreate)
