import _ from 'lodash'
export const INDEXDATATRANSAKSI = 3
export const TABLEDYNAMICCTL = 'tableDynamicControl'

export const NumberFormat = (format) => new Intl.NumberFormat("cnd").format(format)

export const OKEY = 'k3l4p45@w!t'

export const APP_TITLES = 'iPlant USTP'
export const ORA_STRING = 'oracledb.STRING'
export const ORA_NUMBER = 'oracledb.NUMBER'

export const DATEFORMAT = 'dd/MM/yyyy'
export const MONTHFORMAT = 'MM/yyyy'
export const YEARFORMAT = 'yyyy'
export const DATETIMEFORMAT = 'dd/mm/yyyy h:mm'
export const TIMEFORMAT = 'HH:mm'


export const SDATA = 'data'
export const NEWS = 'new'

export const ROWIDS = 'rowids'

export const GRN = 'Goods Receive Note'
export const SIV = 'Store Issue Voucher'
export const NI = 'Nursery Issue'
export const PR = 'Purchase Request'
export const PO = 'Purchase Order'
export const VH = 'vehicle'
export const TRAIN = 'training'
export const VHG = 'vehiclegroup'
export const MC = 'machine'
export const WS = 'workshop'
export const EA = 'estateafdeling'
export const PARAMETERVALUE = 'parametervalue'
export const EMPLOYEE = 'employeecode'
export const LPO = 'lpo'
export const LPR = 'lpr'
export const TGLATK = 'tglatk'
export const BO = 'blockorganization'
export const BMU = 'blockusage'
export const MR = 'Material Request'
export const SPD = 'realisasispd'
export const VHA = 'vehicleavailability'
export const PC = 'Petty Cash'
export const WC = 'workingcalendar'
export const PREFIX_FIELD_CONTROL = '#controldisplayonly'


export const REPORT_ICON = { w: 15.4, h: 22.75 }
export const REPORT_ICON_SIV = { w: 40.4, h: 40.75 }

export const DOCUMENT_SIZE = {
    p_a4: {
        size: [304.8, 215.9],
        orientation: 'p'
    }
    ,
    l_a4: {
        size: [215.9, 304.8],
        orientation: 'l'
    },
    l_b3: {
        //size: [353, 500],
        size: [305, 393],
        orientation: 'l'
    }
}



// // // console.log(`http`)
export let DEFAULTOPTIONS

if (_.isUndefined(process.env.REACT_APP_HTTPS)) {

    DEFAULTOPTIONS = {
        baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`,
    };
} else if (!_.isUndefined(process.env.REACT_APP_SITE)) {
    DEFAULTOPTIONS = {
        baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:4100/api/`,
    };
} else {
    DEFAULTOPTIONS = {
        baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`,
    };
}

export let SITEOPTIONS

let singlePort = false

//// // console.log(process.env.REACT_APP_SINGLE_PORT)

if (!_.isUndefined(process.env.REACT_APP_SINGLE_PORT)) {
    if (process.env.REACT_APP_SINGLE_PORT === 'true') {
        singlePort = true
    }
}

// console.log(!singlePort)
if (singlePort == false && _.isUndefined(process.env.REACT_APP_SITE)) {
    // // console.log('masuk sini')
    // console.log('1')

    if (_.isUndefined(process.env.REACT_APP_HTTPS)) {
        SITEOPTIONS = {

            GCM: {
                baseURL: `http://${process.env.REACT_APP_URLS}:3100/api/`
            },
            GCMSITE: {
                baseURL: `http://${process.env.REACT_APP_URLS}:4100/api/`
            },
            SMG: {
                baseURL: `http://${process.env.REACT_APP_URLS}:3200/api/`
            },
            SLM: {
                baseURL: `http://${process.env.REACT_APP_URLS}:3400/api/`
            },
            SBE: {
                baseURL: `http://${process.env.REACT_APP_URLS}:3300/api/`
            },
            SJE: {
                baseURL: `http://${process.env.REACT_APP_URLS}:3500/api/`
            },
            USTP: {
                baseURL: `http://${process.env.REACT_APP_URLS}:3600/api/`
            },
            TST: {
                baseURL: `http://${process.env.REACT_APP_URLS}:3800/api/`
            },
        };
    } else {


        SITEOPTIONS = {

            GCM: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3100/api/`
            },
            GCMSITE: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:4100/api/`
            },
            SMG: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3200/api/`
            },
            SLM: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3400/api/`
            },
            SBE: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3300/api/`
            },
            SJE: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3500/api/`
            },
            USTP: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3600/api/`
            },
            TST: {
                baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3800/api/`
            },
        };

    }
} else if (singlePort == true && !_.isUndefined(process.env.REACT_APP_SITE)) {
    // console.log('2')
    SITEOPTIONS = {

        GCM: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:4100/api/`
        },
        GCMSITE: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SLM: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:4100/api/`
        },
        SBE: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:4100/api/`
        },
        SMG: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:4100/api/`
        },
        SJE: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:4100/api/`
        },
        USTP: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
    };
} else if (singlePort == true && !_.isUndefined(process.env.REACT_APP_HTTPS)) {
    SITEOPTIONS = {

        GCM: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
        GCMSITE: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SLM: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SBE: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SMG: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SJE: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
        USTP: {
            baseURL: `${process.env.REACT_APP_HTTPS}://${process.env.REACT_APP_URLS}:3000/api/`
        },
    };
} else {
    // console.log('3',singlePort,process.env.REACT_APP_SITE)
    // // console.log('masuk sini AJA')
    SITEOPTIONS = {

        GCM: {
            baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
        },
        GCMSITE: {
            baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SMG: {
            baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SLM: {
            baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SBE: {
            baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
        },
        SJE: {
            baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
        },
        USTP: {
            baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
        },
    };
}

export const DOWNLOADOPTS = {
    responseType: 'arraybuffer',
    type: 'data:application/vnd.ms-excel',
    baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`
};

export const PREFIX_EDIT = 'Edit'
export const PREFIX_NEW = 'New'

export const STATUS_SAVED = 'Saved'
export const STATUS_UPDATED = 'Updated'

export const VIEW_PDF = 'pdf'
export const VIEW_EXCEL = 'excel'
export const VIEW_EXCEL_NEW = 'exceldata'

export const headersprodhariann = [
    {
      name: "INTI",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "Tanggal"},
        { dataIndex: "GCM" },
        { dataIndex: "SMG" },
        { dataIndex: "SJE" },
        { dataIndex: "SBE" },
        { dataIndex: "SLM" },
        { dataIndex: "Total Inti" },
      ],
    },
    {
      name: "PLASMA",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "GCM" },
        { dataIndex: "SMG" },
        { dataIndex: "SJE" },
        { dataIndex: "SBE" },
        { dataIndex: "SLM" },
        { dataIndex: "Total Plasma" },
        { dataIndex: "Total" },
      ],
    },
  ];

  export const headersyieldpotensii = [
    {
      name: "USTP",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "PLANTING YEAR" },
        { dataIndex: "ACT" },
        { dataIndex: "BGT" },
        { dataIndex: "BOT" },
        { dataIndex: "ACTLY" },
        { dataIndex: "BGTFULL" },
        { dataIndex: "POTTEO" },
        { dataIndex: "POTRIIL" },
      ],
    },
    {
      name: "GCM",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "ACT" },
        { dataIndex: "BGT" },
        { dataIndex: "BOT" },
        { dataIndex: "ACTLY" },
        { dataIndex: "BGTFULL" },
        { dataIndex: "POTTEO" },
        { dataIndex: "POTRIIL" },
      ],
    },
    {
      name: "SMG",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "ACT" },
        { dataIndex: "BGT" },
        { dataIndex: "BOT" },
        { dataIndex: "ACTLY" },
        { dataIndex: "BGTFULL" },
        { dataIndex: "POTTEO" },
        { dataIndex: "POTRIIL" },
      ],
    },
    {
      name: "SJE",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "ACT" },
        { dataIndex: "BGT" },
        { dataIndex: "BOT" },
        { dataIndex: "ACTLY" },
        { dataIndex: "BGTFULL" },
        { dataIndex: "POTTEO" },
        { dataIndex: "POTRIIL" },
      ],
    },
    {
      name: "SBE",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "ACT" },
        { dataIndex: "BGT" },
        { dataIndex: "BOT" },
        { dataIndex: "ACTLY" },
        { dataIndex: "BGTFULL" },
        { dataIndex: "POTTEO" },
        { dataIndex: "POTRIIL" },
      ],
    },
    {
      name: "SLM",
      color: "#aba8a7",
      subHeaders: [
        { dataIndex: "ACT" },
        { dataIndex: "BGT" },
        { dataIndex: "BOT" },
        { dataIndex: "ACTLY" },
        { dataIndex: "BGTFULL" },
        { dataIndex: "POTTEO" },
        { dataIndex: "POTRIIL" },
      ],
    },
  ];
  
  
export const SHORTMONTH = 'shortmonth'
export const LONGMONTH = 'longmonth'
export const YEAR = 'year'
export const DAYS = 'day'
export const FULLDATE = 'fulldateddmmyyyy'

export const PARAM_DATE = 'p_date'
export const PARAM_TM = 'p_tm'
export const PARAM_CM = 'p_cm'
export const PARAM_TW = 'p_tw'

export const PARAM_LM = 'p_lm'

export const PARAM_TD = 'p_td'
export const P_MONTH = 'p_month'
export const P_LASTMONTH = 'p_last_month'
export const P_LASTMONTH_NAME = 'p_lmn'


export const APP_MODULES = {
    cashreceivevoucher: 'cashreceivevoucher',
    cashpaymentvoucher: 'cashpaymentvoucher',
    cashpettycash: 'cashpettycash',
    purchaseorder: 'purchasingpurchaseorder',
    purchaserequest: 'purchasingpurchaserequest',
    purchasereceivenote: 'purchasingreceivenote',
    patient_name: 'patient_name',
    fixedassetfamaster: 'fixedassetfamaster',
    vehicleactivity: 'vehiclevehicleactivity',
    hrmedicalinternal: 'hrmedicalinternal',
    hrbarangassets: 'hrbarangassets',
    contractagreement: 'contractperintahkerja',
    nurserynurseryissue: 'nurserynurseryissue',
    contractagreementctl: 'contractperintahkerjatuslah',
    materialrequest: 'storesmaterialrequest',
    medicalho: 'hrmedicalho',
    contractproformacontract: 'contractproformacontract',
    contractinvoicecontract: 'contractinvoicecontract',
    contractcontractprogresstuslah: 'contractcontractprogresstuslah',
    fopblockmaster: 'fopblockmaster',
    emppayrollarea: 'emppayrollarea',
    emppayrollallowdedtype: 'emppayrollallowdedtype',
    empotherpayrollrate: 'empotherpayrollrate',
    empsalarygrade: 'empsalarygrade',
    purchasinginvoice: 'purchasinginvoice',
    pomffbgrading: 'pomffbgrading',
    potransportexpedition: 'purchasingpotransportexpedition',
}
