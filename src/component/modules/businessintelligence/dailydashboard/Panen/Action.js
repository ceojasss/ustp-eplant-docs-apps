import eplant from "../../../../../apis/eplant";
import {
  FETCH_BI_3,
  FETCH_CHART_PANEN_3,
  SET_LOADING_STATUS,
} from "../../../../../redux/actions/types";
import format from 'dateformat'
const ROUTES = "/bi/dailydashboard/panen";

export const fetchData = (site, p_date) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?site=${site}&p_date=${format(p_date, 'dd/mm/yyyy')}`);

  //console.log("done fetch querypanen3");
  // console.log('respon dd :',response.data)
  // console.log(response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BI_3, payload: response.data.data });
};
