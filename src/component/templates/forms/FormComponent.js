import React, { useEffect, useState, useRef, } from "react";
import { Form, Grid, Label, Message, Icon, TextArea, Image, Popup, Progress, Button, Modal } from "semantic-ui-react";
import { useFormContext, useFormState } from 'react-hook-form'
// import MaskedInput from 'react-text-mask'
import AsyncSelect from 'react-select/async'
import Select, { components } from 'react-select'
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash'
import ReactDatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import { useLocation } from 'react-router-dom'
// *library imports placed above ↑
// *local imports placed below ↓

import { DATEFORMAT, NEWS, PREFIX_FIELD_CONTROL } from "../../Constants";
import eplant from "../../../apis/eplant";
import { ShowLov, ShowLovDeps, WebcamPhoto } from "../../../redux/actions";
import { encryptString, getFormComponent, isFieldLov, limitSize, Notified, parseDatetoString, parseNumber, parseNumbertoString, parseStringToDate, parseToDate, UserInfo } from "../../../utils/FormComponentsHelpler";
import { searchStyles, selectStyles } from "../Style";
import dateFormat from "dateformat"
import store from "../../../redux/reducers";
import eplantStatic from "../../../apis/eplantStatic";
import { Appresources } from "../ApplicationResources";
import dayjs from 'dayjs'
import DialogScanQR from "../popup/DialogScanComponentQR";
import { FORCED_RENDER_GRID, MODAL_TRX_OPEN } from "../../../redux/actions/types";


const fileUpload = async (control, field, locations, file, action, _deps, progresss, finished) => {

    try {
        const st = store.getState()

        let formData = new FormData()
        let _filetype = file[0].name.split('.').pop()
        let sourcetname, tname, id, fname, fileName, act
        let _filename
        // //console.log(st.actionlabel == "Action Process")
        if (st.auth.tabActive === 'vendorlegality') {
            sourcetname = 'vendor_legal_detail'
        }
        else {
            sourcetname = 'vendor'
        }
        if (!_.isNil(action)) {
            if (action == 'savedb') {
                act = '&savedb=true'
            } else {
                act = ''
            }
        } else {
            act = ''
        }
        // //console.log(control._formValues.rowid)

        tname = await encryptString(sourcetname)
        id = await encryptString(control._formValues.rowid)
        fname = await encryptString(field.name)

        fileName = `${field.name}.${_filetype}`
        if (!_.isEmpty(_deps)) {
            _deps = _deps.replaceAll('/', '_')
            fileName = _deps + '_' + fileName
        }

        // //console.log(fileName)

        formData.append("file", file[0], fileName)


        //  //console.log(control._formValues.rowids)



        try {

            const response = await eplant.post(`/eplant/upload?filename=${encodeURIComponent(locations)}${act}&tname=${tname}&rid=${id}&field=${fname}`, formData, {



                onUploadProgress: p => {
                    //console.log('progress', p)
                    let progressValues = Math.round(p.progress * 100)


                    if (progresss)
                        progresss(progressValues)

                }
            })




            if (finished)
                finished(response)

        } catch (error) {
            //console.log(error)//, fileName)

            finished(error)
            //finished
        }


    }
    catch (error) {
        //console.log('error pmo ', error)

    }

}


const Input = (props) => {
    return < components.Input {...props} isHidden={false} />
}




/*SEKARANG */
const FormComponents = ({ sourcetype, lov_dependent, field, fieldtype, label, type, disabled, lovs, className, tableparentkey,
    datatype, lov_list_item, postAction, iseditable, disabledcomponent, child_component, isapprove, form_visibility, default_value, clickref,
    formula, datetransaction, iconName, lov_dependent_values, readonly, maxSize, field_dependence, headerlabel, action }) => {

    const renderCount = useRef(0);

    const _fieldref = useRef(null);
    const [uploadprogress, setuploadprogress] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [startupload, setStartUpload] = useState(false)
    const [_tempFiles, settempFiles] = useState([])
    const [singleModalState, setSingleModalState] = useState(false)
    const loc = useLocation()
    renderCount.current = renderCount.current + 1;

    const { name } = field

    const dispatch = useDispatch()

    let periode = new Date(useSelector((state) => state.auth.tableDynamicControl.dateperiode))
    const formValidationSchema = useSelector((state) => state.auth.formValidationSchema)
    const isUpdate = useSelector((state) => !_.isNil(state.auth.activeProps) ? state.auth.activeProps.isupdate : null)
    const qrcomponent = useSelector((state) => state.auth.qrcomponent)
    // //console.log(qrcomponent)
    // //console.log(useSelector((state) => state.auth.qrcomponent))
    const validationtype = formValidationSchema?.fields?.[name]?.type

    let startperiode = new Date(periode.getFullYear(), periode.getMonth(), 1)

    let sysdate = new Date()
    let canEdit = true
    let undiscomponent = true
    let contentFile
    let valueOne, valueTwo
    let filenamecamera
    //    const [searchValue, setSearchValue] = useState('')
    const [asyncSearchLoad, setAsyncSearchLoad] = useState({})


    const formComps = getFormComponent();




    const formatOptionLabel = (options) => {
        return (<Grid columns={Object.keys(options).length}>
            <Grid.Row >
                {Object.values(options).map((name, index) => (<Grid.Column
                    key={name + index}
                    style={{ fontColor: 'Black', fontSize: '8pt' }}
                    //width={(index === 0 ? 3 : index === 1 ? 8 : 3)}
                    width={_.size(_.split(lov_list_item, ';')) === 2 ? 5 : null}
                    children={(_.values(name).length >= 30 ? `${name.substring(0, 28)}..` : name)} />))}
            </Grid.Row>
        </Grid>)
    };

    const formatGroupLabel = ({ label }) => {
        return (
            <>
                <Grid column={label.length} /* style={{ background: 'GhostWhite' }} */ style={{ width: _.size(_.split(lov_list_item, ';')) == 4 ? '900px' : null }}>
                    <Grid.Row >
                        {_.map(label, (name, index) => (<Grid.Column
                            key={name + index}
                            style={{ fontColor: 'Black', fontSize: '8pt' }}
                            width={_.size(_.split(lov_list_item, ';')) == 4 ? 3 : 4}
                            children={name} />))}
                    </Grid.Row>
                </Grid >
                {/*    <Divider /> */}
            </>
        )
    };

    const { getValues, setValue, control, getFieldState, handleSubmit, resetField, setFocus, setError, trigger } = useFormContext()
    const { errors, isDirty, dirtyFields } = useFormState(control)

    const itemClickHandler = (lov, value) => dispatch(ShowLov(lov, value, (_.isNil(getValues(value)) ? '' : getValues(value))))



    //? Handling Onclick Ref For Submitting Transaction
    useEffect(() => {
        clickref.current = (cb) => {

            //  cb('qr')


            handleSubmit(async (data) => {



                if (!isDirty) {
                    return;
                }

                // // // // //console.log(data)

                let inserts = []
                let updates = []
                let header

                cb(data, dirtyFields)
            })()
        }
    }, [isDirty])

    //var momentFormat = 'dd/mm/yyyy';

    // // // // // //console.log(name, field.value)




    const disableEnter = async (e) => {

        // //console.log(e)

        if (e.code === "NumpadEnter" || e.code === "Enter") {
            e.preventDefault();
            return;
        }
    }


    let selectOptions = _.filter(useSelector((state) => state.auth.populateselect), [0, name])


    let lov = useSelector(state => state.auth.selectedValue)

    //    // // // // //console.log( _.split(default_value,';'))

    const checkbox = (e) => {
        // // // // // //console.log(e.target)

        let value
        let setval
        value = _.split(default_value, ';')
        // value = typeof _.includes(datatype,'NUMBER') == 'number' ? parseNumber(value) : value
        // // // // //console.log( _.includes(datatype,'NUMBER'))
        if ((e.target.checked) == false) {
            e.target.value = value[0]
            setval = _.includes(datatype, 'NUMBER') == true ? parseNumber(e.target.value) : e.target.value
            // // // // //console.log('1',typeof setval)
        } else if ((e.target.checked) == true) {
            e.target.value = value[1]
            // // // // //console.log(e.target.value)
            setval = _.includes(datatype, 'NUMBER') == true ? parseNumber(e.target.value) : e.target.value
            // // // // //console.log('2',typeof setval)
        }
        return setval
    }

    const lovHandler = () => {

        let deps = ''

        if (lov_dependent) {
            _.map(_.split(lov_dependent, ';'), (val, i) => {
                // // // // //console.log(val)
                let ivalue = ''
                if (val === 'sourcetype') {
                    ivalue = sourcetype
                } else if (val === 'userid') {
                    ivalue = UserInfo().loginid
                } else if (val === 'site') {
                    ivalue = UserInfo().site
                }
                else {
                    if (val.includes('header_')) {
                        //                        // // // //console.log(i, val, getValues(`${val.replace('header_', '')}`))
                        ivalue = getValues(`${val.replace('header_', '')}`)

                        if (ivalue instanceof Object) {
                            if (ivalue instanceof Date) {
                                ivalue = parseDatetoString(ivalue)
                            }
                            else {
                                ivalue = Object.values(ivalue)[0]
                            }
                        }


                    } else {

                        ivalue = getValues(val)
                        if (ivalue instanceof Object) {
                            if (ivalue instanceof Date) {
                                ivalue = parseDatetoString(ivalue)
                            }
                            else {
                                ivalue = Object.values(ivalue)[0]
                            }
                        }

                    }
                }
                deps += `&${i + 1}=${ivalue}`
                // // // // //console.log(deps)
            })

        }
        dispatch(ShowLovDeps(lovs, name, (_.isNil(getValues(name)) ? '' : getValues(name)), deps))
    }



    const loadOptions = _.debounce((inputValue, callback) => {
        let deps = ''
        let values = _.isEmpty(inputValue) ? Object.values(field.value)[0] : inputValue

        // console.log('find', inputValue)
        if (!_.isEmpty(lov_dependent))
            _.map(_.split(lov_dependent, ';'), (val, i) => {
                let ivalue = ''

                //   //console.log(' check ', val.indexOf('#'), val.replace('#', ''))
                if (val === 'sourcetype') {
                    ivalue = sourcetype
                } else if (val === 'userid') {
                    ivalue = UserInfo().loginid

                } else if (val.indexOf('#') > -1) {

                    ivalue = val.replace('#', '')
                }
                else {
                    ivalue = getValues(`${name.substring(-1, name.indexOf(']') + 1)}.${val}`) instanceof Date ? dateFormat(getValues(`${name.substring(-1, name.indexOf(']') + 1)}.${val}`), 'dd/mm/yyyy') : getValues(`${name.substring(-1, name.indexOf(']') + 1)}.${val}`)
                    // // // // //console.log(getValues(`${name.substring(-1, name.indexOf(']') + 1)}.${val}`) instanceof Date)
                    if (ivalue instanceof Object) {
                        ivalue = Object.values(ivalue)[0]
                    }
                }
                deps += `&${i + 1}=${ivalue}`
            })

        setAsyncSearchLoad({
            ...asyncSearchLoad,
            [field.name]: true
        })

        eplant.get(`/lov/${lovs}?0=${values}${deps}`).then(res => {
            // // // // // //console.log(res.data.rows)
            setAsyncSearchLoad({
                ...asyncSearchLoad,
                [field.name]: false
            })

            callback([{ label: lov_list_item.split(';'), options: res.data.rows }])
        })

    }, 500)



    if (fieldtype == 'file') {
        // //console.log('0')
        if (headerlabel == 'image') {
            contentFile = 'image/png, image/jpeg'
            // //console.log('1')
        } else if (headerlabel == 'pdf') {
            contentFile = 'application /msword, application/pdf'
            // //console.log('2')
        }
    }

    if (!_.isEmpty(selectOptions)) {

        selectOptions = _.map(_.values(selectOptions)[0][1], v => {
            let obj = {}
            for (let index = 0; index < _.size(_.values(v)); index++) {

                let val

                if (index === 0) {
                    val = 'value'
                } else if (index === 1) {
                    val = 'label'
                } else {
                    val = `extradata${index}`
                }

                obj = { ...obj, [val]: Object.values(v)[index] }

            }

            return obj
        })

    }

    if (iseditable !== 'false' && !postAction.match(NEWS) && tableparentkey) {
        canEdit = false
    } else if (iseditable && !_.isNull(default_value) && !_.isNull(datetransaction)) {
        canEdit = false
        // } else if ( postAction.match(NEWS) && !_.isNull(disabledcomponent)) {
        //     canEdit = false
    } else if (iseditable && !postAction.match(NEWS)) {
        canEdit = false
    }

    // // //console.log(formComps,name)
    if (!_.isNil(disabledcomponent)) {
        // if (_.isMatch(field_dependence,';')){
        if (disabledcomponent == 'true') {
            if (isapprove == 'N') {

                // // //console.log('heh')
                undiscomponent = false
            } else {
                if (postAction.match(NEWS)) {
                    undiscomponent = false
                } else {
                    undiscomponent = true
                }
            }
        }
        // }
        const st = store.getState()
        const val = _.split(disabledcomponent, '#')
        if (_.isMatch(val, ['disabled'])) {
            if (st.auth.actionlabel != 'Save') {
                // //console.log('heh')
                if (!_.isUndefined(getValues(val[1])) || !_.isUndefined(getValues(val[2]))) {
                    readonly = 'false'
                }
            }
        }
        if (_.isMatch(val, ['paramsdate'])) {
            if (!_.isUndefined(getValues(val[1])) || !_.isUndefined(getValues(val[2]))) {
                valueOne = getValues(val[1]).split('-')
                valueOne = new Date(`${valueOne[2]}'/'${valueOne[1]}'/'${valueOne[0]}`)
                valueTwo = getValues(val[2]).split('-')
                valueTwo = new Date(`${valueTwo[2]}'/'${valueTwo[1]}'/'${valueTwo[0]}`)
            }
        }
    }
    const webCam = useSelector(state => state.auth.webcamValue)
    if (fieldtype == 'inputcamera') {
        let res = _.map(field_dependence.split(';'), (v, i) => {
            filenamecamera = `${v}`
            // console.log(getValues())
            filenamecamera = getValues(`${v}`)
            //  console.log(filenamecamera)
            return filenamecamera
        })
        filenamecamera = _.join(res, '_')
        //  console.log(filenamecamera)
        _.map(webCam, (x, i) => {
            // console.log('hehe',x)
            if (x.name == name) {
                setValue(name, x.data, { shouldDirty: true })
            }
        })
        // console.log(filenamecamera)
        // console.log(useSelector(state => state.auth.modals.content))
    }

    const checkDependencies = () => {


        // * check if field have child component that changes when this field value changed 
        if (!_.isEmpty(child_component) && getFieldState(name).isDirty) {

            // // //console.log(child_component)

            _.map(child_component.split(';'), (v, i) => {
                const dependentComponent = _.find(formComps, ['registername', v])


                if (dependentComponent.fieldtype === 'fieldformula') {


                    if (_.isNil(getValues(name))) {
                        console.log('check sini ', dependentComponent.registername, name)

                        setValue(dependentComponent.registername, '0')
                    } else {
                        console.log('updatge  sini ', dependentComponent.registername, name)


                        checkValue(dependentComponent.registername, dependentComponent.fieldtype, dependentComponent.lov_dependent, dependentComponent.lovs)

                    }

                } else if (dependentComponent.fieldtype === 'inputsearch') {

                    // // console.log('deps cjecl ', v)
                    if (!_.isEmpty(getValues(v))) {
                        setValue(v, '')
                        setValue(`${v}#displayonly`, '')

                    }

                } else {

                    if (!_.isEmpty(getValues(v))) {
                        setValue(v, '')
                        // setSearchValue('')
                    }
                }
            })


        }

        // * check if field have dependent component to be set it values by field lovs
        if (!_.isEmpty(lov_dependent_values) && fieldtype !== 'input_inputsearch') {

            //   //console.log(name, type, lov_dependent_values)
            /*
                ? Handle dependecies from list lov, 
                ? check by position column after id/code in index 0 
                ? if value not used ---> used NA
            */

            if (fieldtype === 'inputselect') {

                //   //console.log(name, lov_dependent_values)
                _.map(lov_dependent_values.split(';'), (v, i) => {
                    const deps = (datatype.includes('NUMBER') ? _.find(selectOptions, ['value', parseNumber(getValues(name))]) : _.find(selectOptions, ['value', getValues(name)]))
                    if (v !== 'NA' || !_.isEmpty(v)) {
                        setValue(v, _.values(deps)[i + 1], { shouldDirty: true })
                    }

                })
            } else {

                _.map(lov_dependent_values.split(';'), (v, i) => {
                    if (v !== 'NA') {
                        const rowfieldname = v
                        setValue(rowfieldname, _.values(getValues(name))[i + 1], { shouldDirty: true })
                    }

                })
            }
        }


        // * check if field have dependent component to be set it values by field lovs
        if (!_.isEmpty(lov_dependent_values) && fieldtype === 'input_inputsearch') {

            //   //console.log(name, type, lov_dependent_values)
            /*
                ? Handle dependecies from list lov, 
                ? check by position column after id/code in index 0 
                ? if value not used ---> used NA
            */

            let controlLovValues = getValues(`${name}${PREFIX_FIELD_CONTROL}`)

            if (controlLovValues !== field.value) {
                _.map(lov_dependent_values.split(";"),
                    (z, index) => {

                        setValue(`${z}`, null, { shouldDirty: true })
                    }
                )
            }

        }


        // * check if field have formula calculation to set in another component
        if (!_.isEmpty(formula) && datatype === 'oracledb.NUMBER' && field.value !== 0) {

            if (formula.indexOf('=') !== -1) {

                let calculateTo = formula.substring(0, formula.indexOf('='))
                let variable1, variable2, cal, val1, val2

                let operator = (formula.indexOf('+') === -1 ? (formula.indexOf('-') === -1 ? (formula.indexOf('*') === -1 ? 'N/A' : '*') : '-') : '+')

                if (operator !== 'N/A' && formula.includes("==")) {
                    variable1 = formula.substring(formula.indexOf('==') + 2, formula.indexOf(operator))
                    variable2 = formula.substring(formula.indexOf(operator) + 1)
                    val1 = getValues(variable1)


                    eval(`${val1} ${operator} ${variable2}`)

                } else if (operator !== 'N/A') {
                    variable1 = formula.substring(formula.indexOf('=') + 1, formula.indexOf(operator))
                    variable2 = formula.substring(formula.indexOf(operator) + 1)

                    val1 = _.isUndefined(getValues(variable1)) ? 0 : getValues(variable1)
                    val2 = _.isUndefined(getValues(variable2)) ? 0 : getValues(variable2)
                    // // //console.log(getValues(variable1), getValues(variable2))
                    if (val1 === 0 && val2 === 0)
                        return;


                    cal = eval(`${val1} ${operator} ${val2}`)


                } else {
                    variable1 = formula.substring(formula.indexOf('==') + 2)

                    val1 = getValues(variable1)
                    cal = eval(val1)

                }

                // // console.log(calculateTo, cal)
                setTimeout(() => {
                    setValue(calculateTo, cal, { shouldDirty: !name.includes('displayonly') })
                }, 5);

            } else {


                const __f = formula.split(';')

                const checkvalue = __f[1]


                if (getValues(name) > getValues(checkvalue)) {
                    setValue(name, getValues(checkvalue))
                }


            }
        }
        if (action === 'change_layout') {
            //console.log('change')
            dispatch({ type: FORCED_RENDER_GRID, payload: true })
        }

    }


    const checkValue = async (v, vtype, vdependent, vlov) => {

        // return null

        const dependentArray = _.split(vdependent, ';')
        let depend = '', dependComplete = true

        const dataedit = store.getState().auth.datatoedit


        if (vtype === 'fieldformula' && !_.isEmpty(vdependent)) {


            //// // //console.log(dataedit)
            //// //console.log(dataedit)//, _.get(dataedit, name), _.get(dataedit, 'process_flag'), _.keys(dataedit))
            const loadValue = _.get(dataedit, name)
            //    // //console.log(loadValue, name)

            _.map(dependentArray, (val, i) => {

                let ivalue

                if (val === 'sourcetype') {
                    ivalue = sourcetype
                }
                else {

                    if (val.includes('header_')) {
                        //                        // // // //console.log(i, val, getValues(`${val.replace('header_', '')}`))
                        ivalue = getValues(`${val.replace('header_', '')}`)

                        if (ivalue instanceof Object) {
                            if (ivalue instanceof Date) {
                                ivalue = parseDatetoString(ivalue)
                            }
                            else {
                                ivalue = Object.values(ivalue)[0]
                            }
                        }


                    } else {

                        ivalue = getValues(val)

                        if (ivalue instanceof Object) {
                            if (ivalue instanceof Date) {
                                ivalue = parseDatetoString(ivalue)
                            }
                            else {
                                ivalue = Object.values(ivalue)[0]
                            }
                        }
                    }
                }

                if (_.isUndefined(ivalue) || _.isEmpty(ivalue)) {
                    dependComplete = false
                    return depend = ''
                } else {
                    return depend += `&${i + 1}=${encodeURIComponent(ivalue)}`
                }
            })


            //// //console.log(depend, dependComplete)

            if (_.isUndefined(loadValue)) {

                //// //console.log(' < ' + depend + ' > ', ' < ' + getValues(`dependence_${v}`) + ' > ', ' < ' + dependComplete + ' > ')

                if (getValues(`dependence_${v}`) !== depend && dependComplete) {

                    if (!_.isEmpty(depend) && !_.isEmpty(vlov)) {

                        // // //console.log('CALL API -2 ', v)

                        await callApi(depend, vlov, x => {

                            setValue(v, x)
                            setValue(`dependence_${v}`, depend)

                        })

                    } else if (_.isEmpty(depend)) {
                        setValue(v, '0')
                    }
                } else if (_.isEmpty(depend) && !dependComplete) {

                    //   // //console.log('masuk sini aja')
                    setValue(v, '0')

                }


            }
            else if (!_.isUndefined(loadValue) && !_.isUndefined(getValues(`dependence_${v}`))) {

                // // //console.log('masuk sini', depend, dependComplete, getValues(`dependence_${v}`), loadValue)
                //                // // //console.log(_.isEmpty(loadValue), loadValue, 'runn formula')

                if (getValues(`dependence_${v}`) !== depend && dependComplete) {
                    if (!_.isEmpty(depend) && !_.isEmpty(vlov)) {
                        // // //console.log('CALL API -1')
                        await callApi(depend, vlov, x => {

                            setValue(v, x)
                            setValue(`dependence_${v}`, depend)

                        })
                    } else if (_.isEmpty(depend)) {
                        // // //console.log('JUST SET')
                        setValue(v, loadValue)
                        //setValue(`dependence_${v}`, depend)
                    }
                } else {
                    setValue(v, loadValue)

                }


            }
            else {
                // // //console.log('masuk sini aja')
                setValue(`dependence_${v}`, depend)
            }

        } else if (vtype === 'fieldformula' && _.isEmpty(vdependent)) {

            //console.log(name, 'check value', vlov)
            await callApi(depend, vlov, x => {

                setValue(v, x)
                //  setValue(`dependence_${v}`, depend)

            })
        }
    }

    const callApi = async (depends, vlov, cb) => {

        let values

        if (!_.isEmpty(depends) && !_.isEmpty(vlov)) {

            //console.log('run')

            await eplant.get(`/lov/${vlov}?0=${depends}`)
                .then(val => {
                    try {
                        values = Object.values(val.data.rows[0])[0]
                    }
                    catch (e) {
                        values = '0'
                    }
                })
                .catch(
                    values = '0'
                )
        }


        cb(values)
    }

    const callApiProm = async (depends, vlov) => {

        let values

        if (!_.isEmpty(depends) && !_.isEmpty(vlov)) {
            await eplant.get(`/lov/${vlov}?0=${depends}`)
                .then(val => {
                    values = Object.values(val.data.rows[0])[0]
                })
                .catch(
                    values = 0
                )
        }

        return values
    }

    /* HANDLING LOV */
    useEffect(() => {
        if (!_.isEmpty(lov)) {
            lov = Object.values(lov)

            //console.log(lov)

            if (!lov[0].includes('inputgrid')) {
                // // // // // //console.log(lov[1].cells)
                try {
                    let valuesKey = _.mapKeys(formComps, 'registername')
                    let valuesChild = valuesKey[lov[0]].child_component

                    //console.log('child', lov[0])

                    setValue(lov[0], lov[1].cells[0].value) //set value to call object 

                    setValue(`${lov[0]}${PREFIX_FIELD_CONTROL}`, lov[1].cells[0].value) //set value to call object 


                    if (!_.isEmpty(valuesChild))
                        _.map(valuesChild.split(";"),
                            (z, index) => {
                                if (valuesKey[z].fieldtype === 'fieldcalculate') {
                                    setValue(valuesKey[z].registername, lov[1].cells[index + 1].value)
                                }

                            }
                        )

                    //   setValue(`${lov[0]}displayonly`, lov[1].cells[1].value)//add description value for called object 
                } catch (e) {
                    //   // // // // //console.log(e)
                    setValue(lov[0], '')
                }
            }

            let _lov = Object.values(lov)

            if (_lov[0] && (_lov[0] === name)) {

                let val = Object.values(_lov[1].values)


                const lovCol = _lov[0].substr(_lov[0].indexOf('.') + 1)
                // const lovRow = _lov[0].substr(0, _lov[0].indexOf('.'))

                // // // //console.log(lovCol, val)


                setTimeout(() => {

                    setValue(_lov[0], val[0], { shouldDirty: true })

                    if (!_.isEmpty(lovCol) && !_.isEmpty(lov_dependent_values))
                        //setTimeout(() => {
                        _.map(lov_dependent_values.split(";"),
                            (z, index) => {

                                if (!_.isEmpty(z)) {
                                    if (fieldtype === 'fieldcalculate') {
                                        setValue(`${z}`, val[index + 1], { shouldDirty: true })
                                    }
                                    else {
                                        const depComps = _.find(formComps, ['registername', z])

                                        if (!_.isUndefined(depComps)) {

                                            if (depComps.fieldtype === 'inputdate') {
                                                setValue(`${z}`, parseStringToDate(val[index + 1], "-"), { shouldDirty: true })
                                            }
                                            else {
                                                setValue(`${z}`, val[index + 1], { shouldDirty: true })
                                            }
                                        }

                                    }
                                }

                                if (typeof val[index + 1] === 'number') {
                                    // // // // // //console.log('error')
                                    setValue(`max#${z}#displayonly`, val[index + 1], { shouldDirty: true })
                                }

                            }
                        )
                }, 0.01);

                setFocus(_lov[0])

            }
        }
    }, [lov]);


    useEffect(() => {

        //  //console.log('run', uploading, field.value, name)

        if (uploading) {

            if (_tempFiles[0].size > maxSize) {
                //console.log(_tempFiles[0].size)
                setError(name, { type: 'custom', message: 'File Lebih Besar Dari 5 MB..!' });
                setValue(name, '')
                setUploading(false)

            }

            else {

                if (fieldtype === 'file' && !_.isEmpty(field.value) && uploading) {
                    setStartUpload(true)

                    let z
                    // //console.log(action)
                    if (action != 'temp') {
                        z = _.join(_.map(_.split(default_value, ';'), x => {
                            if (x.indexOf('#') > -1) {
                                // //console.log(x)
                                if (getValues(x.replace('#', '')) instanceof Object) {
                                    return _.get(getValues(x.replace('#', '')), x.replace('#', ''))
                                } else {
                                    return getValues(x.replace('#', ''))
                                }
                            }
                            else {
                                return x
                            }
                        }), '/')
                    } else {
                        z = '--temp/'
                    }
                    // //console.log('temporary/' +z)
                    let deps, fileNameAdd

                    if (!_.isEmpty(field_dependence)) {
                        _.map(_.split(field_dependence, ';'), x => {
                            if (x.indexOf('#') <= -1) {
                                // return x
                                if (getValues(x) instanceof Object) {
                                    deps = _.get(getValues(x), x)
                                } else {
                                    deps = getValues(x)
                                }
                                return deps
                            } else {
                                if (x.match('date')) {
                                    // //console.log(x)
                                    fileNameAdd = dayjs(getValues(_.replace(x, '#', ''))).format('DDMMYYYY')
                                    fileNameAdd = '_' + fileNameAdd
                                    return fileNameAdd
                                } else {
                                    fileNameAdd = getValues(_.replace(x, '#', ''))
                                    return fileNameAdd
                                }
                            }
                        })
                        if (_.isUndefined(fileNameAdd)) {
                            deps = deps
                        } else {
                            deps = deps + fileNameAdd
                        }
                    }


                    fileUpload(control, field, '/' + z, _tempFiles, action, deps, (p) => {

                        setuploadprogress(p)
                    }, (r) => {


                        if (r?.data?.message === "File uploaded successfully!") {
                            //  Notified('AMAN', `Upload ${label} Success.!`)
                            setValue(name, r.data.path)
                        } else {

                            resetField(name)
                            settempFiles(null)

                            Notified(Appresources.TRANSACTION_ALERT.ERROR, `Upload ${label} Failed.! --> ${r.message}`)
                        }
                        setUploading(false)
                        setStartUpload(false)

                    },
                    )
                } else {
                    resetField(name)
                    setStartUpload(false)
                    setUploading(false)
                }
            }
        }

    }, [uploading])


    const Placeholder = props => {
        return <components.Placeholder {...props} />;
    };


    const DropdownIndicator = props => {

        return (
            <components.DropdownIndicator {...props} >
                <div>
                    <i aria-hidden="true" className="search icon blue" ></i>
                </div>
            </components.DropdownIndicator>
        );
    };

    const DropdownIndicatorSearch = props => {

        return (
            <components.DropdownIndicator {...props}  >
                <Icon style={{ paddingBottom: '10px' }} name='search' fitted />
            </components.DropdownIndicator>
        );
    };

    useEffect(() => {
        checkValue(name, fieldtype, lov_dependent, lovs)
    }, [checkValue])

    if (fieldtype.match(/^(inputsearch|inputlov|inputselect)$/) && _.isEmpty(lovs)) {
        return (<Message
            compact
            color="red"
            //icon='warning'
            header={`Error : ${name} Lovs not set`}
        />)
    }

    const ErrorLabel = () => {
        let fieldname


        if (validationtype === 'object') {
            fieldname = `${name}.${_.split(lov_list_item, ';')[0]}`
        } else {
            fieldname = name
        }

        return errors[fieldname] && <span style={{ color: 'red' }}>&nbsp;{` * ${errors[fieldname]?.message}`}</span>
    }


    if (fieldtype === 'inputsearch') {

        //        console.log('check ', name)


        if (name === 'suppcontcode') {
            // console.log('rerender ', name, getValues(name), getValues(`${name}#displayonly`))

        }

        /*     if (field.value === '' && getValues(`${field.name}#displayonly`) !== '') {
            setValue(`${field.name}#displayonly`, '')
        } */
    }




    const scannerChoice = (c) => {

        // if (c == 'CAM'){
        setSingleModalState(true)
        // } else {
        //     setSingleModalState(false)
        // } 

    }


    const ComponentReturn = (() => {
        switch (fieldtype) {
            case "textarea":
                return (
                    <Form.Input
                        className={className}
                        label={label}>
                        <TextArea
                            readOnly={(!canEdit || readonly === 'true') && true}
                            rows={2}
                            className={className}
                            key={`field.${name}`}
                            value={field.value || ''}
                            {...field} />
                    </Form.Input>
                );
            case "input":
                if (datatype.includes('NUMBER')) {
                    return <div className={`field ${className}`} key={`d.${name}`} >
                        <label style={{ fontSize: '8pt', fontWeight: 'bold' }}> {label} <ErrorLabel /></label>
                        {/*    {errors[name] && <Label pointing='below' prompt content={errors[name].message} />} */}
                        <input
                            className={className}
                            {...field}
                            type='text'
                            key={`field.${name}`}
                            readOnly={(!canEdit || readonly === 'true') && true}
                            value={parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) : parseNumbertoString(field.value)}
                            /*   onChange={async (e) => {
                                  setValue(name, parseNumber(e.target.value), { shouldDirty: true })
                              }} */
                            onBlur={async (e) => {
                                setValue(name, parseNumber(e.target.value), { shouldDirty: true })

                                checkDependencies()
                            }}
                            onKeyDown={async (e) => {
                                disableEnter(e)
                            }}
                        />

                    </div>
                } else {
                    return <div className={`field ${className}`} key={`d.${name}`} >
                        <label style={{ fontSize: '8pt', fontWeight: 'bold' }} onClick={
                            () => {

                                //                                console.log('test')

                                //                              setValue('runqr', 'true', { shouldDirty: true })
                                //                                console.log('test')
                                //    dispatch({ type: MODAL_TRX_OPEN })

                            }}> {label} <ErrorLabel />
                            {/*   {console.log(name, getValues(`${name.replace('_no', '')}_file`))} */}
                            {
                                !_.isUndefined(getValues(`${name.replace('_no', '')}_file`)) &&
                                <Popup
                                    trigger={<Icon name='copy outline' link color='blue' onClick={async () => {

                                        try {
                                            let x = getValues(`${name.replace('_no', '')}_file`)

                                            let urls = `${x.replace(/\\/g, "/").replace('uploads', '')}`

                                            const response = await eplantStatic.get(urls, {
                                                method: "GET",
                                                responseType: "blob",
                                            })

                                            if (!_.isEmpty(response)) {
                                                // //console.log(urls.lastIndexOf('.'))
                                                //console.log(response)



                                                const file = new Blob([response.data], { type: response.data.type });
                                                // FileSaver.saveAs(file, `${field.name}.pdf`);
                                                const fileURL = URL.createObjectURL(file);
                                                window.open(fileURL, '__blank')
                                            }
                                        }
                                        catch (e) {
                                            //console.log('error click ', e)
                                        }
                                    }} />}
                                    inverted
                                    content='Click to Open file'
                                    size='tiny'
                                />}
                        </label>
                        <input
                            {...field}
                            type='text'
                            key={`field.${name}`}
                            readOnly={(!canEdit || readonly === 'true') && true}
                            value={field.value || ''}
                            onChange={async (e) => {
                                field.onChange(e)
                            }}
                            onBlur={async (e) => {
                                field.onBlur(e)
                                checkDependencies()
                            }}
                            onKeyDown={async (e) => {
                                disableEnter(e)
                            }}

                        />

                    </div >
                }
            case "inputqr":
                return <div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }}> {label} <ErrorLabel />
                    </label>
                    <Form.Input icon>
                        <input
                            {...field}
                            type='text'
                            key={`field.${name}`}
                            readOnly={(!canEdit || readonly === 'true') && true}
                            value={_.isNull(qrcomponent) ? field.value : qrcomponent}
                            onChange={async (e) => {
                                field.onChange(e)
                            }}
                            onBlur={async (e) => {
                                field.onBlur(e)
                                checkDependencies()
                            }}
                            onKeyDown={async (e) => {
                                disableEnter(e)
                            }}

                        /> <Icon
                            name='qrcode'
                            bordered
                            color="green"
                            link
                            onClick={
                                async (e) => {
                                    // //console.log(field)
                                    console.log(e)
                                    // if(singleModalState == false){
                                    dispatch({ type: MODAL_TRX_OPEN })
                                    // } else {
                                    //     setSingleModalState(false)
                                    // }

                                }
                            }
                        />
                    </Form.Input>
                    <Modal open={singleModalState} >
                        {/* <Modal.Header content={<Header as='h2' icon='qrcode' content='Scan QR Faktur' />} /> */}
                        <Modal.Content >
                            {/* {(choosen === 'SCAN' ? <DialogScannerQR /> : <DialogScanQR />)} */}
                            <DialogScanQR name={field} />
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={() => setSingleModalState(false)} content='Tutup' negative />
                        </Modal.Actions>
                    </Modal>
                </div>

            case "fieldcalculate":
                return <div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} >  {label}   <ErrorLabel /> </label>
                    {/*    {errors[name] && <Label pointing='below' prompt content={errors[name].message} />} */}
                    <input
                        className={className}
                        {...field}
                        type={datatype.includes('NUMBER') ? 'number' : 'text'}
                        style={{ backgroundColor: 'whitesmoke' }}
                        key={`field.${name}`}
                        readOnly
                        value={field.value || ''}
                        onChange={async (e) => {

                            if (datatype.includes('NUMBER')) {
                                field.onChange(
                                    Number.isNaN(parseFloat(e.target.value))
                                        ? null
                                        : parseFloat(e.target.value)
                                )
                            } else {
                                field.onChange(e)
                            }

                        }}
                        onBlur={async (e) => {
                            field.onBlur(e)
                            checkDependencies()
                        }}
                    />
                </div>
            case "fieldformula":
                return <div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label} <ErrorLabel /></label>
                    <Form.Input >
                        <input
                            {...field}
                            type='text'
                            key={`field.${name}`}
                            readOnly
                            value={(/* checkValue(name, fieldtype, lov_dependent, lovs),  */parseNumbertoString(field.value) === "0" ? parseNumbertoString(default_value) : parseNumbertoString(field.value))}
                            onBlur={checkDependencies()}
                        />
                        {/* {loadingstatus && <Icon color='green' loading name='circle notch' />} */}
                    </Form.Input>
                </div>
            case "inputlov":
                return <div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label}  <ErrorLabel /> </label>
                    {/*  {errors[name] && <Label pointing='below' prompt content={errors[name].message} />} */}
                    <div style={{ display: 'inline-flex' }}>
                        <input
                            className={className}
                            {...field}
                            //ref={field.ref}
                            type='text'
                            key={`field.${name}`}
                            value={field.value || ''}
                            onChange={async (e) => {
                                field.onChange(e)
                            }}
                            onKeyDown={async (e) => {
                                disableEnter(e)
                            }}
                        />
                        <Icon
                            key={`icon.${name}`}
                            size='large'
                            style={{ paddingTop: '10px', marginLeft: '5px', marginRight: '5px' }}
                            name='search' link={true} onClick={() => itemClickHandler(lovs, name)} />
                    </div>
                </div>
            case "inputselect":
                return <div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label}   <ErrorLabel /> </label>
                    <Select
                        isLoading={(_.isEmpty(selectOptions) ? true : false)}
                        {...field}
                        name={name}
                        options={selectOptions}
                        menuPlacement='auto'
                        menuPortalTarget={document.body}
                        styles={selectStyles}
                        isDisabled={!canEdit && true}
                        value={((datatype.includes('NUMBER') ? _.filter(selectOptions, ['value', parseNumber(field.value)]) : _.isEmpty(field.value) ? _.filter(selectOptions, ['value', default_value]) : _.filter(selectOptions, ['value', field.value])))}
                        onChange={async (value, props) => {
                            // // // // //console.log(value)

                            //                            // console.log(value, field.value)

                            /// dispatch({ type: HIDDEN_LIST, payload: { [name]: value.value } })

                            if (value?.value !== field.value) {

                                field.onChange(value.value)
                                setValue(name, value.value)
                                //trigger()
                                checkDependencies()

                            }
                        }}

                        onBlur={async (e) => {



                            checkDependencies()
                        }}
                    />
                </div>
            case "inputcheckbox":
                return <div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }}> {label}  <ErrorLabel /> </label>
                    {/* {errors[name] && <Label pointing='below' prompt content={errors[name].message} />} */}
                    <input
                        className={className}
                        {...field}
                        style={{ verticalAlign: 'bottom', Align: "center" }}
                        type='checkbox'
                        key={`field.${name}`}
                        disabled={!canEdit && true}
                        value={_.isEmpty(field.value) ? default_value : field.value}
                        checked={_.split(default_value, ';')[1] === parseNumbertoString(field.value)}
                        onChange={async (e) => {
                            setValue(name, checkbox(e), { shouldDirty: true })
                            field.onBlur(e)
                            checkDependencies()
                        }}
                        onBlur={async (e) => {
                            setValue(name, checkbox(e), { shouldDirty: true })
                            field.onBlur(e)
                            checkDependencies()
                        }}
                    />
                </div>
            case "inputsearch":
                return <div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }}> {label}   <ErrorLabel /></label>
                    <AsyncSelect
                        {...field}
                        isClearable
                        // cacheOptions
                        defaultValue
                        //blurInputOnSelect
                        isDisabled={(!canEdit || readonly === 'true') && true}
                        styles={searchStyles}
                        style={{ fontWeight: 'bold' }}
                        value={(!_.isEmpty(field.value) ?
                            (!_.isObject(field.value) ? JSON.parse(field.value) : field.value)
                            : (!_.isEmpty(default_value) ?
                                (!_.isObject(default_value) ? JSON.parse(default_value) : default_value) : ""))}
                        menuPlacement='auto'
                        menuPortalTarget={document.body}
                        // inputValue={((_.isEmpty(searchValue) ? "" : searchValue))}
                        inputValue={_.isEmpty(getValues(`${name}#displayonly`)) ? "" : getValues(`${name}#displayonly`)}
                        getOptionValue={e => Object.values(e).join(' - ')}//{e => Object.values(e)[0]}//
                        getOptionLabel={formatOptionLabel}//{e => Object.values(e).join(' - ')}//{formatOptionLabel}//e => Object.values(e).join(' - ')}
                        loadOptions={loadOptions}
                        formatGroupLabel={formatGroupLabel}
                        onInputChange={(inputValue, e) => {


                            if (e.action === 'input-change') {
                                if (_.isEmpty(inputValue)) {
                                    // console.log(field, e, 'delete', inputValue)
                                    setValue(`${name}#displayonly`, "")
                                    field.onChange()
                                    //   console.log('after delete ', e.action, inputValue)

                                } else {
                                    //console.log(e.action, inputValue)
                                    setValue(`${name}#displayonly`, inputValue)
                                    field.onChange(e)


                                }

                            }
                            //   setValue(`${name}#displayonly`, e.inputValue)
                        }}
                        onBlur={async (e) => {
                            // clean up value 
                            if (field.value?.action === 'input-change') {
                                setValue(name, null)
                                setValue(`${name}#displayonly`, "")

                            }

                            field.onBlur(e)
                            checkDependencies()
                        }}
                        onChange={async (e) => {

                            // console.log('change')

                            field.onChange(e)


                            if (_.isEmpty(e)) {
                                setValue(`${name}#displayonly`, '')
                                //setSearchValue('');
                            } else {
                                // console.log('update ', Object.values(e).join('    '))
                                setValue(`${name}#displayonly`, Object.values(e).join('    '))
                                //setSearchValue(Object.values(e).join('    '));
                            }
                        }}
                        onKeyDown={async (e) => {

                            ///    // //console.log('down', field.name, _.get(asyncSearchLoad, field.name))

                            /** disable navigaton when list is loading  */

                            /* if (e.code === "Tab" && (_.get(asyncSearchLoad, field.name) || _.isUndefined(_.get(asyncSearchLoad, field.name)))) {
                                //     // //console.log('masuk sini')
                                e.preventDefault();
                                return;
                             }*/
                            if (e.code === "Tab") {
                                if (_.get(asyncSearchLoad, field.name) || _.isUndefined(_.get(asyncSearchLoad, field.name))) {
                                    e.preventDefault();
                                    return;
                                } else if (_.isEmpty(getValues(field.name))) {
                                    // //console.log(searchValue)
                                    setValue(`${name}#displayonly`, '')
                                    //setSearchValue('')
                                }
                            }


                        }}
                        components={{ Input, DropdownIndicator }}
                    />
                </div>
            case "inputdate":
                return <div className={`field ${className}`} key={`d.${name}`} ref={field.ref}>
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label}   <ErrorLabel /> </label>
                    {/* {errors[name] && <Label pointing='below' prompt content={errors[name].message} />} */}
                    <ReactDatePicker
                        // {...field}
                        dateFormat={DATEFORMAT}
                        portalId="root-portal"
                        placeholderText="DD/MM/YYYY"
                        minDate={valueOne}
                        maxDate={valueTwo}
                        isClearable={canEdit == 'false' || canEdit == false || readonly === 'true' ? false : true}
                        readOnly={(!undiscomponent || !canEdit || readonly === 'true') && true}
                        // disabled={(!undiscomponent || !canEdit || readonly === 'true') && true}
                        openToDate={(_.isUndefined(field.value) ? (_.isEmpty(startperiode) ? Date.now() : startperiode) : field.value)}
                        adjustDateOnChange
                        selected={(_.isUndefined(field.value) ? (default_value === 'sysdate' ? sysdate : null) : field.value)}
                        onChange={async (props) => {
                            //setValue(name, props)
                            //  // // // //console.log(props)
                            field.onChange(props)
                            checkDependencies()
                        }}
                        onKeyDown={
                            (e) => {
                                //     // // // // //console.log('down', e)
                                //  setValue(name, new date())
                                if (!isNaN(parseToDate(e.target.value))) {
                                    setValue(name, parseToDate(e.target.value))
                                }
                            }
                        }

                        customInput={<InputMask mask="99/99/9999" style={{ textAlign: 'center', fontWeight: 'bold' }} />}
                    />
                </div>
            case "inputtime":
                return <div className={`field ${className}`} key={`d.${name}`} ref={field.ref}>
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label}   <ErrorLabel /> </label>
                    <ReactDatePicker
                        {...field}
                        dateFormat="HH:mm"
                        placeholderText="HH:MI"
                        timeFormat="HH:mm"
                        name={name}
                        value={field.value}
                        onChange={async (e, va) => {
                            //           // // // // //console.log('change', va)
                            field.onChange(e)

                        }}
                        onSelect={async (e) => {
                            //setValue(name, e) 
                            //   // // // // //console.log('select', e, field)
                        }}
                        showTimeSelectOnly
                        // showTimeSelect
                        timeIntervals={1}
                        selected={field.value ? field.value : null}
                        customInput={<InputMask mask="99:99" style={{ textAlign: 'center' }} />}
                    />
                </div>
            case "input_inputsearch":
                return (
                    <div className={`field ${className}`} key={`d.${name}`} >
                        <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label} <ErrorLabel /></label>
                        <Form.Input icon>
                            {(() => {
                                if (datatype.includes('NUMBER')) {
                                    return <input
                                        {...field}
                                        type='text' //{datatype === ORA_NUMBER ? 'number' : 'text'}
                                        key={`field.${name}`}
                                        disabled={disabled === 'disabled' && true}
                                        value={parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) : parseNumbertoString(field.value)}
                                        //onChange={async (e) => { field.onChange(e) }}
                                        onBlur={async (e) => {

                                            //cekkeDB()


                                            setValue(name, parseNumber(e.target.value), { shouldDirty: true })
                                            checkDependencies()
                                        }}
                                        onKeyDown={async (e) => {
                                            disableEnter(e)
                                        }}
                                        onDoubleKeyPress={
                                            (e) => {

                                                // // // // // //console.log(e)

                                                var keyCode = (e.keyCode || e.which);
                                                if (keyCode === 13) {

                                                    const depValues = _.map(_.split(lov_dependent, ';'), (val, i) => {
                                                        return getValues(val)
                                                    })

                                                    if (isFieldLov(depValues))
                                                        // // // //console.log()
                                                        lovHandler()

                                                    return;
                                                }
                                            }
                                        }

                                    />

                                } else {
                                    return <input
                                        {...field}
                                        type='text'
                                        key={`field.${name}`}
                                        disabled={disabled === 'disabled' && true}
                                        value={(_.isUndefined(field.value) ? (_.isEmpty(default_value) ? '' : default_value) : field.value)}
                                        onChange={async (e) => { field.onChange(e) }}
                                        onBlur={async (e) => {
                                            field.onBlur(e)
                                            checkDependencies()
                                        }}
                                        onKeyDown={async (e) => {
                                            if (e.code === 'NumpadEnter' || e.code === "Enter") {
                                                e.preventDefault();
                                                return;
                                            }
                                            else if (e.code === "KeyL" && e.ctrlKey) {

                                                e.preventDefault();
                                                e.stopPropagation();

                                                const depValues = _.map(_.split(lov_dependent, ';'), (val, i) => {
                                                    return getValues(val)
                                                })
                                                // // // // //console.log('hehe',depValues)
                                                if (isFieldLov(depValues))
                                                    // // // //console.log()
                                                    lovHandler()

                                                return;
                                            }

                                        }
                                        }

                                    />
                                }
                            })()}
                            <Icon
                                name={iconName}
                                bordered
                                color="blue"
                                link
                                onClick={
                                    () => {
                                        const depValues = _.map(_.split(lov_dependent, ';'), (val, i) => {
                                            return getValues(val)
                                        })

                                        if (isFieldLov(depValues))
                                            // // // //console.log()
                                            lovHandler()

                                    }
                                }
                            />
                        </Form.Input>
                    </div>
                )
            case "inputimage":
                return <div className={`field ${className}`} key={`d.${name}`}>
                    {/* <label style={{ fontSize: '8pt' }}> {label}   <ErrorLabel /> </label> */}
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label}   <ErrorLabel /> </label>
                    <Image {...field} className={className} src='https://react.semantic-ui.com/images/wireframe/image.png' />
                    {/* <img  alt={name} /> */}
                </div>
            case "label":
                return <div className={`field ${className}`} key={`d.${name}`}>
                    <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label}   <ErrorLabel /> </label>
                    {(field.value === 'APPROVED') && <Label content={field.value} color="green" icon='checkmark' />}
                    {(field.value !== 'APPROVED') && <Label content={field.value} color="red" icon='warning' />}
                    {/* <img  alt={name} /> */}
                </div>
            case "inputcamera":
                // const videoConstraints = {
                //     width: 1280,
                //     height: 720,
                //     facingMode: "user"
                //   };
                return (
                    <div className={`field ${className}`} key={`d.${name}`} >
                        <label style={{ fontSize: '8pt', fontWeight: 'bold' }} > {label} <ErrorLabel /></label>
                        <Form.Input className={className}>
                            {/* <input
                        className={className}
                        {...field}
                        style={{ verticalAlign: 'bottom', Align: "center" }}
                        type='text'
                        key={`field.${names}`}
                        disabled={!canEdit && true}
                        value={_.isEmpty(field.value) ? "" : field.value}
                        onChange={async (e) => {
                            // // ////// console.log(e.target.checked)
                            setValue(names,webCam ,{shouldDirty:true})
                            checkDependencies()
                            // checkbox(e)
                            field.onChange(e)
                        }}
                        onBlur={async (e) => {
                            setValue(names,webCam,{shouldDirty:true})

                            checkDependencies()
                            // checkbox(e)
                            field.onBlur(e)
                        }}
                    /> */}
                            {/* {console.log(field.value)} */}

                            <input type='text'
                                disabled={(!canEdit || readonly === 'true') && true}
                                style={{ display: "none" }}
                                // readOnly={(!canEdit || readonly === 'true') && true}
                                // accept={contentFile}
                                value={field.value}
                                onChange={async (e) => {

                                    field.onChange(e)

                                    //clearErrors(name)
                                }} />
                            <Label {...field} as='a' content='Capture Photo' icon={iconName} basic color='blue'
                                onClick={(e) => {
                                    dispatch(WebcamPhoto([default_value, filenamecamera, field.name]))
                                    //  setValue(field.name,webCam ,{shouldDirty:true})
                                }}

                            />
                            {/* dispatch(WebcamPhoto([default_value,filenamecamera,field.name]))}} /> */}
                            {!_.isEmpty(field.value) ? <Label
                                as='a'
                                content={`${label.replace("( Upload Dokumen )", " ")} Sudah Diupload`}
                                icon='check circle'
                                color='green'
                                onClick={async () => {
                                    //let x = field.value

                                    //                                let urls = `files/${x.replace(/\\/g, "/")}`

                                    let x = field.value// getValues(`${name.replace('_no', '')}_file`)

                                    let urls //= `ffbgrading/2024/1/30/SMG.24.K1.01_SRT12.jpg`
                                    // if (default_value.match('date')){
                                    const date = new Date()
                                    let rep = _.map(_.split(default_value, ';'), (x, i) => {
                                        return _.replace(x, '#', '')

                                        //    console.log(rep,x,i)

                                    })
                                    rep = _.join(rep, '/')
                                    if (!_.isNil(x)) {
                                        urls = `${x.replace(/\\/g, "/").replace('uploads', '')}`
                                    } else {
                                        if (rep.match('date')) {
                                            // console.log('1')
                                            rep = _.replace(rep, 'date', `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
                                            urls = rep + '/' + filenamecamera + '.jpg'
                                            // setValue(names,urls)
                                        } else {
                                            urls = rep + '/' + filenamecamera + '.jpg'
                                        }
                                    }
                                    const response = await eplantStatic.get(urls, {
                                        method: "GET",
                                        responseType: "blob",
                                    })

                                    /* const response = await eplant.get(urls, {
                                        method: "GET",
                                        responseType: "blob",
                                    })
        */
                                    //   //console.log(response.data)

                                    if (!_.isEmpty(response)) {

                                        // var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
                                        //console.log(response)

                                        const file = new Blob([response.data], {
                                            type: response.data.type
                                        });

                                        //FileSaver.saveAs(file, `${field.name}.pdf`);


                                        const fileURL = URL.createObjectURL(file);
                                        window.open(fileURL, '__blank')

                                        //window.URL.revokeObjectURL(urls)


                                    }
                                }
                                } /> : null}
                        </Form.Input>
                    </div>
                )
            case "file":
                return (<><div className={`field ${className}`} key={`d.${name}`} >
                    <label style={{ fontSize: '8pt' }}> {`${label} - ${limitSize(maxSize)}`}
                        {/* <Icon name='file pdf' color='red' /> */}
                        <ErrorLabel /> </label>
                    <input type='file'
                        disabled={(!canEdit || readonly === 'true') && true}
                        style={{ display: "none" }}
                        // readOnly={(!canEdit || readonly === 'true') && true}
                        accept={contentFile}
                        onChange={async (e) => {

                            field.onChange(e)

                            //clearErrors(name)
                            setValue(name, e.target.value)
                            settempFiles(e.target.files)

                            setUploading(true)

                        }}
                        ref={_fieldref} />
                    {/* <button onClick={this.showOpenFileDlg}>Open</Button>*/}
                    {!_.isEmpty(field.value) && isUpdate != 'V' &&
                        <Label as='a' content='re-Upload File' icon={iconName} color='red' basic image onClick={() => _fieldref.current.click()} />
                    }
                    {_.isEmpty(field.value) && isUpdate != 'V' &&
                        <Label as='a' content='Upload File' icon={iconName} basic color='green' onClick={() => _fieldref.current.click()} />
                    }
                    {/*                     <Label as='a' content={(!_.isEmpty(field.value) ? 're-Upload File' : 'Upload File')} icon='file pdf folder open' basic color='green' onClick={() => _fieldref.current.click()} /> */}
                    {!_.isEmpty(field.value) && <><b>{` -------Status------->`}</b>
                        <Label
                            as='a'
                            content={`${label.replace("( Upload Dokumen )", " ")} Sudah Diupload`}
                            icon='check circle'
                            color='green'
                            onClick={async () => {
                                //let x = field.value

                                //                                let urls = `files/${x.replace(/\\/g, "/")}`

                                let x = field.value// getValues(`${name.replace('_no', '')}_file`)

                                let urls = `${x.replace(/\\/g, "/").replace('uploads', '')}`

                                const response = await eplantStatic.get(urls, {
                                    method: "GET",
                                    responseType: "blob",
                                })

                                /* const response = await eplant.get(urls, {
                                    method: "GET",
                                    responseType: "blob",
                                })
                */
                                //   //console.log(response.data)

                                if (!_.isEmpty(response)) {

                                    // var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
                                    //console.log(response)

                                    const file = new Blob([response.data], {
                                        type: response.data.type
                                    });

                                    //FileSaver.saveAs(file, `${field.name}.pdf`);


                                    const fileURL = URL.createObjectURL(file);
                                    window.open(fileURL, '__blank')

                                    //window.URL.revokeObjectURL(urls)


                                }
                            }
                            } />
                    </>}
                </div>  {startupload && <Progress percent={uploadprogress} indicating progress
                    style={{
                        width: '90vh',
                        height: 'fit-content',
                        marginBlock: 'auto'
                    }}
                    label='Upload Progess *Do Not Refresh This Page' />}
                </>)
            default:
                return <Message
                    key={`error.${name}`}
                    compact
                    color="red"
                    //icon='warning'
                    header={`Error : ${name.toUpperCase()} Itemtype  Not Found`}
                />

        }


    })()


    if (form_visibility === 'GONE' || _.split(getValues('hidelistdisplayonly'), ';').includes(name))
        return <div style={{ display: 'none' }}>{ComponentReturn}</div>




    return ComponentReturn
    //    return (<div  > {ComponentReturn}</div >)

}

export default FormComponents