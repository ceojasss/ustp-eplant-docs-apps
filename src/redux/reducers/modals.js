import { DETAIL_LOVDATA, DETAIL_LOVDATA_APPEND, DETAIL_LOVDATA_FAIL, DETAIL_LOVDATA_OK, ERROR_MODAL_STATE, FAILED_LOV, FETCH_LOVS, MODAL_SEARCH_VALUE, MODAL_STATE, OPEN_LOV, OPEN_LOVDATA, RESEARCH_LOVDATA, RESEARCH_LOVDATA_FAIL, RESEARCH_LOVDATA_OK, RESET_ERROR_MODAL_STATE, RESET_MODAL, VALUE_SELECTED } from "../actions/types";
import { INIT_STATE } from "./auth";

export const modals = (state, action) => {


    switch (action.type) {
        case MODAL_STATE:
            return {
                ...state,
                transactionError: '',
                errorMessage: '',
                modals: action.payload,
                selectedValue: []
            }
        case ERROR_MODAL_STATE:
            return {
                ...state,
                transactionError: action.payload.content,
                modals: action.payload,
                selectedValue: []
            }
        case RESET_ERROR_MODAL_STATE:
            return {
                ...state,
                transactionError: '',
                modals: INIT_STATE.modals,
                selectedValue: []
            }
        case RESET_MODAL:
            return {
                ...state,
                errorMessage: '',
                modals: INIT_STATE.modals,
                selectedValue: []
            }
        case OPEN_LOVDATA:
        case OPEN_LOV:
        case FAILED_LOV:
        case FETCH_LOVS:
            return {
                ...state,
                modals: action.payload
            }
        case RESEARCH_LOVDATA:
        case RESEARCH_LOVDATA_FAIL:
        case RESEARCH_LOVDATA_OK:
        case DETAIL_LOVDATA:
        case DETAIL_LOVDATA_FAIL:
        case DETAIL_LOVDATA_OK:
        case MODAL_SEARCH_VALUE:
            return {
                ...state,
                modals: { ...state.modals, ...action.payload }
            }
        case DETAIL_LOVDATA_APPEND:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    ...action.payload,
                    detailloading: false,
                }
            }

        case VALUE_SELECTED:
            return {
                ...state,
                selectedValue: action.payload.selectedValue,
                modals: action.payload.modals
            }

        default:
            return state;
    }

}