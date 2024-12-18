import eplant from "../../../../../../apis/eplant";
import {
  FETCH_YIELDPOTENSI,
  SET_LOADING_STATUS,
  RESET_YIELDPOTENSI
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/yieldpotensi";

export const fetchProduksi = (p_month,p_year, p_intiplasma) => async (dispatch) => {
  dispatch({ type: RESET_YIELDPOTENSI })
  const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}&p_intiplasma=${p_intiplasma}`);
  // console.log('cekdata agronomi - produksi/areastatement',response.data.data)

  console.log('yield potensi action',response.data )


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // dispatch({ type: FETCH_YIELDBYAGE, payload: response.data.data });
  dispatch({ type: FETCH_YIELDPOTENSI, payload: response.data});

};
