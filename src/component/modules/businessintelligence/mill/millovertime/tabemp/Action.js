import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_TABEMP, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/tabemp";

export const fetchData = ( p_month,p_year,p_site,p_group) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}&p_site=${p_site}&p_group=${p_group}`);

  // console.log("done fetch rph");

  // console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_TABEMP, payload: response.data.data});
};
