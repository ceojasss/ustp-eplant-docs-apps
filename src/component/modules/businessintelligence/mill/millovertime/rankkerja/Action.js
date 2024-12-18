import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_GRADFFB, FETCH_RANKKERJA, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/rankkerja";

export const fetchData = (p_month,p_year,p_site) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}&p_site=${p_site}`);

  // console.log("done fetch lph");

  // console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_RANKKERJA, payload: response.data.data });
}
