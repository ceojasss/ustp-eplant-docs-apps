import eplant from "../../../../apis/eplant";
import {

  FETCH_ERROR,
  FETCH_LISTDATA,
  FETCH_LISTDATADETAIL,
  RESET_DETAIL_DATA,
  UPDATE_NAV,
} from "../../../../redux/actions/types";
import _ from "lodash";
import format from "dateformat";

const ROUTES = '/fixedasset/Trx/faclearingaddition'
export const fetchDataheader =
  (pageIndex, pageSize, search, date, callback) => async (dispatch) => {
    dispatch({ type: RESET_DETAIL_DATA });

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/faclearingaddition?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)

    try {
      const response = await eplant.get(
        `${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(
          date,
          "mm/yyyy"
        )}`
      );

      console.log("done fetch faclearingaddition", response);


      dispatch(
        { type: FETCH_LISTDATA, payload: response.data }
        // { type: UPDATE_NAV, payload: response.data }
      );

    } catch (error) {
      let err = error.response.data

      console.log(`error`, err);


      dispatch({ type: FETCH_ERROR, payload: error.response })
    }

    // if (callback) callback()
  };
export const fetchDatadetail = (params) => async (dispatch) => {
  console.log("run fetch faclearingadditiondetail");

  const response = await eplant.get(`${ROUTES}/detail?fixedassetcode=${params[0]}&period=${format(
    params[1],
    "mm/yyyy"
  )}`);
  console.log(response)

  console.log("done fetch faclearingadditiondetail");

  dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data });
  // if (callback) callback()
};
