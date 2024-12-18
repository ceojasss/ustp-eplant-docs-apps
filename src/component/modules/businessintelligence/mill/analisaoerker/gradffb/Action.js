import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_GRADFFB, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/gradffb";

export const fetchData = (p_date,p_site) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_date=${p_date}&p_site=${p_site}`);

  // console.log("done fetch lph");

  // console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: true });
  dispatch({ type: FETCH_GRADFFB, payload: response.data.data });
}
