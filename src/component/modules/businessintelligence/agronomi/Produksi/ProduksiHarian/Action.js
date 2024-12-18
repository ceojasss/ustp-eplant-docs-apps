import eplant from "../../../../../../apis/eplant";
import {
  FETCH_PRODUKSIHARIAN,
  SET_LOADING_STATUS,
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/produksiharian";

export const fetchProduksi = (p_date) => async (dispatch) => {
  const response = await eplant.get(`${ROUTES}?p_date=${p_date}`);
  console.log('produksi harian action',response.data)


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_PRODUKSIHARIAN, payload: response.data});
};
