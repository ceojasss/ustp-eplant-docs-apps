import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_UMUR, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/umur";

export const fetchData = (p_date,p_site) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_date=${p_date}&p_site=${p_site}`);

  // console.log("done fetch lph");

  // console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_UMUR, payload: response.data.data });
}
