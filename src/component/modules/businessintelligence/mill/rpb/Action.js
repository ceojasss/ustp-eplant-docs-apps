import eplant from "../../../../../apis/eplant";
import {
FETCH_LISTMILL,RESET_BI_DATA,
  SET_LOADING_STATUS,
} from "../../../../../redux/actions/types";

const ROUTES = "/bi/mill/rpb";

export const fetchData = (p_year) => async (dispatch) => {
  dispatch({type:RESET_BI_DATA})
  const response = await eplant.get(`${ROUTES}?p_year=${p_year}`);

  // console.log("done fetch rpb");

  // console.log(response.data.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_LISTMILL, payload: response.data });
};
