import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import {
  FETCH_BIAYAOLAH,
  FETCH_BIAYAOLAHDETAIL,
  RESET_BI_DATA,
  SET_LOADING_STATUS,
} from "../../../../../../redux/actions/types";

const ROUTESHEADER = "/bi/mill/biayaolah";

const ROUTESHEADERDETAIL = "/bi/mill/biayaolahdetail";

export const fetchDataHeader = (p_year, p_site) => async (dispatch) => {
  dispatch({ type: RESET_BI_DATA });
  const response = await eplant.get(
    `${ROUTESHEADER}?p_year=${p_year}&p_site=${p_site}`
  );
  console.log("HEADER", response.data);

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BIAYAOLAH, payload: response.data });
};

export const fetchDataDetail = (p_year, p_site) => async (dispatch) => {
  dispatch({ type: RESET_BI_DATA });
  const response = await eplant.get(
    `${ROUTESHEADERDETAIL}?p_year=${p_year}&p_site=${p_site}`
  );
  console.log("Detail", response.data);
  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_BIAYAOLAHDETAIL, payload: response.data });
};
