import {FETCH_JAMTBS, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

import eplant from "../../../../../../apis/eplant";


const ROUTES = "/bi/mill/jamtbs";

export const fetchData = (p_date,p_site) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_date=${p_date}&p_site=${p_site}`);

  //console.log("done fetch query6");

  //console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_JAMTBS, payload: response.data.data });
};