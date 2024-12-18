import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import { createData } from "./FormAction";
import { DialogConfirmation, setEditData } from "../../../../redux/actions";
import SetupBankForm from "./Form_RHF";
import { INDEXDATATRANSAKSI } from "../../../Constants";
import { UPDATE } from "../../../../redux/actions/types";
import { getEditableData } from "../../../../utils/FormComponentsHelpler";
import LoadingStatus from "../../../templates/LoadingStatus";

const SetupBankEdit = ({ trx, data }) => {
  let navigate = useNavigate();
  let titles;

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('masuk')
    if (_.isUndefined(trx)) {
      navigate("../");
    }

    return () => {
      dispatch(setEditData(null));
    };
  }, [id]);

  if (trx)
    titles = _.find(trx.data.component, { itemname: "TITLE" })["prompt_ina"];

  if (_.isEmpty(data)) return <LoadingStatus />;

  return (
    <SetupBankForm
      //   formSubmit={onSubmit}
      initialValues={data}
      title={`${titles} - Edit`}
    />
  );
};

const mapStateToProps = (state) => {
  console.log(state.auth.datatoedit);
  return {
    trx: Object.values(state)[INDEXDATATRANSAKSI],
    data: state.auth.datatoedit,
  };
};

export default connect(mapStateToProps, { createData })(SetupBankEdit);
