import _ from 'lodash'
import {EXCEPTION_ERROR, FETCH_AREASTATEMENT, FETCH_PRODUKSIHARIAN, FETCH_PRODUKSIBULANAN, FETCH_PRODUKSIBULANANDETAIL, FETCH_YIELDPOTENSI, FETCH_DASHBOARD, FETCH_YIELDBYAGE, FETCH_ACTBUDGET, FETCH_ACTBUDGETMAP, FETCH_ACTPOT, FETCH_ACTPOTMAP} from "../actions/types"

export const INIT_STATE = {
    errorMessage: '',
    dashboard:[],
    fetchareastatement:[],
    fetchproduksiharian:[],
    fetchproduksibulanan:[],
    fetchproduksibulanandetail:[],
    fetchyieldbyage:[],
    fetchyieldpotensi:[],
    fetchactbudget:[],
    fetchactbudgetmap:[],
    fetchactpot:[],
    fetchactpotmap:[],
    
}
export const dashboard = (state = INIT_STATE, action) => {
    switch (action.type) {
        case EXCEPTION_ERROR:
            return {
                ...state,
                errorMessage: action.payload
            }
        case FETCH_DASHBOARD:
            return {
                ...state,
                errorMessage: '',
                dashboard: action.payload
            }
        case FETCH_AREASTATEMENT:
            return {
                ...state,
                errorMessage: '',
                fetchareastatement: action.payload
            }
        case FETCH_PRODUKSIHARIAN:
            return {
                ...state,
                errorMessage: '',
                fetchproduksiharian: action.payload
            }
        case FETCH_PRODUKSIBULANAN:
            return {
                ...state,
                errorMessage: '',
                fetchproduksibulanan: action.payload
            }
        case FETCH_PRODUKSIBULANANDETAIL:
            return {
                ...state,
                errorMessage: '',
                fetchproduksibulanandetail: action.payload
            }
        case FETCH_YIELDBYAGE:
            return {
                ...state,
                errorMessage: '',
                fetchyieldbyage: action.payload
            }
        case FETCH_YIELDPOTENSI:
            return {
                ...state,
                errorMessage: '',
                fetchyieldpotensi: action.payload
            }

        case FETCH_ACTBUDGET:
            return {
                ...state,
                errorMessage: '',
                fetchactbudget: action.payload
            }
        case FETCH_ACTBUDGETMAP:
            return {
                ...state,
                errorMessage: '',
                fetchactbudgetmap: action.payload
            }

        case FETCH_ACTPOT:
            return {
                ...state,
                errorMessage: '',
                fetchactpot: action.payload
            }
        
        case FETCH_ACTPOTMAP:
            return {
                ...state,
                errorMessage: '',
                fetchactpotmap: action.payload
            }
    
    
        default:
            break;
    }

    return state
}


