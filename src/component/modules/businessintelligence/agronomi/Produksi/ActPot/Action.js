import eplant from "../../../../../../apis/eplant";
import {
  FETCH_ACTPOT,
  SET_LOADING_STATUS,
  FETCH_ACTPOTMAP,
  RESET_ACT_POT
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/actpot";

export const fetchProduksi = (p_month, p_year, p_site, p_intiplasma) => async (dispatch) => {
  dispatch({ type: RESET_ACT_POT })
  const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}&p_site=${p_site}&p_intiplasma=${p_intiplasma}`);
  // console.log('cekdata agronomi - produksi/areastatement',response.data.data)

  console.log('act pot action',response.data )

  
  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // dispatch({ type: FETCH_YIELDBYAGE, payload: response.data.data });
  dispatch({ type: FETCH_ACTPOT, payload: response.data});

};

export const fetchDataMap = (p_site) => async (dispatch) => {
  console.log('isi p_site map actpot : ', {p_site})
  dispatch({ type: RESET_ACT_POT })
  const response = await eplant.get(`${ROUTES}/map?p_site=${p_site}`);

  // console.log('map response',response.data)


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // dispatch({ type: FETCH_YIELDBYAGE, payload: response.data.data });
  dispatch({ type: FETCH_ACTPOTMAP, payload: response.data })

};


// export const fetchDataMap = (p_month, p_year, p_site, p_intiplasma) => async (dispatch) => {
//   console.log('isi p_site map : ', { p_site });
//   const response = await eplant.get(`${ROUTES}/map`, {
//     params: { p_site },
//   });

//   console.log('map response', response.data);

//   dispatch({ type: SET_LOADING_STATUS, payload: false });
//   // dispatch({ type: FETCH_YIELDBYAGE, payload: response.data.data });
//   dispatch({ type: FETCH_ACTBUDGETMAP, payload: response.data });
// };




// export const fetchDataMap = () => async dispatch => {

//   const response = await eplant.get(`${ROUTES}/map`)

//   console.log('map response',response)

//   dispatch({ type: FETCH_ACTBUDGETMAP, payload: response.data })

// }

