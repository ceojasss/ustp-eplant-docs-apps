import React, { useEffect } from "react";
import { connect, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import _ from 'lodash'

// library imports placed above ↑
//local imports placed below ↓
import Form from "./Form_RHF";
import { INDEXDATATRANSAKSI, PREFIX_NEW } from "../../../Constants";
import {
  getFormTitle,
  InitDefaultValues,
} from "../../../../utils/FormComponentsHelpler";
import LoadingStatus from "../../../templates/LoadingStatus";

const FormCreate = ({ trx, defaultValue }) => {

  const navigate = useNavigate();
  let titles;

  useEffect(() => {
    if (_.isNil(trx)) {
      navigate('../');
    }

    InitDefaultValues();
  }, [trx, navigate]);

  if (trx)
        titles = getFormTitle(PREFIX_NEW)

  if (_.isEmpty(defaultValue)) 
     return ( <LoadingStatus /> )

  return (<Form title={titles} initialValues={defaultValue} />)
};
const mapStateToProps = (state) => {
  return {
    defaultValue: state.auth.formDefaultValue,
    trx: Object.values(state)[INDEXDATATRANSAKSI],
  };
};

export default connect(mapStateToProps)(FormCreate);
