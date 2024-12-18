import eplant from "../../../../../../apis/eplant";
import {
  FETCH_ACTBUDGET,
  FETCH_ACTBUDGETMAP,
  SET_LOADING_STATUS,
  RESET_AGRO_DATA
} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/agronomi/query";
const ROUTES = "/bi/agronomi/actbudget";

export const fetchProduksi = (p_month, p_year, p_site, p_intiplasma) => async (dispatch) => {
  console.log('isi p_site table: ', {p_site})

  dispatch({ type: RESET_AGRO_DATA })
  const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}&p_site=${p_site}&p_intiplasma=${p_intiplasma}`);
  // console.log('cekdata agronomi - produksi/areastatement',response.data.data)

  console.log('act budget action',response.data )


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // dispatch({ type: FETCH_YIELDBYAGE, payload: response.data.data });
  dispatch({ type: FETCH_ACTBUDGET, payload: response.data});

};

export const fetchDataMap = (p_site) => async (dispatch) => {
  console.log('isi p_site map : ', {p_site})
  dispatch({ type: RESET_AGRO_DATA })
  const response = await eplant.get(`${ROUTES}/map?p_site=${p_site}`);

  console.log('map response',response.data)


  dispatch({ type: SET_LOADING_STATUS, payload: false });
  // dispatch({ type: FETCH_YIELDBYAGE, payload: response.data.data });
  dispatch({ type: FETCH_ACTBUDGETMAP, payload: response.data })

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
