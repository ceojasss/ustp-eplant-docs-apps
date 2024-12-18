import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { connect, useDispatch } from "react-redux";
import _ from "lodash";
import { useNavigate, useLocation } from "react-router-dom";
// *library imports placed above ↑
// *local imports placed below ↓

import requireAuth from "../../../auth/requireAuth";
import ContentHeader from "../../../templates/ContentHeader";
import store from "../../../../redux/reducers";
import RenderTable from "../../../templates/Table";
import LoadingStatus from "../../../templates/LoadingStatus";
import { INDEXDATATRANSAKSI } from "../../../Constants";
import {
  DATA_TO_EDIT,
  DELETE,
  DELETE_DATA,
  RESET_ERROR_MODAL_STATE,
  UPDATE,
} from "../../../../redux/actions/types";
import {
  DialogConfirmation,
  getLovData,
  setEditData,
} from "../../../../redux/actions";
import { Appresources } from "../../../templates/ApplicationResources";
import reducer from "./FormReducer";
import { fetchDatas, deleteData } from "./FormAction";
import "../../../Public/CSS/App.css";
import {
  ActionHelpers,
  getTitle,
  LovDataSelected,
  QueryData,
  QueryReducerID,
  QuerySelectedData,
} from "../../../../utils/FormComponentsHelpler";
import eplant from "../../../../apis/eplant";

const SetupBankList = ({
  data,
  crudActions,
  selectedData,
  reducerid,
  lovdata,
}) => {
  const loc = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prevLocation = "";

  const button = {
    btnLabel: "Tambah Data Baru",
    btnIcon: "pen square",
    addClickHandler: () => {
      navigate("./new");
    },
  };

  const openModal = () => {};

  const rowClickHandler = async (action, row) => {
    const inputsearchs = _.filter(data[1], (x) => {
      return x.itemtype.match(/^(inputsearch|inputdate|inputtime)$/);
    });
    const { original } = row;
    let rowdata = { ...original };

    console.log(original);

    const datakeys = Object.keys(rowdata).map(async (v) => {
      const arr = _.filter(inputsearchs, (x) => {
        return x.formcomponent.match(v);
      })[0];

      if (_.isUndefined(arr)) return;

      let value = _.get(rowdata, v);

      if (arr.itemtype.match(/^(inputdate|inputtime)$/) && !_.isEmpty(value)) {
        rowdata[v] = new Date(value);
      } else if (arr.itemtype.match(/^(inputsearch|inputlov)$/)) {
        const response = await eplant.get(`/lov/${arr.lovs}?0=${value}`);
        return { response: response, key: v };
      }
    });

    Promise.all(datakeys).then((responses) => {
      _.reject(responses, _.isUndefined).map(
        ({ response, key }) =>
          (rowdata[key] = (!response.data.rows[0], "", response.data.rows[0]))
      );

      dispatch(setEditData(rowdata));
    });

    let message = `Kode Bank : ${original.taxgroup} Akan Dihapus`;

    dispatch({ type: RESET_ERROR_MODAL_STATE });

    switch (action) {
      case UPDATE:
        navigate(`./edit/${row.id}`);
        break;
      case DELETE:
        dispatch(DialogConfirmation(DELETE, message, row));
        break;
      default:
        break;
    }
  };

  // console.log('location bank', loc.pathname.replaceAll('/', ''), identifier)

  useEffect(() => {
    console.log("change reducers");
    store.injectReducer(loc.pathname.replaceAll("/", ""), reducer);
    console.log("added setup bank reducer", store.getState());

    dispatch(fetchDatas());

    return () => {
      dispatch({ type: RESET_ERROR_MODAL_STATE });
    };
  }, [dispatch]);

  //    console.log(data)

  if (_.isEmpty(data) || loc.pathname.replaceAll("/", "") != reducerid)
    return <LoadingStatus />;

  const column = _.filter(data[1], (o) => {
    return !_.isNull(o.tablecomponent);
  });

  // !handling actions state
  if (crudActions) {
    //  console.log('data selected', crudActions)

    switch (crudActions) {
      case Appresources.BUTTON_LABEL.LABEL_DELETE:
        dispatch(
          deleteData(selectedData, (v) => {
            console.log(selectedData.rowid, v);
            if (v === Appresources.TRANSACTION_ALERT.DELETE_SUCCESS)
              dispatch({
                type: DELETE_DATA,
                payload: { rowid: selectedData.rowid },
              });
          })
        );
        break;

      default:
    }
  }

  return (
    <ContentHeader
      title={getTitle(data)} // (_.isNil(data[1]) ? '' : _.find(data[1], { 'itemname': 'TITLE' })['prompt_ina'])}
      btn1={button}
      parentFunction={openModal}
    >
      <RenderTable
        as={Grid.Column}
        columns={column}
        data={data[0]}
        onRowClick={rowClickHandler}
      />
    </ContentHeader>
  );
};

const MapStateToProps = (state) => {
  return {
    crudActions: ActionHelpers(state),
    selectedData: QuerySelectedData(state),
    data: QueryData(state),
    reducerid: QueryReducerID(state),
    lovdata: LovDataSelected(state),
  };
};

export default requireAuth(
  connect(MapStateToProps, { fetchDatas })(SetupBankList)
);
