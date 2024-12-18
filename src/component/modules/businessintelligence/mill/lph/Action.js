import eplant from "../../../../../apis/eplant";
import {FETCH_LISTMILL,RESET_BI_DATA, SET_LOADING_STATUS } from "../../../../../redux/actions/types";

const ROUTES = "/bi/mill/lph";

export const fetchData = (p_date) => async (dispatch) => {
  dispatch({ type: RESET_BI_DATA })

  const response = await eplant.get(`${ROUTES}?p_date=${p_date}`);

  console.log("4.Response LPH",response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_LISTMILL, payload:response.data});
};
