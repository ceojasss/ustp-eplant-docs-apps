import eplant from "../../../../../../apis/eplant";
import {
  FETCH_PRODUKSIBULANAN,
  SET_LOADING_STATUS,
  RESET_PRODUKSIBULANAN
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/produksibulanan";

export const fetchProduksi = (p_year, p_site, p_plant, p_estate, p_division, p_intiplasma) => async (dispatch) => {
  dispatch({ type: RESET_PRODUKSIBULANAN })
  const response = await eplant.get(`${ROUTES}?p_year=${p_year}&p_site=${p_site}&p_plant=${p_plant}&p_estate=${p_estate}&p_division=${p_division}&p_intiplasma=${p_intiplasma}`);
  console.log('Produksi bulanan action',response.data )


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_PRODUKSIBULANAN, payload: response.data });
};
