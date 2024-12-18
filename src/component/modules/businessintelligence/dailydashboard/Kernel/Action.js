import eplant from "../../../../../apis/eplant";
import {
  FETCH_BI_11,
  FETCH_CHART_8,
  FETCH_CHART_9,
  SET_LOADING_STATUS,
} from "../../../../../redux/actions/types";
import format from 'dateformat'

const ROUTES = "/bi/dailydashboard/kernel";

export const fetchData = (site, p_date) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?site=${site}&p_date=${format(p_date, 'dd/mm/yyyy')}`);
  //console.log("done fetch query9");

  // console.log(response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BI_11, payload: response.data });
};
