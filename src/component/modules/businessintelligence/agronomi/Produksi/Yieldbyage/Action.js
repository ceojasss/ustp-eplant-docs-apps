import eplant from "../../../../../../apis/eplant";
import {
  FETCH_YIELDBYAGE,
  SET_LOADING_STATUS,
  RESET_YIELDBYAGE
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/yieldbyage";

export const fetchProduksi = (p_site, p_intiplasma) => async (dispatch) => {
  dispatch({ type: RESET_YIELDBYAGE })
  const response = await eplant.get(`${ROUTES}?p_site=${p_site}&p_intiplasma=${p_intiplasma}`);
  // console.log('cekdata agronomi - produksi/areastatement',response.data.data)

  console.log('yield by age action',response.data )


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // dispatch({ type: FETCH_YIELDBYAGE, payload: response.data.data });
  dispatch({ type: FETCH_YIELDBYAGE, payload: response.data});

};
