import eplant from "../../../../../apis/eplant";
import {
  FETCH_BI_8,
  FETCH_CHART_6,
  SET_LOADING_STATUS,
} from "../../../../../redux/actions/types";
import format from 'dateformat'

const ROUTES = "/bi/dailydashboard/oer";

export const fetchData = (site, p_date) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?site=${site}&p_date=${format(p_date, 'dd/mm/yyyy')}`);

  //console.log("done fetch query6");

  //console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BI_8, payload: response.data.data });
};