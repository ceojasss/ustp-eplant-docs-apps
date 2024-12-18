import eplant from "../../../../../apis/eplant";
import {
  FETCH_BI,
  FETCH_BI_2,
  FETCH_CHART_10,
  FETCH_CHART_2,
  RESET_BI_DATA,
  SET_LOADING_STATUS,
} from "../../../../../redux/actions/types";
import format from 'dateformat'
const ROUTES = "/bi/dailydashboard/bgt";

export const fetchData = (site, p_date) => async (dispatch) => {
  dispatch({ type: RESET_BI_DATA })
  const response = await eplant.get(`${ROUTES}?site=${site}&p_date=${format(p_date, 'dd/mm/yyyy')}`);

  //console.log("done fetch query2");

  //console.log(response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BI_2, payload: response.data });
};
