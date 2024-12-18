
import _ from 'lodash'
import CryptoJS from 'crypto-js'
import { utils, writeFile } from 'xlsx';

import { getFormComponent, getFormListComponent, parseMillSectoString, parseTimetoString, QueryDataDetail, UserInfo } from "./FormComponentsHelpler"
import { INDEXDATATRANSAKSI, OKEY, VIEW_EXCEL, VIEW_PDF } from '../component/Constants'
import store from '../redux/reducers'
import { ShowReport } from '../redux/actions'
import eplant from '../apis/eplant';
import { useDispatch } from 'react-redux';
import { SPREADSHEET } from '../redux/actions/types';

export const isNumeric = (str) => {
    if (typeof str !== "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export const isDataExist = (find) => {
    let exists = false

    const component = _.map(_.filter(getFormListComponent(), ['tableparentkey', 'true']), x => x.key)

    exists = _.some(QueryDataDetail(), [component, find])

    return exists
}

export const UpdateResultHeader = (data) => {
    const datas = _.map(data, (data) => {
        return _.mapValues(data, (value, key) => {


            if (value instanceof Object) {
                let stringVal = ''
                _.map(Object.keys(value), (z, i) => {
                    stringVal += (i > 0 ? ' - ' : '') + value[z]
                })
                return stringVal;
            }

            return value
        })
    }
    )
    return datas
}

export const ApproveAuthorized = ({ original }) => {
    let actionStatus = true

    const status = _.isUndefined(original.process_flag) ? 'CREATED' : (_.isEmpty(original.process_flag) ? 'CREATED' : original.process_flag)

    const component = getFormComponent()


    //console.log('hey', _.get(_.find(component), 'isapprove'))

    if (_.get(_.find(component), 'isapprove') !== 'N')
        if (status.match(/^(CREATED|SUBMITED|SUBMIT|DRAFT)$/))
            actionStatus = false


    return actionStatus
}


export const ActionDisable = ({ original }) => {
    let actionStatus = true

    const status = _.isUndefined(original.process_flag) ? 'CREATED' : (_.isEmpty(original.process_flag) ? 'CREATED' : original.process_flag)

    const component = getFormComponent()

    if (_.get(_.find(component), 'isupdate') !== 'N')
        if (status.match(/^(CREATED|SUBMITED|SUBMIT|DRAFT)$/))
            actionStatus = false


    return actionStatus
}

export const DeleteAuthorized = ({ original }) => {
    let actionStatus = true

    const status = _.isUndefined(original.process_flag) ? 'CREATED' : (_.isEmpty(original.process_flag) ? 'CREATED' : original.process_flag)

    const component = getFormComponent()

    ///    console.log(_.get(_.find(component), 'isdelete'), status)

    if (_.get(_.find(component), 'isdelete') !== 'N')
        if (status.match(/^(CREATED|SUBMITED|SUBMIT|DRAFT)$/))
            actionStatus = false


    return actionStatus
}

export const GetMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    // Using the browser's default locale.
    return date.toLocaleString([], { month: 'long' });
}


export const encryptString = async (v) => {

    // Encrypt
    let ciphertext = CryptoJS.AES.encrypt(v, OKEY).toString();

    // Decrypt
    //  let bytes = CryptoJS.AES.decrypt(ciphertext, OKEY);
    //  var originalText = bytes.toString(CryptoJS.enc.Utf8);

    return encodeURIComponent(ciphertext)

}


export const LegacyReportURL = (_type) => {
    let reportIP, v

    const { site } = UserInfo()

    switch (site) {
        case 'GCM':
            reportIP = '10.20.12.34'
            break;
        case 'SMG':
            reportIP = '10.20.10.35'
            break;
        case 'SLM':
            reportIP = '10.20.10.36'
            break;
        case 'SBE':
            reportIP = '10.20.10.37'
            break;
        case 'SJE':
            reportIP = '10.20.10.38'
            break;
        default:
            reportIP = '10.20.10.39'
            break;

    }


    /** override with report proxy gate */
    reportIP = 'ireport.ustp.co.id'

    if (_type === VIEW_PDF) {
        v = `http://${reportIP}:8889/reports/rwservlet?EPMS_${site}&destype=CACHE&desformat=PDF`
    } else if (_type === VIEW_EXCEL) {
        v = `http://${reportIP}:8889/reports/rwservlet?EPMS_${site}&destype=CACHE&desformat=delimiteddata&mode=default&mimetype=application/vnd.ms-excel`
    }



    return v
}


export const ReportUrl = async (_type, _obj, param, cb) => {



    let urls = `generate/spreadsheet/${_obj.route}?${param}`



    const response = await eplant.get(urls, {
        method: "GET",
        responseType: "blob",
    })


    if (!_.isEmpty(response)) {

        const _file = new Blob([response.data], {
            type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
            /*  response.headers['content-type'] */
        });

        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = URL.createObjectURL(_file)
        a.download = `${_obj.reportdesc}_`
        a.target = '_blank'
        a.click()
        a.remove()  // 移除a标l)
        URL.revokeObjectURL(_file)
    }

    if (cb) {
        cb()
    }
}


export const DownloadReportUrl = async (_type, _obj, param, filename, cb) => {



    let urls = `generate/spreadsheet/${_obj.route}?${param}`



    const response = await eplant.get(urls, {
        method: "GET",
        responseType: "blob",
    })

    let ok = true


    if (!_.isEmpty(response) && response?.headers['content-length'] > 2) {

        const _file = new Blob([response.data], {
            type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
            /*  response.headers['content-type'] */
        });


        console.log(filename)

        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = URL.createObjectURL(_file)
        a.download = filename
        a.target = '_blank'
        a.click()
        a.remove()  // 移除a标l)
        URL.revokeObjectURL(_file)

    } else {
        ok = false
    }

    if (cb) {
        cb(ok)
    }
}

export const openXLSView = async (_type, _obj, param, filename, cb) => {

    // let urls = `generate/spreadsheet/${_obj.route}?${param}`

    //const dispatch = useDispatch()



    const doc = {
        ..._obj,
        parameters: param
    }

    //console.log(doc)
    store.dispatch({
        type: SPREADSHEET,
        payload: doc
    })

    if (cb) {
        cb()
    }
}

// *function get form component from redux state
export const ErrorData = () => {

    const states = store.getState()

    //console.log('help c', Object.values(states)[INDEXDATATRANSAKSI]['data']['component'])

    return (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI])
        ? Object.values(states)[INDEXDATATRANSAKSI]['data']['errorMessage'] : '')
}

export const CopyText = (txt, cb) => {

    let textArea = document.createElement("textarea");
    textArea.value = txt
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand('copy') ? res() : rej();
        textArea.remove();

        if (cb) cb()

    });
}


export const runReport = (rows) => {
    // console.log(rows)
    const st = store.getState();

    const trx = Object.values(st)[INDEXDATATRANSAKSI]

    let titles = _.find(trx.data.component, { 'itemname': 'TITLE' })['prompt_ina']
    let key = Object.keys(rows.original)
    const mapping = key.map((keys, i) => keys.match('url_preview'))
    let count = mapping.filter(function (el) {
        return el != null;
    })
    // console.log(count)
    if (_.size(count) === 1) {
        window.open(!_.isEmpty(rows.original.v_url_preview_solar) ? rows.original.v_url_preview_solar : rows.original.v_url_preview)
    } else if (_.size(count) === 0) {
    } else {
        store.dispatch(ShowReport(titles, rows.original, count))
    }
}


export const isAutoApprove = () => {

    const states = store.getState()

    let ret = false

    if (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI])) {
        if (_.get(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'][0], 'autoapprove') === 'TRUE') {
            ret = true
        }

    }

    return ret
}


export const toSingleXLS = (jsonData, tabName, fileName) => {
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(jsonData);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, tabName);
    /* export to XLSX */
    writeFile(wb, `${fileName}.xlsx`);
}
//{ raw: false, cellDates: true, dateNF: 'd"-"m"-"yyyy' }
export const xlsFromTable = (content, dates) => {
    const table = document.getElementById(`${content?.groupid}.${content?.code}`);
    const wb = utils.table_to_book(table, { raw: true });
    // XLSX.writeFile(wb, `${fileName}.xlsx`);

    const sdates = parseMillSectoString(dates)

    writeFile(wb, `${content?.group}_${sdates}.xlsx`);
}

export const randomIds = () => {

    return Math.random().toString(36).substring(2, 7)
}