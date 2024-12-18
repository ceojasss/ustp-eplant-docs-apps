import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_THISMONTH,RESET_BI_DATA, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/thismonth";

export const fetchData = (p_month, p_year) => async (dispatch) => {
  dispatch({type:RESET_BI_DATA})
  const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}`);

  // console.log("1.done fetch Fetch LPB");

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_THISMONTH, payload: response.data });
}