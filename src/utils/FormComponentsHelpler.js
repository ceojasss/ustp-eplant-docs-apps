import { isDate, parse } from 'date-fns'
import _ from 'lodash'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Message } from 'semantic-ui-react'
import * as yup from 'yup'
import eplant from '../apis/eplant'
import dateFormat from "dateformat";
import { toast } from 'react-toastify';

import CryptoJS from 'crypto-js';

// *library imports placed above ↑
// *local imports placed below ↓

import {
    APP_MODULES, FULLDATE, INDEXDATATRANSAKSI, NEWS, OKEY, ORA_NUMBER, PARAM_CM, PARAM_DATE, PARAM_LM, PARAM_TD,
    PARAM_TM, PARAM_TW, P_LASTMONTH, P_LASTMONTH_NAME, P_MONTH, SHORTMONTH
} from '../component/Constants'
import { Appresources } from '../component/templates/ApplicationResources'
import { populateList, setEditData } from '../redux/actions'
import {
    ACTION_LABEL, DOCUMENT_TITLE, SET_DEFAULT_VALUE, SET_TRANSACTION_INFO, SET_VALIDATION_SCHEMA, UPDATE_NAV_PERIOD,
    UPDATE_NAV_PERIOD_NOW, UPDATE_NAV_SEARCH, UPDATE_NAV_SEARCH2
} from '../redux/actions/types'
import store from '../redux/reducers'


//import utc from 'dayjs/plugin/utc'
//var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin



/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - 
 |                - 
 |          
 |  Description:  Helper Functions for Form / List Component
 |                > list of functions                 
 |                  - getTableComponent : return object for list view
 |                  - getFormComponent :  return object for form      
 |                  - getFormListComponent : return object for form grid
 |                  - dirtyValues :                          
 |                  - checkDuplicateRows : 
 |                  - FormDefaultValidation : 
 |                  - InitValidation : init validation object & form object 
 |                  - InitValidationList : init validation object & form grid object 
 |                  - InitValidationMixed : init validation object & form + form grid object 
 |                  -  :        
 |                  -  : 
 |                  -  :                          
 |                  -  : 
 |                  -  : 
 |                  -  :
 |                  -  :
 *===========================================================================*/


// * get table component
export const getTableComponent = (state) => {

    // // // // console.log(state)


    if (Object.values(state).length === 2)
        return []

    return (
        (!_.isNil(Object.values(state)[INDEXDATATRANSAKSI]['data']['component']) && _.filter(Object.values(state)[INDEXDATATRANSAKSI]['data']['component'].map((v) => {
            return {
                label: v['prompt_eng'],
                tablecomponent: v['tablecomponent'],
                className: v['itemclass'],
                classRows: v['groupclasstype'],
                datatype: v['datatype'],
                type: v['datatype'],
                disabled: v['subitemname'],
                sourcetype: v['mod_code'],
                child_component: v['child_component'],
                iseditable: v['iseditable'],
                tableparentkey: v['tableparentkey'],
                textalign: v['textalign'],
                autonumber_param: v['autonumber_param'],
                lov_dependent_values: v["lov_dependent_values"],
                groupclassname: v["groupclassname"],
                is_child_key: v["is_child_key"],
                iconName: v["icon"],
                groupcomponent: v["groupcomponent"],
                formname: v["formname"]

            }
        }), (o) => { return (!_.isNull(o.tablecomponent)) }))

    )
}

// *get Table Dynamic Data Detail
export const trxKeys = () => {

    const states = store.getState()

    return _.pull(_.keys(states), 'auth', 'dashboard', 'businessintelligence')[0]

}
// *function get form component from redux state
export const getFormComponent = () => {

    const states = store.getState()

    //// // // // console.log('help c', Object.values(states)[INDEXDATATRANSAKSI]['data']['component'])
    try {
        return (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI])
            ? _.filter(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'].map((v) => {
                return {
                    key: v['formcomponent'],
                    label: v['prompt_eng'],
                    registername: v['formcomponent'],
                    isrequired: v['required'],
                    fieldtype: v['itemtype'],
                    className: v['itemclass'],
                    componenttype: v['groupcomponent'],
                    classRows: v['groupclasstype'],
                    grouprowsseq: v['groupclassseq'],
                    datatype: v['datatype'],
                    type: v['datatype'],
                    lovs: v['lovs'],
                    caltype: v["caltype"],
                    headerlabel: v['itemname'],
                    disabled: v['subitemname'],
                    maxSize: v['datatypelength'],
                    formtype: v['formtype'],
                    form_visibility: v['form_visibility'],
                    sourcetype: v['mod_code'],
                    lov_list_item: v['lov_list_item'],
                    lov_dependent: v['lov_dependent'],
                    child_component: v['child_component'],
                    iseditable: v['iseditable'],
                    lov_default_parameter: v['lov_default_parameter'],
                    isunique: v['isunique'],
                    default_value: v['default_value'],
                    datetransaction: v['datetransaction'],
                    tableparentkey: v['tableparentkey'],
                    footer: v['footer'],
                    formula: v['formula'],
                    textalign: v['textalign'],
                    autonumber_param: v['autonumber_param'],
                    sneak_peek: v['sneak_peek'],
                    lov_dependent_values: v["lov_dependent_values"],
                    groupclassname: v["groupclassname"],
                    is_child_key: v["is_child_key"],
                    iconName: v["icon"],
                    formname: v["formname"],
                    min_value: v["min_value"],
                    readonly: v["readonly"],
                    masterdetailtype: v["masterdetailtype"],
                    autoapprove: v["autoapprove"],
                    validation_status: v["validation_status"],
                    isinsert: v["isinsert"],
                    isupdate: v["isupdate"],
                    isdelete: v["isdelete"],
                    isapprove: v["isapprove"],
                    disabledcomponent: v["disabledcomponent"],
                    formversion: v["formversion"],
                    field_dependence: v["field_dependence"],
                    editstatus: v["editstatus"],
                    action: v["action"]
                }
            }), (o) => { return !_.isNull(o.registername) && o.formtype === 'FORM' }) : [])
    }
    catch (error) {
        return null
    }
}


export const filteringTable = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
 }

 export const filtering1 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentproduksiharian' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering2 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentproduksibulanan' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering3 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentyieldbyage' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering4 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentyieldpotensi' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}
 

export const filtering5 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'actbudget' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering6 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'actpot' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering7 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentproduksibulanandetail' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}




// *function get form component for list form, from redux state
export const getFormListComponent = (generatetype = 'SCHEMA') => {

    const states = store.getState()
    try {
        return (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI])
            ? _.filter(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'].map((v) => {
                return {
                    key: v['formcomponent'],
                    label: v['prompt_eng'],
                    registername: v['formcomponent'],
                    isrequired: v['required'],
                    fieldtype: v['itemtype'],
                    className: v['itemclass'],
                    classRows: v['groupclasstype'],
                    grouprowsseq: v['groupclassseq'],
                    datatype: v['datatype'],
                    type: v['itemtype'],
                    lovs: v['lovs'],
                    headerlabel: v['itemname'],
                    disabled: v['subitemname'],
                    maxSize: v['datatypelength'],
                    formtype: v['formtype'],
                    form_visibility: v['form_visibility'],
                    table_visibility: v['table_visibility'],
                    sourcetype: v['mod_code'],
                    lov_list_item: v['lov_list_item'],
                    lov_dependent: v['lov_dependent'],
                    child_component: v['child_component'],
                    iseditable: v['iseditable'],
                    isunique: v['isunique'],
                    default_value: v['default_value'],
                    datetransaction: v['datetransaction'],
                    tableparentkey: v['tableparentkey'],
                    footer: v['footer'],
                    formula: v['formula'],
                    textalign: v['textalign'],
                    autonumber_param: v['autonumber_param'],
                    sneak_peek: v['sneak_peek'],
                    lov_default_parameter: v['lov_default_parameter'],
                    lov_dependent_values: v["lov_dependent_values"],
                    groupclassname: v["groupclassname"],
                    is_child_key: v["is_child_key"],
                    iconName: v["icon"],
                    formname: v["formname"],
                    min_value: v["min_value"],
                    readonly: v["readonly"],
                    masterdetailtype: v["masterdetailtype"],
                    autoapprove: v["autoapprove"],
                    isinsert: v["isinsert"],
                    isupdate: v["isupdate"],
                    isdelete: v["isdelete"],
                    filterable: v["filterable"],
                    formversion: v["formversion"],
                    caltype: v["caltype"],
                    disabledcomponent: v["disabledcomponent"],
                    formversion: v["formversion"],
                    field_dependence: v["field_dependence"],
                    editstatus: v["editstatus"],
                    action: v["action"]
                }
            }), (o) => { return !_.isNull(o.registername) && o.formtype === ('GRID') }) : [])
    }
    catch (error) {
        return null
    }

}
export const getFilterComponent = (generatetype = 'SCHEMA') => {

    const states = store.getState()

    // // // // // console.log(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'])

    return (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI])
        ? _.filter(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'].map((v) => {
            return {
                key: v['formcomponent'],
                label: v['prompt_eng'],
                registername: v['formcomponent'],
                isrequired: v['required'],
                fieldtype: v['itemtype'],
                className: v['itemclass'],
                classRows: v['groupclasstype'],
                grouprowsseq: v['groupclassseq'],
                datatype: v['datatype'],
                type: v['itemtype'],
                lovs: v['lovs'],
                headerlabel: v['itemname'],
                disabled: v['subitemname'],
                maxSize: v['datatypelength'],
                formtype: v['formtype'],
                form_visibility: v['form_visibility'],
                table_visibility: v['table_visibility'],
                sourcetype: v['mod_code'],
                lov_list_item: v['lov_list_item'],
                lov_dependent: v['lov_dependent'],
                child_component: v['child_component'],
                iseditable: v['iseditable'],
                isunique: v['isunique'],
                default_value: v['default_value'],
                datetransaction: v['datetransaction'],
                tableparentkey: v['tableparentkey'],
                footer: v['footer'],
                formula: v['formula'],
                textalign: v['textalign'],
                autonumber_param: v['autonumber_param'],
                sneak_peek: v['sneak_peek'],
                lov_default_parameter: v['lov_default_parameter'],
                lov_dependent_values: v["lov_dependent_values"],
                groupclassname: v["groupclassname"],
                is_child_key: v["is_child_key"],
                iconName: v["icon"],
                formname: v["formname"],
                min_value: v["min_value"],
                readonly: v["readonly"],
                masterdetailtype: v["masterdetailtype"],
                autoapprove: v["autoapprove"],
                isinsert: v["isinsert"],
                isupdate: v["isupdate"],
                isdelete: v["isdelete"],
                filterable: v["filterable"],
                field_dependence: v["field_dependence"],
                editstatus: v["editstatus"],
                action: v["action"]
            }
        }), (o) => { return !_.isNull(o.registername) && o.formtype === ('FILTER') }) : [])
}


// *function get form component for list form, from redux state
export const getFormSubListComponent = (generatetype = 'SCHEMA') => {

    const states = store.getState()

    // // // // // console.log(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'])

    return (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI])
        ? _.filter(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'].map((v) => {
            return {
                key: v['formcomponent'],
                label: v['prompt_eng'],
                registername: v['formcomponent'],
                isrequired: v['required'],
                fieldtype: v['itemtype'],
                className: v['itemclass'],
                classRows: v['groupclasstype'],
                grouprowsseq: v['groupclassseq'],
                datatype: v['datatype'],
                type: v['itemtype'],
                lovs: v['lovs'],
                headerlabel: v['itemname'],
                disabled: v['subitemname'],
                maxSize: v['datatypelength'],
                formtype: v['formtype'],
                form_visibility: v['form_visibility'],
                table_visibility: v['table_visibility'],
                sourcetype: v['mod_code'],
                lov_list_item: v['lov_list_item'],
                lov_dependent: v['lov_dependent'],
                child_component: v['child_component'],
                iseditable: v['iseditable'],
                isunique: v['isunique'],
                default_value: v['default_value'],
                datetransaction: v['datetransaction'],
                tableparentkey: v['tableparentkey'],
                footer: v['footer'],
                formula: v['formula'],
                textalign: v['textalign'],
                autonumber_param: v['autonumber_param'],
                sneak_peek: v['sneak_peek'],
                lov_default_parameter: v['lov_default_parameter'],
                lov_dependent_values: v["lov_dependent_values"],
                groupclassname: v["groupclassname"],
                is_child_key: v["is_child_key"],
                iconName: v["icon"],
                formname: v["formname"],
                min_value: v["min_value"],
                readonly: v["readonly"],
                masterdetailtype: v["masterdetailtype"],
                autoapprove: v["autoapprove"],
                field_dependence: v["field_dependence"],
                editstatus: v["editstatus"],
                action: v["action"]
            }
        }), (o) => { return !_.isNull(o.registername) && o.formtype === ('GRID_SUB') }) : [])
}


export const getFormListComponentObj = () => {

    const states = store.getState()

    let val;

    val = (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI])
        ? _.filter(Object.values(states)[INDEXDATATRANSAKSI]['data']['component'].map((v) => {
            return {
                key: v['formcomponent'],
                label: v['prompt_eng'],
                registername: v['formcomponent'],
                isrequired: v['required'],
                fieldtype: v['itemtype'],
                className: v['itemclass'],
                classRows: v['groupclasstype'],
                grouprowsseq: v['groupclassseq'],
                datatype: v['datatype'],
                type: v['itemtype'],
                lovs: v['lovs'],
                disabled: v['subitemname'],
                maxSize: v['datatypelength'],
                formtype: v['formtype'],
                form_visibility: v['form_visibility'],
                sourcetype: v['mod_code'],
                lov_list_item: v['lov_list_item'],
                lov_dependent: v['lov_dependent'],
                child_component: v['child_component'],
                iseditable: v['iseditable'],
                isunique: v['isunique'],
                default_value: v['default_value'],
                datetransaction: v['datetransaction'],
                tableparentkey: v['tableparentkey'],
                footer: v['footer'],
                formula: v['formula'],
                textalign: v['textalign'],
                autonumber_param: v['autonumber_param'],
                sneak_peek: v['sneak_peek'],
                lov_dependent_values: v["lov_dependent_values"],
                groupclassname: v["groupclassname"],
                is_child_key: v["is_child_key"],
                iconName: v["icon"],
                formname: v["formname"],
                min_value: v["min_value"],
                readonly: v["readonly"],
                masterdetailtype: v["masterdetailtype"],
                autoapprove: v["autoapprove"],
                validation_status: v["validation_status"],
                disabledcomponent: v["disabledcomponent"],
                formversion: v["formversion"],
                field_dependence: v["field_dependence"],
                editstatus: v["editstatus"],
                action: v["action"]
            }
        }), (o) => { return !_.isNull(o.registername) && o.formtype === ('GRID') }) : [])

    return _.mapKeys(val, (v, k) => { return v['key'] })
}


// *return form data is dirty/changed or not
export const dirtyValues = (dirtyFields, allValues) => {
    // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
    // "placeholders" for unchanged elements. `dirtyFields` is true for leaves.
    if (dirtyFields === true || Array.isArray(dirtyFields))
        return allValues;
    // Here, we have an object
    return Object.fromEntries(Object.keys(dirtyFields).map(key => [
        key,
        dirtyValues(dirtyFields[key], allValues[key])
    ]));
}

// *key binding helpers
export const useKeyPress = (targetKey) => {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    //  // // // // console.log(targetKey)

    // If pressed key is our target key then set to true
    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount



    return keyPressed;
}

export const checkDuplicateRows = (array, field) => {
    let msg = ''


    const arry = _.map(array, (ar) => _.pick(ar, field))

    /* check if all object presents */
    //    // // // // console.log(_.some(arry, function (o) { return _.has(o, field) }))

    let skipped = _.map(arry, (e) => {
        return _.every(field, _.partial(_.has, e));
    });

    if (_.includes(skipped, false))
        return;


    const returnObjects = _.chain(arry)
        .groupBy((elem) => JSON.stringify(elem))
        .reduce((nObj, obj) => {
            // // // // // console.log(nObj, obj)
            if (obj.length > 1) nObj.push(_.head(obj));
            return nObj
        }, [])
        .value();

    // // // // console.log(returnObjects)

    if (returnObjects.length === 0)
        return;




    _.map(_.keys(_.pickBy(array, returnObjects[0])),
        (v, i) => {
            msg += (i > 0 && ",") + (_.toNumber(v))
        }
    )

    return msg
}

// *set YUP validation Object
export const FormDefaultValidation = ({ lovs, registername, fieldtype, datatype, maxSize, isrequired,
    lov_default_parameter, lov_dependent, lov_list_item,
    default_value, formname, min_value, sourcetype, validation_status, datetransaction }) => {
    /** Objective --> create object to validating forms values
     * 
     */
    let retval = {}

    const state = store.getState()

    const periode = state.auth.tableDynamicControl.dateperiode

    if (fieldtype === 'inputsearch') {
        const obj = {}
        let code = {}
        let description = {}
        let vcode = []

        code = yup.string().nullable()
        description = yup.string().nullable()


        if (isrequired === 'true') {
            code = code.required('Required');
            //description = description.required('Required');

        }

        if (_.isEmpty(lov_list_item)) {
            vcode[0] = 'code'
            vcode[1] = 'description'
        }
        else {
            vcode = lov_list_item.split(';')
        }
        retval = yup.object()
            .shape({
                [vcode[0]]: code,
                [vcode[1]]: description
            }).nullable()
    }

    else if (fieldtype.match(/^(inputdate|inputtime|inputdatesimple|inputdatesimpleold|inputtimeold)$/)) {
        retval = yup.date().nullable()

        if (validation_status !== 'invalidated') {
            if (fieldtype.match(/^(inputdate|inputdatesimple)$/)
                && registername !== 'inactivedate' && registername !== 'expectdate' && registername !== 'transactiondate'
                && formname !== 'LPO' && formname !== 'LPR' && formname !== 'LPRDETAILS' && formname !== 'HR_HIST_STAFF' && formname !== 'HR_FAMILY' && formname !== 'HR_TERMINATION'
                && formname !== 'PAYMENTVOUCHER' /*&& formname !== 'RECEIVEVOUCHER'*/ && formname !== 'VEHICLE' && formname !== 'INFRASTRUCTURE'
                && (formname !== 'CONTRACTREQUEST' && registername !== 'agreementdate' && formname !== 'CONTRACTREQUESTDETAIL') && datetransaction === 'true'
                && (formname !== 'HR_MEDICAL_INT' && formname !== 'HR_MEDICAL_INT_DETAIL')) {
                retval = retval.transform(parseDateString).test('period check', (_, val) => {
                    //       // // // // console.log('test error ', val)

                    //if (!_.isUndefined(v)) {
                    // }
                    if (monthDiff(val.originalValue, dateFormat(periode)) >= 1)
                        return val.createError({ path: val.path, message: 'Period is closed' })

                    return true
                })
            }
        }
    }
    else {
        switch (datatype) {
            case ORA_NUMBER:
                if (registername !== 'totaltransactionviewdisplayonly' && registername !== 'endingbalanceviewdisplayonly' && registername !== 'openingbalanceviewdisplayonly') {
                    retval = yup.number().moreThan(min_value).lessThan(Math.pow(maxSize, 9)).nullable(true).transform((_, val) => val === Number(val) ? val : null)
                    break
                }
            default:
                retval = yup.string().max(maxSize).nullable() //(_.isEmpty(default_value) ? yup.string().max(maxSize).nullable() : yup.string().max(maxSize).nullable().default(default_value))
        }
    }

    if (isrequired === 'true') {
        retval = retval.required('Required');
    }



    if (fieldtype === 'inputselect') {
        if (lov_dependent === 'userid') {
            lov_dependent = UserInfo().loginid
        } else if (lov_dependent === 'empcode') {
            lov_dependent = UserInfo().empcode
        } else if (lov_dependent === 'sysdate') {
            lov_dependent = dateFormat(new Date(), 'dd/mm/yyyy')
        }

        store.dispatch(populateList(lovs, registername, _.isEmpty(lov_default_parameter) ? '' : lov_default_parameter, lov_dependent))
    }


    //// // console.log(retval)
    return retval
}


export const InitValidation = async (cr, cb) => {
    let FormComps = getFormComponent()
    let _validationSchema = {}, _defaultValue = {}



    FormComps = _.mapKeys(FormComps, 'key')

    await store.dispatch({ type: ACTION_LABEL, payload: (cr.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE) })
    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: {} })


    for (var key of Object.keys(FormComps)) {
        // !Set Validasi Default
        _validationSchema[key] = FormDefaultValidation(FormComps[key])

        if (!_.isEmpty(FormComps[key].default_value))
            _defaultValue[key] = FormComps[key].default_value

    }
    // // console.log(_validationSchema)


    yup.addMethod(yup.array, 'checkUnique', function (fields) {
        return this.test('unique', '', function (array, field) {
            // // // // console.log(array)
            let msg = checkDuplicateRows(array, fields, field)
            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });
    });



    await store.dispatch({ type: SET_DEFAULT_VALUE, payload: _defaultValue })

    _validationSchema = yup.object().shape({ ..._validationSchema })
    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: _validationSchema })

    //   // // console.log(_validationSchema)

    if (cb)
        cb(_validationSchema)

}

export const InitValidationList = async (cr, cb) => {

    let FormComps = getFormListComponent()
    let filterComps = getFilterComponent()
    let _validationSchema = {}, _defaultValue = {}


    FormComps = _.mapKeys(FormComps, 'key')



    await store.dispatch({ type: ACTION_LABEL, payload: (cr.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE) })
    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: {} })
    //    // // // // console.log('form', _.keys(_.pickBy(FormComps, (x) => { return x.isunique })))

    for (var key of Object.keys(FormComps)) {
        //// // // // console.log(FormComps[key])
        let _values;
        // !Set Validasi Default
        _validationSchema[key] = FormDefaultValidation(FormComps[key])

        if (!_.isEmpty(FormComps[key].default_value)) {
            _values = FormComps[key].default_value
            if (_values === 'userid') {
                _values = UserInfo().loginid
            } else if (_values === 'sysdate') {
                _values = new Date()
            }
            _defaultValue[key] = _values === 'null' ? '' : _values
        }

    }
    for (var key of Object.keys(filterComps)) {
        //// // // // console.log(FormComps[key])
        let _values;
        // !Set Validasi Default
        _validationSchema[key] = FormDefaultValidation(filterComps[key])

        if (!_.isEmpty(filterComps[key].default_value)) {
            _values = filterComps[key].default_value
            if (_values === 'userid') {
                _values = UserInfo().loginid
            } else if (_values === 'sysdate') {
                _values = new Date()
            }
            _defaultValue[key] = _values === 'null' ? '' : _values
        }

    }

    yup.addMethod(yup.array, 'checkUnique', function (fields) {

        //  // // // console.log(fields)

        return this.test('unique', '', function (array, field) {

            // // // console.log(array)

            let msg = checkDuplicateRows(array, fields, field)

            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });

    });
    // // // // console.log(_defaultValue)

    await store.dispatch({ type: SET_DEFAULT_VALUE, payload: _defaultValue })

    if (_.size(_.keys(_.pickBy(FormComps, (x) => { return x.isunique === 'true' }))) === 0) {
        _validationSchema = yup.object().shape({ inputgrid: yup.array().of(yup.object().shape({ ..._validationSchema })) })
    }
    else {
        _validationSchema = yup.object().shape({ inputgrid: yup.array().of(yup.object().shape({ ..._validationSchema })).checkUnique(_.keys(_.pickBy(FormComps, (x) => { return x.isunique === 'true' }))) })
    }

    /*   await store.dispatch({
          type: SET_VALIDATION_SCHEMA, payload: yup.object().shape(
              {
                  inputgrid: yup.array()
                      .of(yup.object().shape({ ..._validationSchema }))
                      .checkUnique(_.keys(_.pickBy(FormComps, (x) => { return x.isunique })))
              })
      }) */

    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: _validationSchema })

    if (cb)
        cb(_validationSchema)

}


export const InitValidationMixed = async (cr, callback) => {
    let FormMaster = getFormComponent()
    let FormDetail = getFormListComponent()

    let _validationSchema = {}, _validationSchemaHeader = {}, _validationSchemaDetail = {}, _defaultValue = {}

    await store.dispatch({ type: ACTION_LABEL, payload: (cr.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE) })
    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: {} })


    FormMaster = _.mapKeys(FormMaster, 'key')
    FormDetail = _.mapKeys(FormDetail, 'key')

    //    // // console.log('test')


    for (var key of Object.keys(FormMaster)) {
        let _values;
        // !Set Validasi Default
        _validationSchemaHeader[key] = FormDefaultValidation(FormMaster[key])
        /* 
                if (!_.isEmpty(FormMaster[key].default_value))
                    _defaultValue[key] = FormMaster[key].default_value */

        // // // console.log(FormMaster[key])

        if (!_.isEmpty(FormMaster[key].default_value)) {
            _values = FormMaster[key].default_value

            if (_values === 'userid') {
                _values = UserInfo().loginid
            } else if (_values === 'sysdate') {
                _values = new Date()
            }

            if (FormMaster[key].fieldtype === 'inputcheckbox') {
                //                // // console.log(_values)
                _defaultValue[key] = _.split(_values, ';')[0];// === 'null' ? '' : _values

            }
            else {
                _defaultValue[key] = _values === 'null' ? '' : _values
            }


        }

    }

    // // // console.log(_defaultValue)

    for (var keys of Object.keys(FormDetail)) {
        // !Set Validasi Default
        _validationSchemaDetail[keys] = FormDefaultValidation(FormDetail[keys])
    }

    yup.addMethod(yup.array, 'checkUnique', function (fields) {
        return this.test('unique', '', function (array, field) {

            //  // // // // console.log(array)

            let msg = checkDuplicateRows(array, fields, field)

            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });
    });



    await store.dispatch({ type: SET_DEFAULT_VALUE, payload: _defaultValue })

    //// // // console.log(_.keys(_.pickBy(FormDetail, (x) => { return x.isunique === 'true' })))

    // // // console.log(_validationSchemaHeader)

    _validationSchema = yup.object().shape({ ..._validationSchemaHeader })

    if (_.size(_.keys(_.pickBy(FormDetail, (x) => { return x.isunique === 'true' }))) === 0) {
        _validationSchema = _validationSchema.concat(yup.object().shape({ inputgrid: yup.array().of(yup.object().shape({ ..._validationSchemaDetail })) }))

    } else {
        _validationSchema = _validationSchema.concat(yup.object().shape({
            inputgrid: yup.array().of(yup.object().shape({ ..._validationSchemaDetail }))
                .checkUnique(_.keys(_.pickBy(FormDetail, (x) => { return x.isunique === 'true' })))
        }))

    }

    //// console.log('z', _validationSchema)

    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: _validationSchema })



    if (callback)
        callback(_validationSchema)

}

export const InitValidationMixedSub = async (cr, callback) => {
    let FormMaster = getFormComponent()
    let FormDetail = getFormListComponent()
    let FormSubDetail = getFormSubListComponent()

    let _validationSchema = {}, _validationSchemaHeader = {}, _validationSchemaDetail = {}, _defaultValue = {}, _validationSchemaDSubetail = {}

    await store.dispatch({ type: ACTION_LABEL, payload: (cr.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE) })
    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: {} })


    FormMaster = _.mapKeys(FormMaster, 'key')
    FormDetail = _.mapKeys(FormDetail, 'key')
    FormSubDetail = _.mapKeys(FormSubDetail, 'key')

    /* // console.log('m', FormMaster)
    // console.log('d', FormDetail)
    // console.log('s', FormSubDetail)
 */
    for (var key of Object.keys(FormMaster)) {
        let _values;
        // !Set Validasi Default
        _validationSchemaHeader[key] = FormDefaultValidation(FormMaster[key])
        /* 
                if (!_.isEmpty(FormMaster[key].default_value))
                    _defaultValue[key] = FormMaster[key].default_value */

        // // // console.log(FormMaster[key])

        if (!_.isEmpty(FormMaster[key].default_value)) {
            _values = FormMaster[key].default_value

            if (_values === 'userid') {
                _values = UserInfo().loginid
            } else if (_values === 'sysdate') {
                _values = new Date()
            }

            if (FormMaster[key].fieldtype === 'inputcheckbox') {
                //                // // console.log(_values)
                _defaultValue[key] = _.split(_values, ';')[0];// === 'null' ? '' : _values

            }
            else {
                _defaultValue[key] = _values === 'null' ? '' : _values
            }


        }

    }

    for (var keys of Object.keys(FormDetail)) {
        // !Set Validasi Default
        _validationSchemaDetail[keys] = FormDefaultValidation(FormDetail[keys])
    }




    yup.addMethod(yup.array, 'checkUnique', function (fields) {
        return this.test('unique', '', function (array, field) {
            let msg = checkDuplicateRows(array, fields, field)

            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });
    });

    for (var keys of Object.keys(FormSubDetail)) {
        // !Set Validasi Default
        _validationSchemaDSubetail[keys] = FormDefaultValidation(FormSubDetail[keys])
    }



    if (!_.isEmpty(FormSubDetail)) {
        _validationSchemaDetail = yup.object().shape({ ..._validationSchemaDetail })


        _validationSchemaDetail = _validationSchemaDetail.concat(yup.object().shape({ inputgriddetail: yup.array().of(yup.object().shape({ ..._validationSchemaDSubetail })) }))
    }



    await store.dispatch({ type: SET_DEFAULT_VALUE, payload: _defaultValue })

    _validationSchema = yup.object().shape({ ..._validationSchemaHeader })

    if (_.size(_.keys(_.pickBy(FormDetail, (x) => { return x.isunique === 'true' }))) === 0) {

        //        _validationSchema = _validationSchema.concat(yup.object().shape({ inputgrid: yup.array().of(yup.object().shape({ ..._validationSchemaDetail })) }))
        _validationSchema = _validationSchema.concat(yup.object().shape({ inputgrid: yup.array().of(_validationSchemaDetail) }))

    } else {
        _validationSchema = _validationSchema.concat(yup.object().shape({
            inputgrid: yup.array().of(yup.object().shape({ ..._validationSchemaDetail }))
                .checkUnique(_.keys(_.pickBy(FormDetail, (x) => { return x.isunique === 'true' })))
        }))

    }

    //// console.log('z', _validationSchema)

    await store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: _validationSchema })



    if (callback)
        callback(_validationSchema)

}

export const InitDefaultValues = () => {
    let FormMaster = getFormComponent()
    let _defaultValue = {}
    let title


    const headerlabel = _.filter(FormMaster, ['headerlabel', 'DOCUMENT_HEADER'])


    if (!_.isEmpty(headerlabel)) {
        title = getFormTitle(`${headerlabel[0].key} : `)

    } else {
        title = getFormTitle(`${!_.isEmpty(FormMaster) && _.filter(FormMaster, ['tableparentkey', 'true'])[0]['label']} : `)

    }


    store.dispatch({ type: SET_DEFAULT_VALUE, payload: {} })

    store.dispatch({ type: DOCUMENT_TITLE, payload: title })

    FormMaster = _.mapKeys(FormMaster, 'key')

    for (var key of Object.keys(FormMaster)) {
        // !Set Validasi Default
        //      _validationSchemaHeader[key] = FormDefaultValidation(FormMaster[key])
        let _values

        if (!_.isEmpty(FormMaster[key].default_value)) {
            _values = FormMaster[key].default_value

            //   // // // console.log(FormMaster[key].datatype)
            if (FormMaster[key].fieldtype == 'file') {
                _values = 'null'
            }
            if (FormMaster[key].fieldtype == 'inputcamera') {
                _values = 'null'
            }
            if (_values === 'userid') {
                _values = UserInfo().loginid
            } else if (_values === 'empcode') {
                _values = UserInfo().empcode
            } else if (_values === 'empname') {
                _values = UserInfo().empname
            } else if (_values === 'jabatan') {
                _values = UserInfo().jabatan
            } else if (_values === 'divisi') {
                _values = UserInfo().divisi
            } else if (_values === 'department') {
                _values = UserInfo().department
            } else if (_values === 'sysdate') {
                _values = new Date()
            }


            if (FormMaster[key].datatype === ORA_NUMBER) {
                _values = parseNumber(_values)
            }


            if (FormMaster[key].fieldtype === 'inputcheckbox') {
                //                // // console.log(_values)
                _defaultValue[key] = _.split(_values, ';')[0];// === 'null' ? '' : _values

            }
            else {
                _defaultValue[key] = _values === 'null' ? '' : _values
            }

        }
    }

    //  // // // console.log(_defaultValue)

    store.dispatch({ type: SET_DEFAULT_VALUE, payload: _defaultValue })
}

export const InitDefaultValuesGrid = () => {
    let FormMaster = getFormListComponent()
    let _defaultValue = {}

    // // // // // console.log(_.filter(FormMaster, ['tableparentkey', 'true'])[0]['label'])

    //  // // // // console.log(FormMaster)

    //    // // // // console.log(_.filter(FormMaster, ['tableparentkey', 'true'])[0]['label'])

    let title = getFormTitle(`${!_.isEmpty(FormMaster) && _.filter(FormMaster, ['tableparentkey', 'true'])[0]['label']} : `) + ''

    store.dispatch({ type: SET_DEFAULT_VALUE, payload: {} })

    store.dispatch({ type: DOCUMENT_TITLE, payload: title })

    FormMaster = _.mapKeys(FormMaster, 'key')

    for (var key of Object.keys(FormMaster)) {
        // !Set Validasi Default
        //      _validationSchemaHeader[key] = FormDefaultValidation(FormMaster[key])
        let _values

        if (!_.isEmpty(FormMaster[key].default_value)) {
            _values = FormMaster[key].default_value
            if (_values === 'userid') {
                _values = UserInfo().loginid
            } else if (_values === 'sysdate') {
                _values = new Date()
            }
            _defaultValue[key] = _values === 'null' ? '' : _values
        }
    }


    store.dispatch({ type: SET_DEFAULT_VALUE, payload: _defaultValue })
}


// *get Table Dynamic Page Index
export const QueryPageIndexes = (v) => {
    return Object.values(v)[0]['tableDynamicControl']['page']
}

// *get Table Dynamic Page Size
export const QueryPageSizes = (v) => {
    return Object.values(v)[0]['tableDynamicControl']['size']
}

// *table dynamic query search helper
export const QuerySearch = (v) => {
    return Object.values(v)[0]['tableDynamicControl']['search']
}

// *table dynamic query search helper
export const QuerySearch2 = (v) => {
    return Object.values(v)[0]['tableDynamicControl']['search2']
}

// *table dynamic dateperiode selector
export const QueryDatePeriode = (v) => {
    const s = store.getState()

    const date = (Object.values(s)[0]['tableDynamicControl']['dateperiode'] === Date.parse(!_.isEmpty(Object.values(store.getState())[INDEXDATATRANSAKSI]) ?
        dateFormat(_.get(_.filter(Object.values(store.getState())[INDEXDATATRANSAKSI]['data']['component'])[0], 'startdate'), 'dd/mm/yyyy') : [])
        ? Object.values(s)[0]['tableDynamicControl']['dateperiode'] : Object.values(s)[0]['tableDynamicControl']['dateperiode'])

    return date

}
export const QueryDatePeriodeNow = (v) => {
    const s = store.getState()
    let date = Object.values(s)[0]['tableDynamicControl']['dateperiodenow']
    // // console.log(date)
    return date

}

// *get Table Dynamic Page Count
export const QueryPageCount = (v) => {
    return (!_.isNil(Object.values(v)[INDEXDATATRANSAKSI]) ? Object.values(v)[INDEXDATATRANSAKSI]['pageCount'] : 0)
}

// *get Table Dynamic Data
export const QueryData = (v) => {
    return (!_.isNil(Object.values(v)[INDEXDATATRANSAKSI]) ? _.filter(Object.values(v)[INDEXDATATRANSAKSI]['data']) : [])
}


// *get Table Dynamic Data
export const IsInsert = (v) => {
    return _.get(_.find(v[1]), 'isinsert')
}

// *get Table Dynamic Data
export const TransactionModuleError = () => {
    const v = store.getState()

    return (!_.isNil(Object.values(v)[INDEXDATATRANSAKSI]) ? _.filter(Object.values(v)[INDEXDATATRANSAKSI]['module_error']) : [])
}


// *get Table Dynamic Data Detail
export const QueryDataDetail = () => {

    const states = store.getState()

    return (!_.isNil(Object.values(states)[INDEXDATATRANSAKSI]) ? _.filter(Object.values(states)[INDEXDATATRANSAKSI]['datadetail']) : [])
}


// *get Table Dynamic Data Detail
export const getFilterDateTrx = (v) => {

    const states = store.getState()

    if (v === 'array') {
        return states[trxKeys()].datelist
    }
    else if (v === 'single') {
        return states[trxKeys()].datefilterone
    } else {
        return states[trxKeys()].datefiltertwo
    }

}


// *get Table Dynamic Data
export const getData = (_type) => {
    const v = store.getState()

    return (!_.isNil(Object.values(v)[INDEXDATATRANSAKSI]) ? _.filter(Object.values(v)[INDEXDATATRANSAKSI][_type]) : null)
}

// *get Table Dynamic Data Detail
export const isFilterDateLimited = () => {
    const states = store.getState()

    return states[trxKeys()].datelimit
}

// *get Table Dynamic Data Concat
export const QueryDataConcat = (v) => {
    const dataclean =
        _.map(v, (data) => {
            // // // // // console.log(v)
            return _.mapValues(data, (value, key) => {


                if (value instanceof Object) {
                    let stringVal = ''
                    _.map(Object.keys(key), (z, i) => {
                        stringVal += (i > 0 ? ' - ' : '') + value[z]
                    })
                    return stringVal;
                }

                return value
            })
        }
        )
    // // // // console.log(dataclean)
    return dataclean
}

// *get reducer ID
export const QueryReducerID = (v) => {
    return Object.keys(v)[INDEXDATATRANSAKSI]
}

// *get reducer ID
export const getLoadingStatus = (v) => {
    return v.auth.loadingstatus
}

// *get Action Value from Redux State
export const ActionHelpers = (v) => {
    return v.auth.modals.actionpick
}

// *get LOV data from Redux State
export const LovDataSelected = (v) => {
    let retVal = {}
    try {
        retVal = v.auth.temporarydata
    } catch (error) {
        return {}
    }

    return retVal
}

// *get Selected data from Redux State
export const QuerySelectedData = (v) => {
    return v.auth.modals.selectedValue
}

// *get Title Form
export const getTitleFromComponent = (v) => {

    try {

        // // console.log('gettitle', v[1])

        // console.log('data', v)

        let retVal = (_.isUndefined(v) ? '' : _.find(v, { 'itemname': 'TITLE' })['prompt_ina'])


        return retVal
    } catch (error) {
        //  console.log('data', error)

        return ''
    }
}

// *get Title Form
export const getTitle = (v) => {

    try {


        let retVal = (_.isUndefined(v[1]) ? '' : _.find(v[1], { 'itemname': 'TITLE' })['prompt_ina'])

        return retVal
    } catch (error) {
        return ''
    }
}

// *get Title Details
export const getTitleDetail = () => {

    const st = store.getState()

    const v = QueryData(st)

    let retVal = (_.isUndefined(v[1]) ? '' : _.find(v[1], { 'itemname': 'TITLE_MODALS_DETAIL' })['prompt_ina'])


    try {
        return retVal
    } catch (error) {
        return ''
    }
}

export const getTitleView = () => {
    const v = QueryData(store.getState())

    try {
        let retVal = (_.isUndefined(v[1]) ? '' : _.find(v[1], { 'groupcomponent': 'titlecomponentview' })['prompt_ina'])

        return retVal
    } catch (error) {
        return ''
    }
}
export const getTitleViewDetail = () => {
    const v = QueryData(store.getState())

    try {
        let retVal = (_.isUndefined(v[1]) ? '' : _.find(v[1], { 'groupcomponent': 'titlecomponentviewdetail' })['prompt_ina'])
        return retVal
    } catch (error) {
        return ''
    }
}

// *get Table Column Form
export const getColumn = (v) => {
    // console.log(v)

    // // // // // console.log('hehe',_.filter(_.filter(v[1],(o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' }))
    return _.filter(_.filter(v[1], (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
}
// *get Table Column Detail Form
export const getColumnDetail = (v) => {
    return _.filter(_.filter(v[1], (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentdetail' })
}

// *get Table Column Form
export const getColumnLink = () => {
    const v = QueryData(store.getState())

    return _.filter(_.filter(v[1], (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentlink' })
}

// *get Table Column Form
export const getColumnLinkDetail = () => {
    const v = QueryData(store.getState())

    return _.filter(_.filter(v[1], (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentlinkdetail' })
}

// *get Table Column Form
export const getColumnView = () => {
    const v = QueryData(store.getState())

    return _.filter(_.filter(v[1], (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentview' })
}

// *get Table Column Form
export const getColumnViewDetail = () => {
    const v = QueryData(store.getState())


    return _.filter(_.filter(v[1], (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentviewdetail' })
}

export const HeaderCol = ({ source, val, _date, listener }) => {
    let v_return, s_source, linkval, linkOnDetail

    // step check - 
    // *1. if contains ** then ** is replaced
    // *2. if contains LINKTO then changed to hyperlink

    //1
    s_source = _.replace(source, '**', '')

    //2
    linkval = _.includes(source, 'LINKTO_')

    //3
    linkOnDetail = _.includes(source, 'LINKD_')


    if (linkval) {
        source = _.replace(source, 'LINKTO_', '')
    }

    if (linkOnDetail) {
        source = _.replace(source, 'LINKD_', '')
    }


    switch (s_source) {
        case PARAM_DATE:
            v_return = val
            break;
        case PARAM_TM:
            v_return = 'Bulan Berjalan'
            break;
        case PARAM_CM:
            v_return = 'Bulan Ini'
            break;
        case PARAM_LM:
            v_return = 'Bulan Lalu'
            break;
        case PARAM_TW:
            v_return = 'Minggu Ini'
            break;
        case PARAM_TD:
            v_return = 'Tahun Berjalan'
            break;
        case PARAM_TD:
            v_return = 'Tahun Berjalan'
            break;
        case P_MONTH:

            const thisMonth = pickDatetoString(_date, 'SHORTMONTH')

            v_return = source.replace(s_source, thisMonth)
            break;
        case P_LASTMONTH:
        case P_LASTMONTH_NAME:

            const ldate = new Date(_date)
            const currentyear = ldate.getFullYear()

            ldate.setMonth(ldate.getMonth() - 1)
            const lastmonthyear = ldate.getFullYear()

            let lastMonth

            if (currentyear !== lastmonthyear) {
                lastMonth = `${pickDatetoString(ldate, 'SHORTMONTH')} - ${ldate.getFullYear()}`

            } else {
                lastMonth = `${pickDatetoString(ldate, 'SHORTMONTH')}`
            }

            v_return = lastMonth
            break;

        default:
            v_return = source
            break;

    }

    if (linkval) {

        const param = {
            key: source.substr(0, source.indexOf("@")),
            val: source.substr(source.indexOf("@") + 1)
        }

        return <a href='#' onClick={() => listener(param)} >{param.val}</a>
    }
    else {

        let v = _.split(v_return, ';')

        //  console.log(v_return, _.size(v))

        if (_.size(v) > 1) {
            return _.map(v, (x, ix) => <div key={`h${ix}`}> {x} <br /></div >)
        } else {
            return v_return
        }

    }

}

// *key binding helpers
export const useAllKeysPress = (options) => {
    // Check that 'options' is an object.
    if (!options || Object.keys(options).length === 0) {
        throw new Error(`No object parameter found use: {userKeys: ... } `);
    }

    // 'options' properties.
    const userKeys = options.userKeys || null;
    const order = options.order || false;
    const ref = options.ref || window;

    // React hooks.
    const [keyPress, setKeyPress] = useState(false);
    const [anyKeyPressed, setAnyKeyPressed] = useState([]); // new with arrays

    // A reference to determine if a key has been pressed already.
    const prevKey = useRef("");

    const settings = {
        type: null,
        objRef: ref,
        downHandler: undefined,
        upHandler: undefined,
        useEffect: null,
        output: null
    };

    const setData = (settings) => {
        // Check that we have a 'userKey'  property
        if (userKeys) {
            // Check if the Object is a string, if so add the 'singleKey' properties to
            // 'option' object.
            if (typeof userKeys === "string") {
                settings.output = keyPress;
                settings.downHandler = downHandler;
                settings.upHandler = upHandler;
                settings.useEffect = Init;
                settings.type = "STRING";
            }
            // Check if the Object is an array, if so add the 'multiKeys' properties to
            // 'option' object.
            if (Array.isArray(userKeys)) {
                settings.output = areKeysPressed(userKeys, anyKeyPressed);
                settings.downHandler = downMultiHandler;
                settings.upHandler = upMultiHandler;
                settings.useEffect = Init;
                settings.type = "ARRAY";
            }
            if (Number.isInteger(userKeys)) {
                throw new Error(
                    `Invalid 'userKeys' property: must be {userKeys:'KEY'} or {userKeys:[KEY, ...]}`
                );
            }
        } else {
            throw new Error(
                `Invalid 'userKeys' property: must be {userKeys:'KEY'} or {userKeys:[KEY, ...]}`
            );
        }

        return settings;
    };

    const downHandler = ({ key }) => {
        // Escape this function if these two values match
        // (proof the key has already been pressed).
        if (prevKey.current === userKeys) return;
        if (key === userKeys) {
            setKeyPress(true);
            // set prevKey for future reference.
            prevKey.current = key;
        }
    };

    const upHandler = ({ key }) => {
        if (key === userKeys) {
            setKeyPress(false);
            // reset the value of prevKey
            prevKey.current = "";
        }
    };

    const downMultiHandler = ({ key, repeat }) => {
        // NOTE: prevents double key entry in array
        if (repeat) return;

        setAnyKeyPressed((prevState) => [...prevState, key]);
    };

    const upMultiHandler = ({ key }) => {
        // NOTE: Needed to call on set state again due to how state works.
        // Otherwise would need for the function to dismount and remount which is not wanted.
        setAnyKeyPressed((prevState) => [...prevState]);
        setAnyKeyPressed((prevState) => [
            ...prevState.filter((item) => item !== key)
        ]);
    };

    const areKeysPressed = (keys = [], Pressed = []) => {
        // Create a new Array
        const required = [...keys];

        // Return an array which does not have matching items of
        // 'Pressed'
        const anyOrder = required.filter((itemA) => {
            return !Pressed.some((itemB) => itemB === itemA);
        });

        // Check that 'keys' and 'Pressed' match and that the input
        // entries of 'Pressed' are identically in order.
        const inOrder =
            required.length === Pressed.length &&
            required.every((value, index) => {
                return value === Pressed[index];
            });

        let result;

        // If 'order' has not been set use the 'anyOrder' calculation.
        // otherwise use the 'inOrder' calculation.
        !order ? (result = anyOrder.length === 0) : (result = inOrder);

        return result;
    };

    function Init() {
        useEffect(() => {
            // If 'ref' after initialisation has the property of 'current' then it refers
            // to a referenced element in which case 'element' should refer to THIS.
            // Otherwise proceed with the default state (the window object).
            const element = ref.current ? ref.current : ref;

            // Add event listeners
            element.addEventListener("keydown", settings.downHandler);
            element.addEventListener("keyup", settings.upHandler);
            //// // // // console.log('useAllKeyPress - hookAsMount');
            return () => {
                element.removeEventListener("keydown", settings.downHandler);
                element.removeEventListener("keyup", settings.upHandler);
                //// // // // console.log('useAllKeyPress - hookAsUnmount');
            };
        }, []); // Empty array ensures that effect is only run on mount and unmount
    }

    /**
     * Configure 'settings' object.
     */
    setData(settings);

    /**
     * Initialise the event listeners
     */
    settings.useEffect();

    /**
     * Returns a 'boolean' value from keyboard inputs
     */
    return settings.output;
}

// *get Data to Update from redux state
export const getEditableData = (st) => {
    let editData = st.auth.datatoedit

    return editData;
}

// *get Title Form
export const getFormTitle = (extra) => {

    const st = store.getState();

    const trx = Object.values(st)[INDEXDATATRANSAKSI]

    let titles = ''
    try {
        titles = _.find(trx.data.component, { 'itemname': 'TITLE' })['prompt_ina']
    } catch (error) {

    }

    titles = `${titles} - ${extra}`

    return titles
}



export const getDocTitle = (extra) => {

    const st = store.getState();
    //// // // // console.log(st)

    const trx = st.auth.documentTitle



    // titles = trx

    return trx
}

export const keyLabel = () => {
    let FormMaster = getFormComponent()
    let val = ''
    try {
        val = _.filter(FormMaster, ['tableparentkey', 'true'])[0]['label']

    } catch (error) {
        val = ''
    }
    return val
}


// *get Title Form
export const GetDefaultValue = () => {

    const st = store.getState();


    return st.auth.formDefaultValue
}

export const UniquePropertyTests = (value, propertyName, message) => {

    return yup.addMethod(yup.array, 'UniquePropertyTest', function (field, message) {
        return this.test('unique', message, function (array) {

            const uniqueData = Array.from(
                new Set(array.map((row) => row[field]?.toLowerCase())),
            );

            const isUnique = array.length === uniqueData.length;

            if (isUnique) {
                return true;
            }

            const index = array.findIndex(
                (row, i) => row[field]?.toLowerCase() !== uniqueData[i],
            );

            if (array[index][field] === '') {
                return true;
            }

            return this.createError({
                path: `${this.path}.${index}.${field}`,
                message,
            });
        });
    })
}

// *binding YUP validation resolver 
export const useYupValidationResolver = validationSchema =>
    useCallback(
        async data => {
            try {
                const values = await validationSchema.validate(data, {
                    abortEarly: false
                });
                return {
                    values,
                    errors: {}
                };
            } catch (errors) {

                // // console.log('validation error ', errors)

                /*     // // // // console.log(errors.inner.reduce(
                        (allErrors, currentError) => ({
                            ...allErrors,
                            [currentError.path]: {
                                type: currentError.type ?? "validation",
                                message: currentError.message
                            }
                        }),
                        {}
                    )) */
                if (_.isUndefined(errors.inner))
                    return null

                return {
                    values: {},
                    errors: errors.inner.reduce(
                        (allErrors, currentError) => ({
                            ...allErrors,
                            [currentError.path]: {
                                type: currentError.type ?? "validation",
                                message: currentError.message
                            }
                        }),
                        {}
                    )
                };
            }
        },
        [validationSchema]
    );




// *key binding helpers
export const canEdit = (name) => {
    return name;
}



export const FormatDate = date => {
    // // // // // console.log('format', date)

    if (!date) return;


    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();


    return [day, month, year].join("/");

};

export const clearCacheData = () => {
    // // // // console.log(caches)
    caches.keys().then((names) => {
        // // // // console.log(names)
        names.forEach((name) => {
            caches.delete(name);
        });
    });
    // alert('Complete Cache Cleared')
};

export const RenderError = (meta) => {

    if (meta.touched && meta.error) {
        return (
            <Message error floating size="mini">
                <Message.Header>{meta.error}</Message.Header>
            </Message>
        );
    }
};

export const processEditData = async (val) => {
    const data = QueryData(store.getState())

    let datas = _.cloneDeep(data);



    let datatransaction = _.filter(datas[0], (x) => { return x.rowid === val.original.rowid })[0]

    const inputIsObjects = _.filter(datas[1], (x) => { return x.itemtype.match(/^(inputdate|inputdatesimple|inputtime|inputdatesimpleold|inputtimeold)$/) })



    _.mapKeys(datatransaction, (k, v) => {


        const arr = _.filter(inputIsObjects, (z) => { return z.formcomponent === v })[0]


        if (_.isUndefined(arr))
            return;



        let value = _.get(datatransaction, v)

        if (arr.itemtype.match(/^(inputdatesimple|inputdate|inputdatesimpleold)$/) && !_.isEmpty(value)) {
            if (value.match(':')) {

                const [dates, hours] = value.split(" ")
                //      // // // // console.log(dates, hours)

                const [day, month, year] = dates.split("-")
                const [hour, minute] = dates.split("-")

                datatransaction[v] = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
            }
            else {
                const [day, month, year] = value.split("-")
                datatransaction[v] = new Date(Number(year), Number(month) - 1, Number(day))

            }

        } else if (arr.itemtype.match(/^(inputtime|inputtimeold)$/) && !_.isEmpty(value)) {
            const [hour, minutes] = value.split(":")
            let dates = new Date()
            dates.setHours(hour)
            dates.setMinutes(minutes)
            datatransaction[v] = dates

        }
    })

    return datatransaction;
}

export const processEditDataDetail = async (val) => {
    const data = QueryDataDetail(store.getState())

    const comp = QueryData(store.getState())

    let datas = _.cloneDeep(data);

    //  // // console.log(datas[0])

    //_.filter(datas[0], (x, y) => { // // console.log(datas[0].rowid) })

    let datatransaction = _.filter(datas, (x) => { return x.rowid === val.original.rowid })[0]

    // // console.log(datatransaction)

    const inputIsObjects = _.filter(comp[1], (x) => { return x.itemtype.match(/^(inputdate|inputdatesimple|inputtime)$/) })



    _.mapKeys(datatransaction, (k, v) => {


        const arr = _.filter(inputIsObjects, (z) => { return z.formcomponent === v })[0]


        if (_.isUndefined(arr))
            return;


        let value = _.get(datatransaction, v)

        if (arr.itemtype.match(/^(inputdatesimpleold|inputdatesimple|inputdate)$/) && !_.isEmpty(value)) {
            if (value.match(':')) {

                const [dates, hours] = value.split(" ")
                //      // // // // console.log(dates, hours)

                const [day, month, year] = dates.split("-")
                const [hour, minute] = dates.split("-")

                datatransaction[v] = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
            }
            else {
                const [day, month, year] = value.split("-")
                datatransaction[v] = new Date(Number(year), Number(month) - 1, Number(day))

            }

        } else if (arr.itemtype.match(/^(inputtime)$/) && !_.isEmpty(value)) {
            const [hour, minutes] = value.split(":")
            let dates = new Date()
            dates.setHours(hour)
            dates.setMinutes(minutes)
            datatransaction[v] = dates

        }
    })

    return datatransaction;
}



export const processEditDataNetwork = async (val) => {
    const data = QueryData(store.getState())
    let datas = _.cloneDeep(data);

    //// console.log(datas[1])

    //    _.map(datas[1], (x) => // console.log(x.rowid, x.formcomponent, x.itemtype))

    let datatransaction = _.filter(datas[0], (x) => { return x.rowid === val.original.rowid })[0]
    const inputIsObjects = _.filter(datas[1], (x) => { return x.itemtype.match(/^(inputdate|inputdatesimple|inputdatesimpleold|inputtime|inputtimeold)$/) })


    _.mapKeys(datatransaction, (k, v) => {

        const arr = _.filter(inputIsObjects, (z) => { return z.formcomponent === v })[0]

        if (_.isUndefined(arr))
            return;


        let value = _.get(datatransaction, v)

        if (arr.itemtype.match(/^(inputdatesimpleold|inputdatesimple|inputdate|)$/) && !_.isEmpty(value)) {
            if (value.match(':')) {

                const [dates, hours] = value.split(" ")
                //      // // // // console.log(dates, hours)

                const [day, month, year] = dates.split("-")
                const [hour, minute] = dates.split("-")

                datatransaction[v] = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
            }
            else {
                const [day, month, year] = value.split("-")
                datatransaction[v] = new Date(Number(year), Number(month) - 1, Number(day))

            }

        } else if (arr.itemtype.match(/^(inputtime|inputtimeold)$/) && !_.isEmpty(value)) {
            const [hour, minutes] = value.split(":")
            let dates = new Date()
            dates.setHours(hour)
            dates.setMinutes(minutes)
            datatransaction[v] = dates

        }
    })

    const networkFields = _.filter(getFormComponent(), ['fieldtype', 'fieldformula'])

    let networkfield = {}

    if (_.size(networkFields) > 0) {

        await Promise.all(_.map(networkFields, (x) => {
            let depends = ''

            _.map(_.split(x.lov_dependent, ';'), (z, i) => {
                const idx = i + 1
                depends += `&${idx}=${(_.get(datatransaction, z) instanceof Object ? (_.get(datatransaction, z) instanceof Date ? parseDatetoString(_.get(datatransaction, z)) : _.values(_.get(datatransaction, z))[0]) : _.get(datatransaction, z))}`
            })

            return eplant.get(`/lov/${x.lovs}?0=${depends}`)
        })).then(v => {

            _.map(networkFields, (x, index) => {

                // // console.log('data fetchd ', _.values(v[index].data.rows[0]))

                networkfield = {
                    ...networkfield,
                    [x.registername]: _.values(v[index].data.rows[0])[0]
                }

            })
        }).catch(
            _.map(networkFields, (x, index) => {
                networkfield = {
                    ...networkfield,
                    [x.registername]: "0"
                }

            })

        );

        _.assign(datatransaction, { ...networkfield })
    }


    return datatransaction;
}


export const processDataGrid = async (v) => {
    const component = _.map(_.filter(getFormListComponent(), ['tableparentkey', 'true']), x => x.key)
    const rowdatas = _.filter(_.uniqBy(QueryDataDetail(), 'rowid'), [component, v])

    //// // // // console.log(component)
    //// // // // console.log(component, v)

    const data = QueryData(store.getState())
    const inputIsObjects = _.filter(data[1], (x) => { return x.formtype === 'GRID' && x.itemtype.match(/^(inputdate|inputdatesimple|inputtime|inputtimeold)$/) })

    //// // // // console.log(rowdatas)


    _.map(rowdatas, (r) => {
        _.mapKeys(r, (k, v) => {

            const arr = _.filter(inputIsObjects, (z) => { return z.formcomponent === v })[0]

            if (_.isUndefined(arr))
                return;

            let value = _.get(r, v)

            if (arr.itemtype.match(/^(inputdatesimple|inputdatesimpleold|inputdate)$/) && !_.isEmpty(value)) {
                const [day, month, year] = value.split("-")


                r[v] = new Date(Number(year), Number(month) - 1, Number(day))
            } else if (arr.itemtype.match(/^(inputtime|inputtimeold)$/) && !_.isEmpty(value)) {
                const [hour, minutes] = value.split(":")
                let dates = new Date()
                dates.setHours(hour)
                dates.setMinutes(minutes)
                r[v] = dates

            }
        })
    })

    // // // // // console.log('process data grid', _.uniqBy(rowdatas, 'rowid'))

    //  // // // // console.log('process data grid unfilered', rowdatas)

    return rowdatas
}


// *compiled data to be edited
export const prepareEditDataMasterDetail = async (val, callback) => {

    store.dispatch({ type: SET_TRANSACTION_INFO, payload: val })

    const component = _.map(_.filter(getFormComponent(), ['tableparentkey', 'true']), x => x.key)
    const Rowdata = await processEditDataNetwork(val);


    const inputgrid = await processDataGrid(_.get(val.original, component[0]))
    const editeddata = await _.assign(Rowdata, { inputgrid })// Object.assign(Rowdata, { inputgrid })



    store.dispatch(setEditData(editeddata))
}

// *compiled data to be edited
export const PrepareEditData = async (val) => {
    // const rowdatas = QueryDataDetail(store.getState())

    store.dispatch({ type: SET_TRANSACTION_INFO, payload: val })

    //   // // console.log(val)


    let datas = await processEditData(val)


    store.dispatch(setEditData(datas))

}


// *compiled data to be edited
export const PrepareEditDataFromDetail = async (val) => {
    // const rowdatas = QueryDataDetail(store.getState())

    store.dispatch({ type: SET_TRANSACTION_INFO, payload: val })

    let datas = await processEditDataDetail(val)


    store.dispatch(setEditData(datas))

}

export const PrepareFilteredDataGrid = async (val) => {
    // // // console.log(val)
    store.dispatch({ type: SET_TRANSACTION_INFO, payload: val })

    const rowdatas = await processDataGrid(val[0]);

    store.dispatch(setEditData(rowdatas))
}


export const PrepareEditDataGrid = async (val) => {
    // // // console.log(val)
    store.dispatch({ type: SET_TRANSACTION_INFO, payload: val })

    const rowdatas = await processDataGrid(val[0]);

    store.dispatch(setEditData(rowdatas))
}

export const getDetailData = ({ original }) => {

    const data = QueryData(store.getState())
    const datadetail = QueryDataDetail(store.getState())


    //  // // console.log(datadetail)

    let parentKey = _.map(_.filter(data[1], (x) => {

        return !_.isEmpty(x.tableparentkey)
    }), ({ tablecomponent, tableparentkey }) => {

        let values = ''

        //  // // // // console.log(tablecomponent)

        if (original[tablecomponent] instanceof Object) {
            values = Object.values(original[tablecomponent])[0]
        }
        else {
            values = original[tablecomponent]
        }

        return { [tablecomponent]: values }
    })



    return _.filter(_.uniqBy(datadetail, 'rowid'), Object.assign({}, ...parentKey))

}

export const getRowData = ({ original }) => {
    const data = QueryData(store.getState())

    let parentKey = _.uniq(_.map(_.filter(data[1], (x) => {
        return !_.isEmpty(x.tableparentkey)
    }), ({ tablecomponent }) => {
        let values = ''
        if (original[tablecomponent] instanceof Object) {
            values = Object.values(original[tablecomponent])[0]
        }
        else {
            values = original[tablecomponent]
        }
        return values
    }))

    if (_.some(data[1], { 'transactionbased': 'period' }))
        parentKey.push(QueryDatePeriode(store.getState()))


    //    // // // // console.log(_.uniq(parentKey))
    return parentKey
}
export const getRowDoubleData = ({ original }) => {
    const data = QueryData(store.getState())

    // // // console.log(_.filter(data[1],{'formtype':'FORM'}),data[1])
    let parentKey = _.map(_.filter(_.filter(data[1], { 'groupcomponent': 'component' }), (x) => {
        return !_.isEmpty(x.tableparentkey)
    }), ({ tablecomponent }) => {
        let values = ''
        if (original[tablecomponent] instanceof Object) {
            values = Object.values(original[tablecomponent])[0]
        }
        else {
            values = original[tablecomponent]
        }
        return values
    })

    if (_.some(data[1], { 'transactionbased': 'period' }))
        parentKey.push(QueryDatePeriode(store.getState()))


    //    // // // // console.log(_.uniq(parentKey))
    return parentKey
}


export const UserInfo = () => {
    const users = store.getState()

    //// // // // console.log(users)

    return users.auth.menu.user
    //    return parentKey
}

export const searchHandler = ({ search }) => ({
    value: search,
    onclick: (event) => {
        // // console.log(event.target.offsetParent.children[0].value)
        store.dispatch({ type: UPDATE_NAV_SEARCH, payload: /*event.nativeEvent.path[2].firstChild.children[0].value*/ !_.isEmpty(event.target.offsetParent.children[0]) ? event.target.offsetParent.children[0].value : '' })
    },
    handleKeyPress: (event) => {
        // // // console.log(event)
        if (event.key === 'Enter') {
            store.dispatch({ type: UPDATE_NAV_SEARCH, payload: event.target.value })
        }
    }
    , handleblur: (event) => {


        store.dispatch({ type: UPDATE_NAV_SEARCH, payload: event.target.value })

    }
})


export const filterHandler = ({ search }) => ({
    value: search,
    onclick: (event) => {
        store.dispatch({ type: UPDATE_NAV_SEARCH, payload: /*event.nativeEvent.path[2].firstChild.children[0].value*/ !_.isEmpty(event.target.offsetParent.children[0]) ? event.target.offsetParent.children[0].value : '' })
    },
    handleKeyPress: (event) => {
        // // // console.log(event)
        if (event.key === 'Enter') {
            store.dispatch({ type: UPDATE_NAV_SEARCH, payload: event.target.value })
        }
    }
    , handleblur: async (value, props) => {

        store.dispatch({ type: UPDATE_NAV_SEARCH, payload: value.value })

    },
    onButtonclick: (event) => {
        // console.log(event)
        store.dispatch({ type: UPDATE_NAV_SEARCH, payload: event })
    },
})


export const filterHandler2 = ({ search2 }) => ({
    value: search2,
    onclick: (event) => {
        store.dispatch({ type: UPDATE_NAV_SEARCH2, payload: /*event.nativeEvent.path[2].firstChild.children[0].value*/ !_.isEmpty(event.target.offsetParent.children[0]) ? event.target.offsetParent.children[0].value : '' })
    },
    handleKeyPress: (event) => {
        // // // console.log(event)
        if (event.key === 'Enter') {
            store.dispatch({ type: UPDATE_NAV_SEARCH2, payload: event.target.value })
        }
    }
    , handleblur: async (value, props) => {

        //console.log('blur', value, search2)
        store.dispatch({ type: UPDATE_NAV_SEARCH2, payload: value.value })

    },
    handleDefault: async (value) => {

        //console.log('blur', value, search2)
        store.dispatch({ type: UPDATE_NAV_SEARCH2, payload: value.value })

    },
    onButtonclick: (event) => {
        // console.log(event)
        store.dispatch({ type: UPDATE_NAV_SEARCH2, payload: event })
    },
})

export const periodHandler = ({ dateperiode }) => (
    {
        value: dateperiode,
        onchange: (dateperiode) => {
            store.dispatch({ type: UPDATE_NAV_PERIOD, payload: dateperiode })
            store.dispatch({ type: UPDATE_NAV_PERIOD_NOW, payload: dateperiode })
        }
    }
)


export const parseNumber = (value, locales = undefined) => {
    if (typeof value !== 'string') return value;

    const example = Intl.NumberFormat(locales).format('1.1111');

    const normalized = Number(value.replace(example.charAt(1), ','));


    if (!isNaN(value.replaceAll(',', '')))
        return Number(value.replaceAll(',', ''));//.toFixed(3);

    return 0;
}

export const parseNumbertoString = (value, rounding) => {
    let retVal = '0'

    let roundingnum = ''


    if (_.isNil(value)) {
        retVal = ''
    } else {
        try {

            if (!_.isNil(rounding)) {
                roundingnum = rounding

                retVal = value.toLocaleString(undefined, {
                    minimumFractionDigits: roundingnum,
                    maximumFractionDigits: roundingnum,
                })

            }
            else {
                retVal = value.toLocaleString()
            }
        } catch (e) {
            retVal = '0'
        }
    }

    return retVal
}

export const perseEpochToDate = (value) => {
    let retVal = ''

    if (value instanceof Date) {
        try {
            //       // // // // console.log(value)


            retVal = value

        } catch (e) {
            retVal = ''
        }

    } else {
        // // // // // console.log('parse date to string ', value)
        retVal = new Date(value)
    }

    //// // // // console.log('V', value, retVal)

    return retVal
}

export const parseStrTimeTodate = (values) => {

    if (_.isEmpty(values))
        return ''
    let dates = new Date()

    // // // // console.log('values', values)

    if (values.includes('_')) {
        return dates
    } else {
        try {
            const [hour, minutes] = values.split(":")




            dates.setHours(hour)
            dates.setMinutes(minutes)

            //// // // // console.log(dates)



            return dates

        } catch (error) {
            // // // // console.log(error, dates)

            return dates
        }
    }

}


export const parseMillSectoString = (values) => {
    let retVal = ''


    // // // // // console.log('parse date to string ', value)

    const value = new Date(values)

    if (value instanceof Date) {
        try {
            //       // // // // console.log(value)

            var dd = String(value.getDate()).padStart(2, '0');
            var mm = String(value.getMonth() + 1).padStart(2, '0'); //January is 0!

            var yyyy = value.getFullYear();


            retVal = `${dd}-${mm}-${yyyy}`

        } catch (e) {
            retVal = ''
        }

    } else {
        retVal = value
    }
    return retVal
}

export const pickDateFromMillsec = (values, _type) => {
    let retVal = '', returnval = ''



    const value = new Date(values)

    if (value instanceof Date) {
        try {
            //       // // // // console.log(value)

            var dd = String(value.getDate()).padStart(2, '0');
            var mm = String(value.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = value.getFullYear();
            var fmmm = String(value.getMonth() + 1); //January is 0!



            retVal = `${dd}-${mm}-${yyyy}`



        } catch (e) {
            retVal = ''
        }

    } else {
        retVal = value
    }
    if (_type === 'YEAR') {

        return yyyy
    } else if (_type === 'MONTH') {

        return fmmm
    } else if (_type === 'PERIOD') {

        return fmmm + "-" + yyyy
    }

    else {
        return retVal
    }

}


export const pickDatetoString = (value, _type) => {
    let retVal = ''

    if (value instanceof Date) {
        try {

            var dd = String(value.getDate()).padStart(2, '0');
            var mm = String(value.getMonth() + 1).padStart(2, '0');
            var yyyy = value.getFullYear();



            retVal = value.toLocaleString('default', { month: 'short' });

        } catch (e) {
            retVal = ''
        }

        switch (_type) {
            case FULLDATE:
                return `${dd}-${mm}-${yyyy}`
            case SHORTMONTH:
                return retVal

            default:
                return retVal
        }

    } else {
        return value
    }
}


export const parseDatetoString = (value) => {
    let retVal = ''

    if (value instanceof Date) {
        try {

            var dd = String(value.getDate()).padStart(2, '0');
            var mm = String(value.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = value.getFullYear();


            retVal = `${dd}-${mm}-${yyyy}`

        } catch (e) {
            retVal = ''
        }

    } else {
        retVal = value
    }
    return retVal
}

export const parseTimetoString = (value) => {
    let retVal = ''


    // // // // // console.log('parse date to string ', value)

    if (value instanceof Date) {
        try {
            //       // // // // console.log(value)

            var hh = String(value.getHours()).padStart(2, '0'); //January is 0!
            var mi = String(value.getMinutes()).padStart(2, '0'); //January is 0!

            retVal = `${hh}:${mi}`


        } catch (e) {
            retVal = ''
        }

    } else {
        retVal = value
    }

    // // console.log(retVal)

    return retVal
}


export const parseFullDatetoString = (value) => {
    let retVal = ''


    // // // // // console.log('parse date to string ', value)

    if (value instanceof Date) {
        try {
            //       // // // // console.log(value)

            var dd = String(value.getDate()).padStart(2, '0');
            var mm = String(value.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = value.getFullYear();
            var hh = String(value.getHours()).padStart(2, '0'); //January is 0!
            var mi = String(value.getMinutes()).padStart(2, '0'); //January is 0!

            retVal = `${dd}-${mm}-${yyyy} ${hh}:${mi}`

        } catch (e) {
            retVal = ''
        }

    } else {
        retVal = value
    }
    return retVal
}
export const parseDateCompletetoString = (value) => {
    let retVal = ''


    // // // // // console.log('parse date to string ', value)

    if (value instanceof Date) {
        try {
            //       // // // // console.log(value)

            var dd = String(value.getDate()).padStart(2, '0');
            var mm = String(value.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = value.getFullYear();
            var hh = String(value.getHours()).padStart(2, '0'); //January is 0!
            var mi = String(value.getMinutes()).padStart(2, '0'); //January is 0!
            var ss = String(value.getSeconds()).padStart(2, '0'); //January is 0!

            retVal = `${dd}-${mm}-${yyyy} ${hh}:${mi}:${ss}`

        } catch (e) {
            retVal = ''
        }

    } else {
        retVal = value
    }
    return retVal
}

export const parsingContent = (value, type) => {
    let retVal = ''


    if (type.includes('inputdate')) {

        retVal = parseDatetoString(value)

    }
    else if (type === 'inputtime') {
        retVal = parseTimetoString(value)
    }
    else {

        retVal = _.values(value)
    }

    return retVal
}


export const changeReducer = async (modules, reducer) => {

    let inject = false

    _.mapKeys(store.asyncReducers, (x, y) => {
        if (modules !== y) {
            store.removeReducer(y)
        }
        else if (modules === y) {
            return;
        }

        inject = true

    })

    if (inject || _.isEmpty(store.asyncReducers))
        store.injectReducer(modules, reducer);

}

export const parseToDate = str => {
    if (!str) return

    //  // // // // console.log(str)

    const [day, month, year] = str.split("-")
    let dates = new Date(Number(year), Number(month) - 1, Number(day))

    return dates
};


export const parseStringToDate = (str, separator) => {
    if (!str) return

    //  // // // // console.log(str)

    const [day, month, year] = str.split(separator)
    let dates = new Date(Number(year), Number(month) - 1, Number(day))

    return dates
};



export const parseToTime = str => {
    if (!str) return

    //  // // // // console.log(str)

    const [hr, mins] = str.split(":")

    let dates = new Date()

    // // console.log(hr, mins)

    dates.setHours(hr)
    dates.setMinutes(mins)
    dates.setSeconds(0)

    // // console.log(dates)

    return dates
};



export const monthDiff = (d1, d2) => {

    let date1
    let date2 = new Date(d2)

    if (!(d1 instanceof Date)) {
        date1 = parseToDate(d1)
    }
    else {
        date1 = d1
    }


    var months;

    try {
        months = (date2.getFullYear() - date1.getFullYear()) * 12;
        months -= date1.getMonth();
        months += date2.getMonth();

        return months <= 0 ? 0 : months;
    }
    catch (e) {
        // // // // // console.log(e)
        return -99
    }
}

function parseDateString(value, originalValue) {
    try {
        const parsedDate = isDate(originalValue)
            ? originalValue
            : parse(originalValue, "dd-MM-yyyy", new Date());

        if (isNaN(parsedDate))
            return null

        return parsedDate;
    }
    catch (e) {
        return null
    }
}

export const valO = (v) => {
    let z = ''

    if (_.isUndefined(v))
        return ''

    try {
        z = v instanceof Object ? _.values(v)[0] : v

        return z
    } catch (error) {
        return ''
    }

}


export const ActionDetais = () => {

    const v = store.getState()


}

export const isFieldLov = (dependencies) => {

    const modules = _.pull(_.keys(store.getState()), 'auth', 'dashboard', 'businessintelligence')[0]
    let isLov = false

    // // console.log('check field ', dependencies, modules)

    switch (modules) {
        case APP_MODULES.cashreceivevoucher:
            if (_.isUndefined(dependencies[0])) {
                isLov = false
            } else {
                let vtype = valO(dependencies[0])
                let vCode = valO(dependencies[1])
                let vActivity = valO(dependencies[2])


                // // // // console.log(vtype)

                if (
                    (vtype === 'EM' && vActivity.match(/^(21302004|11899000|11809005)$/))
                    ||
                    (vtype === 'AR' && vActivity.match(/^(21509000|11199000|21401200)$/))
                    ||
                    (vtype === 'CA' && vActivity.match(/^(21509000|11199000|21401200)$/))
                ) {

                    isLov = true
                }
            }

            break;
        case APP_MODULES.cashpaymentvoucher:
            if (_.isUndefined(dependencies[0])) {
                isLov = false
            } else {
                let vtype = valO(dependencies[0])
                let vCode = valO(dependencies[1])
                let vActivity = valO(dependencies[2])


                // // // // console.log(vtype)

                if (
                    (vtype === 'EM' && vActivity.match(/^(21302004|11899000|11809005|11401004|11401005|11401006|11401007|11401008)$/))
                    ||
                    (vtype === 'AP' && vActivity.match(/^(21509000|11199000|21401200)$/))
                    ||
                    (vtype === 'CA' && vActivity.match(/^(21509000|11199000|21401200|21302001)$/))
                    ||
                    (vtype === 'CB' && vActivity.match(/^(11401004|11401005|11401006|11401007|11401008|21606000)$/))
                    ||
                    (vtype === 'GC' && vActivity.match(/^(11401004|61201320|61201321|11401008|11401005|11401004|11401006|11401007|61223000|61201322)$/))

                ) {

                    isLov = true
                }
            }

            break;
        case APP_MODULES.cashpettycash:
            if (_.isUndefined(dependencies[0])) {
                isLov = false
            } else {
                let vtype = valO(dependencies[0])
                let vCode = valO(dependencies[1])
                let vActivity = valO(dependencies[2])


                // // // // console.log(vtype)

                if (
                    (vtype === 'EM' && vActivity.match(/^(21302004|11899000|11809005|11401004|11401005|11401006|11401007|11401008)$/))
                    ||
                    (vtype === 'AP' && vActivity.match(/^(21509000|11199000|21401200)$/))
                    ||
                    (vtype === 'CA' && vActivity.match(/^(21509000|11199000|21401200|21302001)$/))
                    ||
                    (vtype === 'CB' && vActivity.match(/^(11401004|11401005|11401006|11401007|11401008|21606000)$/))
                    ||
                    (vtype === 'GC' && vActivity.match(/^(11401004|61201320|61201321|11401008|11401005|11401004|11401006|11401007|61223000|61201322|61201323|61201324)$/))

                ) {

                    isLov = true
                }
            }

            break;
        case APP_MODULES.purchaseorder:
        case APP_MODULES.materialrequest:
        case APP_MODULES.purchaserequest:
        case APP_MODULES.vehicleactivity:
        case APP_MODULES.purchasereceivenote:
        case APP_MODULES.hrmedicalinternal:
        case APP_MODULES.patient_name:
        case APP_MODULES.fixedassetfamaster:
        case APP_MODULES.contractagreement:
        case APP_MODULES.nurserynurseryissue:
        case APP_MODULES.contractagreementctl:
        case APP_MODULES.medicalho:
        case APP_MODULES.contractproformacontract:
        case APP_MODULES.contractinvoicecontract:
        case APP_MODULES.contractcontractprogresstuslah:
        case APP_MODULES.fopblockmaster:
        case APP_MODULES.emppayrollarea:
        case APP_MODULES.emppayrollallowdedtype:
        case APP_MODULES.empotherpayrollrate:
        case APP_MODULES.empsalarygrade:
        case APP_MODULES.purchasinginvoice:
        case APP_MODULES.contractprogresstuslah:
        case APP_MODULES.pomffbgrading:
        case APP_MODULES.hrbarangassets:
        case APP_MODULES.potransportexpedition:
            isLov = true;
            break;
        default:
            break;
    }


    // // // console.log(isLov)

    return isLov;
}

export const SearchIcon = () => {
    // icon handler for search input field.

    let noci = 'search'
}


export const HandleKeyDown = (event) => {
    event.preventDefault();
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
        alert("CTRL+S Pressed");
    } else if ((event.ctrlKey || event.metaKey) && charCode === 'c') {
        alert("CTRL+C Pressed");
    } else if ((event.ctrlKey || event.metaKey) && charCode === 'v') {
        alert("CTRL+V Pressed");
    }
}

export const useKey = (key, cb) => {
    const callback = useRef(cb);

    useEffect(() => {
        callback.current = cb;
    })


    useEffect(() => {
        function handle(event) {
            if (event.code === key) {
                callback.current(event);
            }
        }

        document.addEventListener('keypress', handle);
        return () => document.removeEventListener("keypress", handle)
    }, [key])
}

export const limitSize = (_num) => {
    let v = Math.round(_num / 1000000)

    //    // console.log(v)

    v = `Max Size ${v.toString()} MB`

    return v
}

export const parseJWT = (token) => {
    //  var base64Url = token.split('.')[1];
    // var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));

    // return JSON.parse(jsonPayload);
    try {
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        return tokenPayload
    } catch (error) {

        return null
    }

}


export const outputPdfBlob = (doc, type, refs) => {

    if (!_.isEmpty(type) && type === 'view') {

        const pdfData = doc.output('datauristring', { filename: `report.pdf` });
        if (refs.current) {
            refs.current.src = pdfData;

            refs.current.focus();
        }

    } else {



        const pdfData = doc.output('blob');
        const blobURL = URL.createObjectURL(pdfData);
        // Open the blob URL in a new window/tab for preview
        return window.open(blobURL, '_self');
    }
}

export const encryptString = async (v) => {

    // Encrypt
    let ciphertext = CryptoJS.AES.encrypt(v, OKEY).toString();

    // Decrypt
    //  let bytes = CryptoJS.AES.decrypt(ciphertext, OKEY);
    //  var originalText = bytes.toString(CryptoJS.enc.Utf8);

    return encodeURIComponent(ciphertext)

}

export const Notified = (_type, _message) => {
    switch (_type) {
        case Appresources.TRANSACTION_ALERT.ERROR:
            toast.error(_message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            break;

        default:
            toast.info(_message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            break;
    }
}



export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return screenSize;
};