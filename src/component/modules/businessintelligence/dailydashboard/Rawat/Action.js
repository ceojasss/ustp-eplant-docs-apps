import eplant from "../../../../../apis/eplant";
import {
  FETCH_BI_4,
  FETCH_CHART_RAWAT_3,
  SET_LOADING_STATUS,
} from "../../../../../redux/actions/types";
import format from 'dateformat'

const ROUTES = "/bi/dailydashboard/rawat";

export const fetchData = (site, p_date) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?site=${site}&p_date=${format(p_date, 'dd/mm/yyyy')}`);

  //console.log("done fetch queryrawat3");

  //console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BI_4, payload: response.data.data });
};
