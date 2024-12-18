import eplant from "../../../../../apis/eplant";
import {
FETCH_LISTMILL,RESET_BI_DATA,
  SET_LOADING_STATUS,
} from "../../../../../redux/actions/types";

const ROUTES = "/bi/mill/rph";

export const fetchData = (p_year, p_month) => async (dispatch) => {

  dispatch({ type:RESET_BI_DATA})

  const response = await eplant.get(`${ROUTES}?p_year=${p_year}&p_month=${p_month}`);

  // console.log("done fetch rph");

  // console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_LISTMILL, payload: response.data });
};
