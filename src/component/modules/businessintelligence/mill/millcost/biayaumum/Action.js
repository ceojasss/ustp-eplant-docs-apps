import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {
  FETCH_BIAYAUMUM,
  FETCH_BIAYAUMUMDETAIL,
  RESET_BI_DATA,
  SET_LOADING_STATUS,
} from "../../../../../../redux/actions/types";

const ROUTESHEADER = "/bi/mill/biayaumum";

const ROUTESHEADERDETAIL = "/bi/mill/biayaumumdetail";

export const fetchDataHeader = (p_year, p_site) => async (dispatch) => {
  dispatch({ type: RESET_BI_DATA });
  const response = await eplant.get(
    `${ROUTESHEADER}?p_year=${p_year}&p_site=${p_site}`
  );
  console.log("HEADER", response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BIAYAUMUM, payload: response.data });
};

export const fetchDataDetail = (p_year, p_site) => async (dispatch) => {
  dispatch({ type: RESET_BI_DATA });
  const response = await eplant.get(
    `${ROUTESHEADERDETAIL}?p_year=${p_year}&p_site=${p_site}`
  );
  // console.log("Detail", response.data);
  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // console.log("DETAIL", response.data);
  dispatch({ type: FETCH_BIAYAUMUMDETAIL, payload: response.data });
};
