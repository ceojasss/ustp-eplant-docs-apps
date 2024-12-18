import {
  EXCEPTION_ERROR,
  PICKED_DATE,
  PICKED_SITE,
  FETCH_BI,
  FETCH_BI_1,
  FETCH_BI_2,
  FETCH_BI_3,
  FETCH_BI_4,
  FETCH_BI_5,
  FETCH_BI_6,
  FETCH_BI_7,
  FETCH_BI_8,
  FETCH_BI_9,
  FETCH_BI_10,
  FETCH_BI_11,
  FETCH_BI_12,
  FETCH_BI_13,
  FETCH_BI_14,
  RESET_BI_DATA_7,
  RESET_BI_DATA,
  FETCH_LPH,
  FETCH_LPB,
  FETCH_RPB,
  FETCH_RPH,
  FETCH_GRADFFB,
  FETCH_TABLEGRAD,
  FETCH_BREEDER,
  FETCH_JAMTBS,
  FETCH_TABKERJA,
  FETCH_TABLECOST,
  FETCH_TABLETBSOLAH,
  FETCH_TABCOSTTBSOLAH,
  FETCH_PALMPROD,
  FETCH_COSTPALMPROD,
  FETCH_OLAHRAWATUMUM,
  FETCH_THISMONTH,
  FETCH_TODATE,
  FETCH_BIAYATHISMONTH,
  FETCH_BIAYATODATE,
  FETCH_TABEMP,
  FETCH_RANKKERJA,
  FETCH_RANKEMP,
  FETCH_UMUR,
  FETCH_GAUGE,
  FETCH_GAUGE1,
  FETCH_MILL,
  FETCH_BIAYAOLAH,
  FETCH_BIAYAOLAHDETAIL,
  FETCH_BIAYARAWAT,
  FETCH_BIAYARAWATDETAIL,
  FETCH_BIAYAUMUM,
  FETCH_BIAYAUMUMDETAIL,
  FETCH_AREASTATEMENT, FETCH_PRODUKSIHARIAN, FETCH_PRODUKSIBULANAN, FETCH_PRODUKSIBULANANDETAIL, FETCH_YIELDPOTENSI, FETCH_DASHBOARD, FETCH_YIELDBYAGE, FETCH_ACTBUDGET, FETCH_ACTBUDGETMAP, FETCH_ACTPOT, FETCH_ACTPOTMAP

} from "../actions/types";
//import {BIDateFormatter} from "../../utils/FormComponentsHelpler";

const dateToday = new Date()
const yesterday = new Date(dateToday.getTime() - (24 * 60 * 60 * 1000));

// console.log(date)
export const INIT_STATE = {
  errorMessage: "",
  pickedSite: 'USTP',
  pickedDate: yesterday,
  fetch_data: [],
  fetch_data1: [],
  fetch_data2: [],
  fetch_data3: [],
  fetch_data4: [],
  fetch_data5: [],
  fetch_data6: [],
  fetch_data7: [],
  fetch_data8: [],
  fetch_data9: [],
  fetch_data10: [],
  fetch_data11: [],
  fetch_data12: [],
  fetch_data13: [],
  fetch_data14: [],
  reset_bi: [],
  fetchlph:[],
  fetchlpb:[],
  fetchrpb:[],
  fetchrph:[],
  fetchgradffb:[],
  fetchtablegrad:[],
  fetchbreeder:[],
  fetchjamtbs:[],
  fetchtabkerja:null,
  fetchtabcost:[],
  fetchtbsolah:[],
  fetchcosttbsolah:[],
  fetchpalmprod:[],
  fetchcostpalmprod:[],
  fetcholahrawatumum:[],
  fetchthismonth:[],
  fetchtodate:[],
  fetchbiayathismonth:[],
  fetchbiayatodate:[],
  fetchtabemp:[],
  fetchrankkerja:[],
  fetchrankemp:[],
  fetchumur:[],
  fetchgauge:[],
  fetchgauge1:[],
  fetchdatamill:[],
  fetchbiayaolah:[],
  fetchbiayaolahdetail:[],
  fetchbiayarawat:[],
  fetchbiayarawatdetail:[],
  fetchbiayaumum:[],
  fetchbiayaumumdetail:[],
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


};
export const businessintelligence = (state = INIT_STATE, action) => {
  switch (action.type) {
    case EXCEPTION_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case RESET_BI_DATA_7:
      return {
        ...state,
        errorMessage: "",
        fetch_data7: []
      }
    case PICKED_SITE:
      return {
        ...state,
        errorMessage: "",
        pickedSite: action.payload,
      };
    case PICKED_DATE:
      return {
        ...state,
        errorMessage: "",
        pickedDate: action.payload,
      };
    case FETCH_BI:
      return {
        ...state,
        errorMessage: "",
        fetch_data: [...state.fetch_data, action.payload],
      };
    case FETCH_BI_1:
      return {
        ...state,
        errorMessage: "",
        fetch_data1: action.payload,
      };
    case FETCH_BI_2:
      return {
        ...state,
        errorMessage: "",
        fetch_data2: action.payload,
      };
    case FETCH_BI_3:
      return {
        ...state,
        errorMessage: "",
        fetch_data3: action.payload,
      };
    case FETCH_BI_4:
      return {
        ...state,
        errorMessage: "",
        fetch_data4: action.payload,
      };
    case FETCH_BI_5:
      return {
        ...state,
        errorMessage: "",
        fetch_data5: action.payload,
      };
    case FETCH_BI_6:
      return {
        ...state,
        errorMessage: "",
        fetch_data6: action.payload,
      };
    case FETCH_BI_7:
      return {
        ...state,
        errorMessage: "",
        fetch_data7: action.payload,
      };
    case FETCH_BI_8:
      return {
        ...state,
        errorMessage: "",
        fetch_data8: action.payload,
      };
    case FETCH_BI_9:
      return {
        ...state,
        errorMessage: "",
        fetch_data9: action.payload,
      };
    case FETCH_BI_10:
      return {
        ...state,
        errorMessage: "",
        fetch_data10: action.payload,
      };
    case FETCH_BI_11:
      return {
        ...state,
        errorMessage: "",
        fetch_data11: action.payload,
      };
    case FETCH_BI_12:
      return {
        ...state,
        errorMessage: "",
        fetch_data12: action.payload,
      };
    case FETCH_BI_13:
      return {
        ...state,
        errorMessage: "",
        fetch_data13: action.payload,
      };
    case FETCH_BI_14:
      return {
        ...state,
        errorMessage: "",
        fetch_data14: action.payload,
      };
      case FETCH_LPH:
        return {
          ...state,
          errorMessage:"",
          fetchlph:action.payload,
        };
      case FETCH_LPB:
        return {
          ...state,
          errorMessage:"",
          fetchlpb:action.payload,
        };
      case FETCH_RPH:
        return {
          ...state,
          errorMessage:"",
          fetchrph:action.payload,
        };
      case FETCH_RPB:
        return {
          ...state,
          errorMessage:"",
          fetchrpb:action.payload,
        };
      case FETCH_GRADFFB:
        return {
          ...state,
          errorMessage:"",
          fetchgradffb:action.payload,
        };
      case FETCH_TABLEGRAD:
        return {
          ...state,
          errorMessage:"",
          fetchtablegrad:action.payload,
        };
      case FETCH_BREEDER:
        return {
          ...state,
          errorMessage:"",
          fetchbreeder:action.payload,
        };
      case FETCH_JAMTBS:
        return {
          ...state,
          errorMessage:"",
          fetchjamtbs:action.payload,
        };
      case FETCH_TABKERJA:
        return {
          ...state,
          errorMessage:"",
          fetchtabkerja:action.payload,
        };
      case FETCH_TABLECOST:
        return {
          ...state,
          errorMessage:"",
          fetchtabcost:action.payload,
        };
      case FETCH_TABLETBSOLAH:
        return {
          ...state,
          errorMessage:"",
          fetchtbsolah:action.payload,
        };
      case FETCH_TABCOSTTBSOLAH:
        return {
          ...state,
          errorMessage:"",
          fetchcosttbsolah:action.payload,
        };
      case FETCH_PALMPROD:
        return {
          ...state,
          errorMessage:"",
          fetchpalmprod:action.payload,
        };
      case FETCH_COSTPALMPROD:
        return {
          ...state,
          errorMessage:"",
          fetchcostpalmprod:action.payload,
        };
      case FETCH_OLAHRAWATUMUM:
        return {
          ...state,
          errorMessage:"",
          fetcholahrawatumum:action.payload,
        };
      case FETCH_THISMONTH:
        return {
          ...state,
          errorMessage:"",
          fetchthismonth:action.payload,
        };
      case FETCH_TODATE:
        return {
          ...state,
          errorMessage:"",
          fetchtodate:action.payload,
        };
      case FETCH_BIAYATHISMONTH:
        return {
          ...state,
          errorMessage:"",
          fetchbiayathismonth:action.payload,
        };
      case FETCH_BIAYATODATE:
        return {
          ...state,
          errorMessage:"",
          fetchbiayatodate:action.payload,
        };
      case FETCH_TABEMP:
        return {
          ...state,
          errorMessage:"",
          fetchtabemp:action.payload,
        };
      case FETCH_RANKKERJA:
        return {
          ...state,
          errorMessage:"",
          fetchrankkerja:action.payload,
        };
      case FETCH_RANKEMP:
        return {
          ...state,
          errorMessage:"",
          fetchrankemp:action.payload,
        };
      case FETCH_UMUR:
        return {
          ...state,
          errorMessage:"",
          fetchumur:action.payload,
        };
      case FETCH_GAUGE:
        return {
          ...state,
          errorMessage:"",
          fetchgauge:action.payload,
        };
      case FETCH_GAUGE1:
        return {
          ...state,
          errorMessage:"",
          fetchgauge1:action.payload,
        };
      case FETCH_BIAYAOLAH:
        return {
          ...state,
          errorMessage:"",
          fetchbiayaolah:action.payload,
        };
      case FETCH_BIAYAOLAHDETAIL:
        return {
          ...state,
          errorMessage:"",
          fetchbiayaolahdetail:action.payload,
        };
      case FETCH_BIAYARAWAT:
        return {
          ...state,
          errorMessage:"",
          fetchbiayarawat:action.payload,
        };
      case FETCH_BIAYARAWATDETAIL:
        return {
          ...state,
          errorMessage:"",
          fetchbiayarawatdetail:action.payload,
        };
      case FETCH_BIAYAUMUM:
        return {
          ...state,
          errorMessage:"",
          fetchbiayaumum:action.payload,
        };
      case FETCH_BIAYAUMUMDETAIL:
        return {
          ...state,
          errorMessage:"",
          fetchbiayaumumdetail:action.payload,
        };
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

  return state;
};
