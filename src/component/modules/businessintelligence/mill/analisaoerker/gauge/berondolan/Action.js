import eplant from "../../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_GAUGE1, SET_LOADING_STATUS} from "../../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/gaugetrash";

export const fetchData = (p_date,p_site) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_date=${p_date}&p_site=${p_site}`);

  // console.log("done fetch lph");

  // console.log("AnaOerKer/berondolan:",response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_GAUGE1, payload: response.data.data });
}
