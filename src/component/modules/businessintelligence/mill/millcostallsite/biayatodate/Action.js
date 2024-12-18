import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import { FETCH_BIAYATODATE, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/biayayeartodate";

export const fetchData = (p_period, p_year) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_period=${p_period}&p_year=${p_year}`);

  // console.log("1.done fetch Fetch LPB");

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BIAYATODATE, payload: response.data });
}