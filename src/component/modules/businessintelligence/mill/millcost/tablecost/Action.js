import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_TABLECOST,RESET_BI_DATA,SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/cost";

export const fetchData = (p_year,p_site) => async (dispatch) => {
  dispatch({type:RESET_BI_DATA})
  const response = await eplant.get(`${ROUTES}?p_year=${p_year}&p_site=${p_site}`);

  // console.log("done fetch lph");

  // console.log("Action Cost",response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_TABLECOST, payload: response.data});
}
