import eplant from "../../../../../../apis/eplant";
import {
  FETCH_AREASTATEMENT,
  SET_LOADING_STATUS,
  RESET_AREASTATEMENT
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/arealstatement";

export const fetchProduksi = (p_year, p_intiplasma) => async (dispatch) => {
  dispatch({ type: RESET_AREASTATEMENT })
  const response = await eplant.get(`${ROUTES}?p_year=${p_year}&p_intiplasma=${p_intiplasma}`);
  // console.log('cekdata agronomi - produksi/areastatement',response.data.data)

  console.log('area statement action',response.data )


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // dispatch({ type: FETCH_AREASTATEMENT, payload: response.data.data });
  dispatch({ type: FETCH_AREASTATEMENT, payload: response.data});

};
