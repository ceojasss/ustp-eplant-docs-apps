import eplant from "../../../../../../apis/eplant";
import {
  FETCH_PRODUKSIBULANANDETAIL,
  SET_LOADING_STATUS,
  RESET_PRODUKSIBULANANDETAIL
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/produksibulanandetail";

export const fetchProduksi = (p_year, p_intiplasma, p_plant) => async (dispatch) => {
  dispatch({ type: RESET_PRODUKSIBULANANDETAIL })
  const response = await eplant.get(`${ROUTES}?p_year=${p_year}&p_plant=${p_plant}&p_intiplasma=${p_intiplasma}`);
  
  console.log('produksi bulanan detail action',response.data)

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_PRODUKSIBULANANDETAIL, payload: response.data });
};
