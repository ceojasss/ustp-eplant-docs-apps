// 
import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {FETCH_TABLEGRAD,RESET_BI_DATA ,FETCH_LISTMILL,SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/tabgrading";

export const fetchData = (p_date,p_site) => async (dispatch) => {

  dispatch({type:RESET_BI_DATA})

  const response = await eplant.get(`${ROUTES}?p_date=${p_date}&p_site=${p_site}`);

  // console.log("1.done fetch Fetch LPB");
  // console.log("RESPONSE",response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_LISTMILL, payload: response.data});
}