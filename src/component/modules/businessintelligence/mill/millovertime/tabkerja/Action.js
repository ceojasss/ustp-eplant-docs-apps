// import eplant from "../../../../../../apis/eplant";
// // import FETCH_LPH from './Reducer';
// import {FETCH_TABKERJA, SET_LOADING_STATUS} from "../../../../../../redux/actions/types";

// const ROUTES = "/bi/mill/tabkerja";

// export const fetchData = ( p_month,p_year,p_site) => async (dispatch) => {

//   let step =1;

//   const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}&p_site=${p_site}`);

//   // console.log("done fetch rph");

//   console.log(`${step++}. Action`,response.data);

//   dispatch({ type: SET_LOADING_STATUS, payload: false });
//   dispatch({ type: FETCH_TABKERJA, payload: response.data});
// };
import eplant from "../../../../../../apis/eplant";
// import FETCH_LPH from './Reducer';
import { FETCH_TABKERJA, SET_LOADING_STATUS } from "../../../../../../redux/actions/types";

const ROUTES = "/bi/mill/tabkerja";

export const fetchData = (p_month, p_year, p_site) => async (dispatch) => {
  let step = 1;

  const response = await eplant.get(`${ROUTES}?p_month=${p_month}&p_year=${p_year}&p_site=${p_site}`);

  console.log(`${step++}. Action`, response.data);

  const payload = {
    data: response.data.data, // Mengakses response.data.data untuk 'data'
    component: response.data.component || null, // Mengakses response.data.component atau null jika tidak ada
  };

  dispatch({ type: SET_LOADING_STATUS, payload: false });
  dispatch({ type: FETCH_TABKERJA, payload });
};
