import React, { useEffect, useState, useRef } from "react";
import { Divider, Form, Grid, Header, Icon, Label } from "semantic-ui-react";
import { useFormContext, Controller } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
//import ReactDatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash'
import Select, { components } from 'react-select'
import InputMask from "react-input-mask";

// *library imports placed above ↑
// *local imports placed below ↓

import "react-datepicker/dist/react-datepicker.css"

import eplant from "../../../apis/eplant";
import { ShowLovDeps, WebcamPhoto, resetLov } from "../../../redux/actions";
import { getFormListComponentObj, isFieldLov, parseDatetoString, parseNumber, parseNumbertoString, parseTimetoString, parseToDate, parseToTime } from "../../../utils/FormComponentsHelpler";

import store from "../../../redux/reducers";
import { selectStyles } from "../Style";
import eplantStatic from "../../../apis/eplantStatic";
import { MODAL_CONTENT_CHANGES, RESET_LOV } from "../../../redux/actions/types";

//const sum = (getValues, setValue, colName, _field) => { let values = 0; _.map(getValues().inputgrid, (x) => values += _.get(x, [colName])); setValue(`${colName}summarydisplayonly`, values) }
const Input = (props) => < components.Input {...props} isHidden={false} />



const FormArrayComponents = ({ index, clickref, names, fieldtype, label, sourcetype, type, disabled, lovs, className, postAction, iseditable, datatype, lov_dependent,
    lov_list_item, child_component, default_value, footer, isFooter, masterdetail, formula, textalign, lov_dependent_values, iconName, isunique, readonly, field_dependence, disabledcomponent, editstatus }) => {

    const dispatch = useDispatch()
    const { getValues, setError, setValue, control, register, getFieldState, handleSubmit, setFocus, trigger } = useFormContext()

    //    console.log(control)

    const rowName = names.substring(0, names.indexOf(']') + 1)
    const rowIdx = names.substring(names.indexOf('[') + 1, names.indexOf(']'))
    const colName = names.substring(names.indexOf(']') + 2)
    const formComponent = getFormListComponentObj()

    let selectOptions = _.filter(useSelector((state) => state.auth.populateselect), [0, colName])

    const lov = useSelector(state => state.auth.selectedValue)
    let gridstatus = useSelector(state => state.auth.gridedit)
    let periode = new Date(useSelector((state) => state.auth.tableDynamicControl.dateperiode))
    let gridMax = useSelector((state) => state.auth.gridwindowmax)
    let startperiode = new Date(periode.getFullYear(), periode.getMonth(), 1)
    let endperiode = new Date(periode.getFullYear(), periode.getMonth() + 1, 0)
    let filenamecamera
    let errorUniq = null, canEdit = true

    const [gridSearchValue, setSearchValue] = useState(null)
    const [formattedDate, setFormattedDate] = useState('');
    const [isValid, setIsValid] = useState(true);

    const [asyncGridSearchLoad, setAsyncSearchLoad] = useState({})

    const inputRef = useRef(null)


    const checkbox = (e) => {
        let value
        let setval
        value = _.split(default_value, ';')

        if (e.target.checked === false) {
            e.target.value = value[0]
            setval = _.includes(datatype, 'NUMBER') == true ? parseNumber(e.target.value) : e.target.value
        } else {
            e.target.value = value[1]
            setval = _.includes(datatype, 'NUMBER') == true ? parseNumber(e.target.value) : e.target.value
        }
        return setval
    }



    if (!_.isEmpty(selectOptions)) {
        selectOptions = Object.values(selectOptions)[0][1].map(v => ({ 'label': Object.values(v)[1], 'value': Object.values(v)[0] }))
    }

    const loadOptions = _.debounce((inputValue, callback) => {

        let deps = ''

        if (lov_dependent) {
            _.map(_.split(lov_dependent, ';'), (val, i) => {
                let ivalue = ''


                if (val === 'sourcetype') {
                    ivalue = sourcetype
                }
                else {

                    if (val.match('header_')) {
                        if (val.match('header_mrnurserycode')) {
                            let code = getValues(val.replace('header_', ''))
                            // // ////// console.log(_.get(code,'code'))
                            // // ////// console.log(typeof code)
                            ivalue = _.get(code, 'code').substring(0, 2)
                            // ivalue = ivalue.substr(0,2)
                        } else {
                            ivalue = getValues(val.replace('header_', ''))
                        }
                    }
                    else {
                        ivalue = getValues(`${rowName}.${val}`)
                    }
                    if (ivalue instanceof Object) {

                        if (ivalue instanceof Date) {
                            ivalue = parseDatetoString(ivalue)
                        } else {
                            ivalue = Object.values(ivalue)[0]
                        }
                    }

                }
                deps += `&${i + 1}=${encodeURIComponent(ivalue)}`
            })
        }

        setAsyncSearchLoad({
            ...asyncGridSearchLoad,
            [names]: true
        })

        eplant.get(`/lov/${lovs}?0=${inputValue}${deps}`).then(res => {

            setAsyncSearchLoad({
                ...asyncGridSearchLoad,
                [names]: false
            })


            callback([{ label: lov_list_item.split(';'), options: res.data.rows }])
        })
    }, 100)


    const CellError = ({ fieldError, isError, getError, content, contentobject, nameComponent, errRowIndex }) => {


        //  console.log(isError)

        let isRowError = false

        if (_.isEmpty(getError) || _.isNil(isError))
            return null;

        const contents = _.isEmpty(content) ? contentobject : content



        _.map(_.filter(_.keys(isError), x => x.includes('inputgrid')), val => {
            const errRowIdx = (!_.isUndefined(val) && val.substring(val.indexOf('[') + 1, val.indexOf(']')))

            if (errRowIdx === errRowIndex) {
                isRowError = true;
                return
            }

        })

        errorUniq = getError?.inputgrid?.type


        if (errorUniq && !_.isEmpty(isunique))
            return <Header
                color="red"
                as={'h5'}
                content={errorUniq}
                style={{ paddingLeft: '5px', fontSize: '9pt', marginBottom: '-0.9px' }} />




        if (isRowError) {

            if (!_.isUndefined(contents)) {
                return <Header
                    color="red"
                    as={'h5'}
                    content={contents.message}
                    style={{ fontSize: '9pt', paddingLeft: '5px', marginBottom: '-0.9px' }} />

            }
            return <span style={{ fontSize: '9pt' }}>&nbsp;</span>
        }


        return null;
    }

    const handleValue = (v) => {
        let x = getValues(names)

        // console.log('handle', x)

        return x
    }

    const CellDisplayError = ({ fieldError, isError, getError, content, contentobject, nameComponent, errRowIndex }) => {

        // // // // // ////// console.log(getValues(), getError.inputgrid.type)

        let isRowError = false

        if (_.isEmpty(getError))
            return null;

        const contents = _.isEmpty(content) ? contentobject : content

        _.map(_.filter(_.keys(isError), x => x.includes('inputgrid')), val => {
            const errRowIdx = (!_.isUndefined(val) && val.substring(val.indexOf('[') + 1, val.indexOf(']')))

            if (errRowIdx === errRowIndex) {
                isRowError = true;
                return
            }

        })

        return null;
    }

    const checkDependencies = () => {


        _.map(_.pickBy(formComponent, x => _.includes(x.child_component, colName))
            , x => {
                //    console.log(x)
                setValue(`${names}#dependenciesdisplayonly.${x.registername}`, getValues(`${rowName}.${x.registername}`))
            })



        if (!_.isEmpty(child_component) && getFieldState(names).isDirty) {



            _.map(child_component.split(';'), (v, i) => {
                const rowfieldname = `${rowName}.${v}`

                if (!_.isEmpty(getValues(rowfieldname))) {

                    if (!_.isEqual(getValues(`${rowfieldname}#dependenciesdisplayonly.${colName}`), getValues(names))) {
                        setValue(rowfieldname, '', { shouldDirty: true })
                    }

                }

            })
        }



        if (!_.isEmpty(formula)) {

            if (formula.indexOf('=') !== -1) {

                let calculateTo = formula.substring(0, formula.indexOf('='))
                let variable1
                let variable2
                let cal
                let val1
                let val2
                let operator = (formula.indexOf('+') === -1 ? (formula.indexOf('-') === -1 ? (formula.indexOf('*') === -1 ? 'N/A' : '*') : '-') : '+')

                if (operator !== 'N/A' && formula.includes("==")) {
                    // // // // ////// console.log('2', formula)
                    variable1 = formula.substring(formula.indexOf('==') + 2, formula.indexOf(operator))
                    variable2 = formula.substring(formula.indexOf(operator) + 1)
                    //let variable2 = formula.substring(0, formula.indexOf('='))
                    // // // // // ////// console.log(variable2)
                    val1 = Number(getValues(`${rowName}.${variable1}`))
                    // // // // // ////// console.log(val2)
                    cal = eval(`${val1} ${operator} ${variable2}`)
                } else if (operator !== 'N/A') {
                    // // // // ////// console.log('1', formula)
                    variable1 = formula.substring(formula.indexOf('=') + 1, formula.indexOf(operator))
                    variable2 = formula.substring(formula.indexOf(operator) + 1)
                    //let variable2 = formula.substring(0, formula.indexOf('='))
                    // // // // // // ////// console.log(variable1)
                    val1 = Number(getValues(`${rowName}.${variable1}`))
                    val2 = Number(getValues(`${rowName}.${variable2}`))

                    cal = eval(`${val1} ${operator} ${val2}`)

                    // } else if( formula.substring(formula.indexOf('<') + 1)) {
                    //     val1 = getValues(`${rowName}.${variable1}`)
                    //     cal = eval(`${val1}`)

                } else {
                    variable1 = formula.substring(formula.indexOf('==') + 2)
                    // // // // ////// console.log('tes', variable1)
                    val1 = getValues(`${rowName}.${variable1}`)
                    // cal= eval(val1)
                    cal = eval(`${typeof val1 === 'string' ? parseNumber(val1) : parseNumber(val1)}`)
                    // cal = typeof cal === 'string' ? eval(cal) : eval(cal)
                    // // // ////// console.log(cal)
                }

                setValue(`${rowName}.${calculateTo}`, cal, { shouldDirty: true })
            } else {


                const __f = formula.split(';')

                // const sign = __f[0]
                const checkvalue = __f[1]




                if (getValues(names) > getValues(`${rowName}.${checkvalue}`)) {
                    setValue(names, getValues(`${rowName}.${checkvalue}`))
                }


            }
        }



        if (!_.isEmpty(lov_dependent_values) && type !== 'input_inputsearch') {

            /*
                ? Handle dependecies from list lov, 
                ? check by position column after id/code in index 0 
                ? if value not used ---> used NA
            */

            const dependent = _.isUndefined(_.get(getValues(names), 'dependence')) ? 'true' : _.get(getValues(names), 'dependence')



            if (dependent === 'true') {


                _.map(lov_dependent_values.split(';'), (v, i) => {
                    const deps = (datatype.includes('NUMBER') ? _.find(selectOptions, ['value', parseNumber(getValues(names))]) : _.find(selectOptions, ['value', getValues(names)]))

                    if (type == 'inputselect') {
                        const rowfieldname = `${rowName}.${v}`
                        setValue(rowfieldname, _.values(deps)[i + 0], { shouldDirty: true })

                    } else {

                        if (v !== 'NA') {

                            const rowfieldname = `${rowName}.${v}`

                            setValue(rowfieldname, _.values(getValues(names))[i + 1], { shouldDirty: true })

                        }
                    }

                })

            }
        }




    }

    const formatOptionLabel = (options, label) => {

        // console.log(names, lov_list_item)

        if (lov_list_item.split(';').length === 1)
            return (<Grid columns={lov_list_item.split(';').length} >
                <Grid.Row  >
                    <Grid.Column
                        key={`l${names}.1`} width={12} children={_.values(options)[1]} />
                </Grid.Row>
            </Grid>)


        return (
            <Grid columns={lov_list_item.split(';').length}  >
                <Grid.Row >
                    {Object.values(options).map(
                        (name, index) => {
                            // // ////// console.log(_.size(_.split(lov_list_item,';')))
                            if (index + 1 > lov_list_item.split(';').length)
                                return null

                            return <Grid.Column
                                key={`gl${name}.${index}`} width={_.size(_.split(lov_list_item, ';')) === 2 ? 4 : null} children={name} />
                            // key={name + index} width={(index === 0 ? 4 : index === 1 ? 8 : 4)} children={name} />
                        })}
                </Grid.Row>
            </Grid>
        )
    };

    const formatGroupLabel = ({ label }) => {
        //// // // // // ////// console.log(label)
        // ////// console.log(label.length)
        return (
            <>
                <Grid column={label.length} style={{ background: 'GhostWhite', position: 'relative', zIndex: 999, width: _.size(_.split(lov_list_item, ';')) == 4 ? '900px' : null }}>
                    <Grid.Row>
                        {label.map((name, index) => (<Grid.Column
                            key={`ggl${name}.${index}`}
                            style={{ fontColor: 'Black' }}
                            width={_.size(_.split(lov_list_item, ';')) == 4 ? 3 : 4}
                            //    width={3}
                            children={name} />))}
                    </Grid.Row>
                </Grid >
                <Divider />
            </>
        )
    };



    useEffect(() => {

        clickref.current = async (cb) => {

            trigger()
            //// ////// console.log('original', control._formValues)

            const deletelist = store.getState().auth.deletelist

            const fValues = _.cloneDeep(control._formValues)

            _.remove(fValues.inputgrid, (v) => {
                return _.find(deletelist, ['tid', v.tid])
            })

            //  // ////// console.log(control._formValues, control._formState.dirtyFields)

            // // ////// console.log(control._formState.dirtyFields, control._formState)
            if (!control._formState.isDirty && _.isEmpty(control._formState.dirtyFields) && _.size(deletelist) === 0)
                return;



            // ////// console.log('after', control)

            if (!control._formState.isDirty && _.size(deletelist) > 0) {
                //  // ////// console.log('1')
                cb(null, control._formState.dirtyFields)
            }
            else if (control._formState.isDirty && _.isEmpty(control._formState.dirtyFields) && _.size(deletelist) > 0) {
                //// ////// console.log('2')
                cb(null, fValues)
            }
            /*     else if (control._formState.isDirty && !_.isEmpty(control._formState.dirtyFields) && _.size(deletelist) > 0) {
                  // ////// console.log('HERES', fValues)
                    cb(control._formValues, fValues)
                } */
            else {
                await handleSubmit(async (data) => {

                    //  // ////// console.log('3')

                    // ////// console.log('data', data)
                    // ////// console.log('data 2', control)


                    if (!control._formState.isDirty || _.isEmpty(control._formState.dirtyFields))
                        return;

                    //    // ////// console.log(data, control._formState.dirtyFields)

                    cb(data, control._formState.dirtyFields)
                })()
            }
        }
    })


    /**handling lov values */
    useEffect(() => {

        if (!_.isEmpty(lov)) {
            // // // // // ////// console.log(lov)

            //console.log(' call lov ', lov)


            let _lov = Object.values(lov)

            if (_lov[0] && (_lov[0] === names)) {

                let val = Object.values(_lov[1].values)


                const lovCol = _lov[0].substr(_lov[0].indexOf('.') + 1)
                const lovRow = _lov[0].substr(0, _lov[0].indexOf('.'))

                setTimeout(() => {

                    setValue(_lov[0], val[0], { shouldDirty: true })

                    if (!_.isEmpty(lovCol) && !_.isEmpty(formComponent[lovCol].lov_dependent_values))
                        //setTimeout(() => {
                        _.map(formComponent[lovCol].lov_dependent_values.split(";"),
                            (z, index) => {


                                if (formComponent[z].fieldtype === 'fieldcalculate') {
                                    setValue(`${lovRow}.${z}`, val[index + 1], { shouldDirty: true })
                                }
                                else {
                                    if (!_.isNull(val[index + 1])) {
                                        setValue(`${lovRow}.${z}`, val[index + 1], { shouldDirty: true })
                                    }
                                    // console.log(val[index+1])
                                    // setValue(`${lovRow}.${z}`, val[index + 1], { shouldDirty: true })
                                }

                                if (typeof val[index + 1] === 'number') {
                                    // // // // ////// console.log('error')
                                    setValue(`${lovRow}.max#${z}#displayonly`, val[index + 1], { shouldDirty: true })
                                }

                            }
                        )

                    setFocus(_lov[0])


                }, 0.01);
                //       ////// console.log('masuk sini ', _lov[0])

                // clear lov selected list 

                dispatch({ type: MODAL_CONTENT_CHANGES, payload: [] })

            }


        }


    }, [lov]);


    const Placeholder = props => {
        return <components.Placeholder {...props} />;
    };



    const DropdownIndicator = props => {

        return (
            <components.DropdownIndicator {...props} >
                <div>
                    <i aria-hidden="true" className="search icon blue"></i>
                </div>
            </components.DropdownIndicator >
        );
    };

    const handleDateChange = (e) => {
        const inputDate = e.target.value;

        // Remove hyphens and other non-numeric characters
        const cleanedDate = inputDate.replace(/[^0-9]/g, '');

        // Add hyphens to format as dd-mm-yyyy
        const formattedDate = `${cleanedDate.slice(0, 2)}-${cleanedDate.slice(2, 4)}-${cleanedDate.slice(4, 8)}`;

        // Check if the formatted date is valid
        const isValidDate = /^\d{2}-\d{2}-\d{4}$/.test(formattedDate);

        // Update states
        //setValue(names, formattedDate);

        if (isValidDate) {

            // console.log('valid date ', formattedDate)

            //            setValue(names, formattedDate);
            setValue(names, parseToDate(formattedDate), { shouldDirty: true });

        } else {
            setValue(names, inputDate, { shouldDirty: true });
        }
    };

    const handleTimeChange = (e) => {
        const inputTime = e.target.value;

        // Remove hyphens and other non-numeric characters
        const cleanedDate = inputTime.replace(/[^0-9]/g, '');

        // Add hyphens to format as dd-mm-yyyy
        const formattedTime = `${cleanedDate.slice(0, 2)}:${cleanedDate.slice(2, 4)}`;

        // Check if the formatted date is valid
        const isValidDate = /^\d{2}:\d{2}$/.test(formattedTime);

        // Update states
        //setValue(names, formattedDate);

        //        console.log(inputTime, formattedTime)

        if (isValidDate) {

            //          console.log('valid date ', formattedDate)

            //            setValue(names, formattedDate);
            setValue(names, parseToTime(formattedTime), { shouldDirty: true });

        } else {
            setValue(names, inputTime, { shouldDirty: true });
        }
    };



    const lovHandler = async () => {

        let deps = ''

        if (lov_dependent) {
            _.map(_.split(lov_dependent, ';'), (val, i) => {
                let ivalue = ''
                if (val === 'sourcetype') {
                    ivalue = sourcetype
                }
                else {
                    if (val.includes('header_')) {
                        //                        // // // // ////// console.log(i, val, getValues(`${val.replace('header_', '')}`))
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

                        ivalue = getValues(`${rowName}.${val}`)

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
            })

        }
        await dispatch(ShowLovDeps(lovs, names, (_.isNil(getValues(names)) ? '' : getValues(names)), deps))
    }

    // ////// console.log(_.map(formComponent,(v,i)=>{
    //     return v
    // }))
    /*   if (fieldtype === 'inputsearch') {
         // ////// console.log(,getValues(names))
     
     
     
         if (_.isEmpty(getValues(names)) && gridSearchValue !== '') {
     
             // console.log('changes', names, getValues(names), gridSearchValue)
     
             setSearchValue('')
         }
     } 
    */
    const webCam = useSelector(state => state.auth.webcamValue)
    const action = useSelector(state => state.auth.actionlabel)
    if (type == 'inputcamera') {
        let res = _.map(field_dependence.split(';'), (v, i) => {
            filenamecamera = `${rowName}.${v}`
            // console.log(getValues())
            filenamecamera = getValues(`${rowName}.${v}`)
            // console.log(filenamecamera)
            return filenamecamera
        })
        filenamecamera = _.join(res, '_')
        _.map(webCam, (x, i) => {
            // console.log('hehe',x)
            if (x.name == names) {
                setValue(names, x.data, { shouldDirty: true })
            }
        })
        // console.log(filenamecamera)
        // console.log(useSelector(state => state.auth.modals.content))
    }
    if (!_.isNull(disabledcomponent)) {
        let vars = _.split(disabledcomponent, '#')
        vars[2] = typeof vars[2] == 'number' ? Number(vars[2]) : vars[2]
        if (vars[0] == 'disabled') {
            if (_.get(getValues(`${rowName}.${vars[1]}`), 'itemtype') == vars[2]) {
                readonly = 'true'
            }
        }
    }
    if (iseditable === 'false') {
        canEdit = false
    }

    if (isFooter) {
        const deletelist = store.getState().auth.deletelist
        if (footer === 'count')
            return null

        return (<div
            className={`ui input ${className}`}
            {...control._fields}
            type='text'
            style={{ fontWeight: 'bold' }}
            key={`field.${names}`}
            readOnly >
            {_.isEmpty(deletelist) ? parseNumbertoString(getValues(names)) : parseNumbertoString(getValues(names) - _.sum(_.map(deletelist, (v, i) => {
                return parseNumber(_.get(v, _.replace(names, 'summarydisplayonly', '')))
            })))}        </div>);
    } else {
        if ((editstatus == 'always' || gridstatus.status === true && getValues(`${rowName}.rowid`) === gridstatus.id) || (_.isEmpty(getValues(`${rowName}.rowid`)) && !isFooter)) {
            switch (type) {
                case "fieldcalculate":
                case "inputdatesimple":
                case "inputdatesimpleold":
                case "inputselect":
                case "inputsearch":
                case "inputtime":
                case "inputtimeold":
                case "textarea":
                case "input":
                case "inputcheckbox":
                case "inputcamera":
                    return (
                        <Controller control={control}
                            name={names}
                            render={({ field, fieldState, formState: { errors, isDirty, dirtyFields } }) =>
                            (<>
                                {errors && <CellError isError={errors} getError={errors} content={errors[names]} contentobject={errors[`${names}.code`]} nameComponent={names} errRowIndex={rowIdx} />}
                                {
                                    (() => {
                                        if (type.match(/^(textarea|input|fieldcalculate)$/)) {
                                            if (datatype.includes('NUMBER')) {

                                                return (
                                                    <Form.Input className={className} >
                                                        <input
                                                            className={`field ${className}`}
                                                            {...field}
                                                            type='text'
                                                            key={`field.${names}`}
                                                            readOnly={(!canEdit || readonly === 'true') && true}
                                                            value={!_.isNull(formula) ?
                                                                formula.includes('==') ?
                                                                    parseNumbertoString(field.value) === '0' ?
                                                                        (checkDependencies(), parseNumbertoString(default_value)) :
                                                                        (checkDependencies(), parseNumbertoString(field.value)) :
                                                                    parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) :
                                                                        parseNumbertoString(field.value) : parseNumbertoString(field.value) === '0' ?
                                                                    parseNumbertoString(default_value) : parseNumbertoString(field.value)}
                                                            // parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) : parseNumbertoString(field.value)
                                                            onBlur={async (e) => {
                                                                field.onBlur(e)
                                                                setValue(names, parseNumber(e.target.value), { shouldDirty: true })
                                                                checkDependencies()
                                                            }}
                                                            onChange={async (e) => {
                                                                field.onChange(e)
                                                                setValue(names, (e.target.value), { shouldDirty: true })
                                                                checkDependencies()
                                                            }}

                                                        />
                                                    </Form.Input >
                                                )
                                            }
                                            else {
                                                return (
                                                    <Form.Input className={className}>
                                                        <input
                                                            {...field}
                                                            className={`field ${className}`}
                                                            type='text'
                                                            key={`field.${names}`}
                                                            readOnly={(!canEdit || readonly === 'true') && true}
                                                            style={{ backgroundColor: 'white' }}
                                                            value={(_.isEmpty(field.value) ? (_.isEmpty(default_value) ? '' : default_value) : field.value)}
                                                            onChange={async (e) => {

                                                                setValue(names, (e.target.value), { shouldDirty: true })
                                                                field.onChange(e)


                                                            }}
                                                            onBlur={async (e) => {
                                                                field.onBlur(e)
                                                                setValue(names, (e.target.value), { shouldDirty: true })
                                                                checkDependencies()
                                                            }}
                                                        />
                                                    </Form.Input >

                                                )
                                            }
                                        }
                                        else if (type === 'inputdatesimple') {
                                            return <div >
                                                <input
                                                    {...field}
                                                    type="text"
                                                    value={_.isNil(field.value) ? "" : field.value instanceof Date ? parseDatetoString(field.value) : field.value}
                                                    onChange={handleDateChange}
                                                    placeholder="DD-MM-YYYY"
                                                    readOnly={(!canEdit || readonly === 'true') && true}
                                                    style={{
                                                        textAlign: 'center',
                                                        border: "1px solid white",
                                                        fontSize: 'x-small',
                                                        width: '100%',
                                                        boxSizing: 'border-box',
                                                        paddingTop: '6px',
                                                        paddingBottom: '6px',
                                                        outline: 'none'
                                                        //borderRadius: "5%"
                                                    }}
                                                />
                                            </div>
                                        }
                                        else if (type === 'inputtime') {
                                            return <div className={`field field ${className}`}>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    readOnly={(!canEdit || readonly === 'true') && true}
                                                    value={field.value instanceof Date ? parseTimetoString(field.value) : field.value}
                                                    onChange={handleTimeChange}
                                                    placeholder="HH:MI"
                                                    style={{ textAlign: 'center' }}
                                                />
                                            </div>
                                        }
                                        else if (type === 'inputtimeold') {
                                            return (
                                                <div className={`field field ${className}`} ref={field.ref}>
                                                    <InputMask
                                                        {...field}
                                                        mask="99:99"
                                                        value={_.isNil(field.value) ? '' : (parseTimetoString(field.value) === '' ? parseTimetoString(default_value) : parseTimetoString(field.value))}
                                                        style={{ textAlign: 'center' }}
                                                        onChange={
                                                            (e) => {
                                                                if (e.target.value.includes('_')) {
                                                                    setValue(names, e.target.value, { shouldDirty: true })
                                                                } else {
                                                                    setValue(names, parseToTime(e.target.value), { shouldDirty: true })
                                                                }
                                                            }
                                                        }
                                                    >
                                                        {(inputProps) => (
                                                            <input
                                                                {...inputProps}
                                                                ref={field.ref}
                                                                type="text"
                                                                placeholder="HH:MI"
                                                            />
                                                        )}
                                                    </InputMask>
                                                </div >
                                            );
                                        }
                                        else if (type === 'inputselect') {
                                            return (
                                                <Select
                                                    {...field}
                                                    className={`field ${className}`}
                                                    name={names}
                                                    isDisabled={readonly === 'true' && true}
                                                    isLoading={(_.isEmpty(selectOptions) ? true : false)}
                                                    options={selectOptions}
                                                    menuPlacement={gridMax ? (rowIdx < 5 ? 'bottom' : 'top') : 'auto'}
                                                    menuPortalTarget={gridMax ? document.getElementById('portal-target') : document.querySelector('body')}
                                                    styles={selectStyles}
                                                    value={((datatype.includes('NUMBER') ? _.filter(selectOptions, ['value', parseNumber(field.value)]) : _.isEmpty(field.value) ? _.filter(selectOptions, ['value', default_value]) : _.filter(selectOptions, ['value', field.value])))}
                                                    onChange={async (value, props) => {
                                                        field.onChange(value.value)
                                                        checkDependencies()
                                                    }}
                                                />);
                                        } else if (type === 'inputcheckbox') {
                                            return <Form.Input className={className}>
                                                <input
                                                    className={className}
                                                    {...field}
                                                    style={{ verticalAlign: 'bottom', Align: "center" }}
                                                    type='checkbox'
                                                    key={`field.${names}`}
                                                    disabled={!canEdit && true}
                                                    value={_.isEmpty(field.value) ? "" : field.value}
                                                    // checked={_.split(default_value, ';')[1] === parseNumbertoString(field.value)}
                                                    // defaultChecked ={ console.log((_.split(default_value, ';')[1] === typeof field.value == 'number' ? field.value.toString() : field.value) == '1'? "checked" : (field.value) ? "" : "")}
                                                    defaultChecked={(_.split(default_value, ';')[1] === typeof field.value == 'number' ? field.value.toString() : field.value) == '1' || (_.split(default_value, ';')[1] === typeof field.value == 'number' ? field.value.toString() : field.value) == 'Y' ? "checked" : (field.value) ? "" : ""}
                                                    // checked={(_.split(default_value, ';')[0] == field.value) ? false : _.isEmpty(field.value) ? false : true}
                                                    onChange={async (e) => {
                                                        // // ////// console.log(e.target.checked)
                                                        setValue(names, checkbox(e), { shouldDirty: true })
                                                        checkDependencies()
                                                        // checkbox(e)
                                                        field.onChange(e)
                                                    }}
                                                    onBlur={async (e) => {
                                                        setValue(names, checkbox(e), { shouldDirty: true })

                                                        checkDependencies()
                                                        // checkbox(e)
                                                        field.onBlur(e)
                                                    }}
                                                />
                                            </Form.Input>
                                        } else if (type == 'inputcamera') {

                                            return (<Form.Input className={className}>
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

                                            )
                                        } else {
                                            return <AsyncSelect
                                                {...field}
                                                className={`field ${className}`}
                                                isClearable
                                                cacheOptions={_.isEmpty(lov_dependent)}
                                                defaultValue
                                                isDisabled={readonly === 'true' && true}
                                                styles={selectStyles}
                                                noOptionsMessage={({ inputValue }) => {
                                                    if (!_.isEmpty(field.value) || (_.isEmpty(inputValue) && _.isEmpty(field.value)))
                                                        return null;

                                                }}
                                                value={(!_.isEmpty(field.value) ? (!_.isObject(field.value) ? JSON.parse(field.value) : field.value) : "")}
                                                inputValue={((_.isEmpty(gridSearchValue) ? "" : gridSearchValue))}
                                                menuPlacement={gridMax ? (rowIdx < 5 ? 'bottom' : 'top') : 'auto'}
                                                menuPortalTarget={gridMax ? document.getElementById('portal-target') : document.querySelector('body')}
                                                getOptionValue={e => Object.values(e).join(' - ')}//{e => Object.values(e)[0]}//
                                                getOptionLabel={formatOptionLabel}//{e => Object.values(e).join(' - ')}//{formatOptionLabel}//e => Object.values(e).join(' - ')}
                                                loadOptions={loadOptions}
                                                formatGroupLabel={formatGroupLabel}
                                                onInputChange={async (inputValue, { action }) => {
                                                    if (action === 'input-change') {
                                                        setSearchValue(inputValue)
                                                    }
                                                }}
                                                onBlur={async (e) => {
                                                    field.onBlur(e)
                                                    checkDependencies()
                                                }}
                                                onChange={async (e) => {
                                                    field.onChange(e)

                                                    if (_.isEmpty(e)) {
                                                        setSearchValue('');
                                                    } else {
                                                        const labels = _.map(lov_list_item.split(';'), x => _.get(e, x))

                                                        if (_.some(labels, _.isUndefined)) {
                                                            setSearchValue(Object.values(e).join(','));
                                                            checkDependencies()
                                                        } else {
                                                            setSearchValue(labels.join(' - '));
                                                            checkDependencies()
                                                        }
                                                    }
                                                }}
                                                onKeyDown={async (e) => {
                                                    if (e.code === "Tab") {


                                                        if (_.isUndefined(_.get(asyncGridSearchLoad, names))) {
                                                            // losss


                                                        } else {
                                                            if (_.get(asyncGridSearchLoad, names)) {
                                                                e.preventDefault();
                                                                return;
                                                            }

                                                            if (_.isEmpty(field.value)) {
                                                                //          ////// console.log(gridSearchValue)0
                                                                setSearchValue('')
                                                            }
                                                        }
                                                    }
                                                }
                                                }
                                                components={{ Input, DropdownIndicator }}
                                            />

                                        }
                                    }
                                    )()
                                }
                            </>
                            )
                            }
                        />
                    );
                case "input_inputsearch":
                    return (
                        <Controller
                            control={control}
                            name={names}
                            render={({ field, fieldState: { error }, formState: { errors, isDirty, dirtyFields } }) =>
                            (
                                <>
                                    <CellError isError={errors} getError={errors} content={errors[`${names}.code`]} nameComponent={names} errRowIndex={rowIdx} />
                                    {
                                        (() => {
                                            return <Form.Input icon >
                                                {(() => {
                                                    if (datatype.includes('NUMBER')) {
                                                        return <input
                                                            {...field}
                                                            type='text' //{datatype === ORA_NUMBER ? 'number' : 'text'}
                                                            key={`field.${names}`}
                                                            disabled={disabled === 'disabled' && true}
                                                            //                                                            value={parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) : parseNumbertoString(field.value)}
                                                            value={(_.isNil(field.value) ? (_.isEmpty(default_value) ? '' : parseNumbertoString(default_value)) : parseNumbertoString(field.value))}
                                                            //onChange={async (e) => { field.onChange(e) }}
                                                            onBlur={async (e) => {

                                                                // console.log('update', e)

                                                                setValue(names, parseNumber(e.target.value), { shouldDirty: true })

                                                                checkDependencies()
                                                            }}
                                                            onKeyDown={async (e) => {
                                                                if (e.code === "KeyL" && e.ctrlKey) {

                                                                    e.preventDefault();
                                                                    e.stopPropagation();

                                                                    const depValues = _.map(_.split(lov_dependent, ';'), (val, i) => {
                                                                        if (val.includes('header_')) {
                                                                            return getValues(`${val.replace('header_', '')}`)
                                                                        } else {
                                                                            return getValues(`${rowName}.${val}`)
                                                                        }
                                                                    })

                                                                    if (isFieldLov(depValues))
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
                                                            style={{ fontSize: 'small' }}
                                                            key={`field.${names}`}
                                                            disabled={disabled === 'disabled' && true}
                                                            value={(_.isNil(field.value) ? (_.isEmpty(default_value) ? '' : default_value) : field.value)}
                                                            //onChange={async (e) => { field.onChange(e) }}
                                                            onBlur={async (e) => {
                                                                field.onBlur(e)
                                                                checkDependencies()
                                                            }}
                                                            onKeyDown={async (e) => {
                                                                if (e.code === "KeyL" && e.ctrlKey) {

                                                                    e.preventDefault();
                                                                    e.stopPropagation();

                                                                    const depValues = _.map(_.split(lov_dependent, ';'), (val, i) => {
                                                                        if (val.includes('header_')) {
                                                                            return getValues(`${val.replace('header_', '')}`)
                                                                        } else {
                                                                            return getValues(`${rowName}.${val}`)
                                                                        }
                                                                    })

                                                                    if (isFieldLov(depValues))
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
                                                    color={"blue"}
                                                    link
                                                    onClick={
                                                        () => {

                                                            const depValues = _.map(_.split(lov_dependent, ';'), (val, i) => {
                                                                if (val.includes('header_')) {
                                                                    return getValues(`${val.replace('header_', '')}`)
                                                                } else {
                                                                    return getValues(`${rowName}.${val}`)
                                                                }
                                                            })
                                                            if (isFieldLov(depValues))
                                                                lovHandler()

                                                        }
                                                    }
                                                />
                                            </Form.Input>
                                        }
                                        )()
                                    }
                                </>
                            )
                            }
                        />
                    )
                default:
                    return (<Label content={`Error : ${names.toUpperCase()} Itemtype Not Found`} />)
            }

        }
        else {
            const thisField = register(names)

            const { name } = thisField

            const err = !_.isUndefined(control._formState.errors) && control._formState.errors


            return (<div className={`field ${className}`} key={`field.${name}`}
                style={{ textAlign: (_.isEmpty(textalign) ? 'left' : textalign), paddingRight: '0.1cm', paddingLeft: '0.1cm', fontSize: 'x-small' }}>
                <CellDisplayError isError={err} getError={err} content={err[names]} contentobject={err[`${names}.code`]} nameComponent={names} errRowIndex={rowIdx} />
                {
                    (() => {
                        switch (type) {
                            case 'inputdate':
                            case 'inputdatesimple':
                                return (_.isDate(getValues(name)) ? parseDatetoString(getValues(name)) : '')
                            case 'inputtime':
                                return (_.isDate(getValues(name)) ? `${_.padStart(getValues(name).getHours(), 2, '0')}:${_.padStart(getValues(name).getMinutes(), 2, '0')}` : '')
                            case 'inputsearch':
                                return _.isEmpty(getValues(name)) ? '' : _.isUndefined(_.get(getValues(name), 'description')) ? `${_.get(_.map(getValues(name)), [0])} - ${_.get(getValues(name), 'desc')} ` : `${_.get(_.map(getValues(name)), [0])} - ${_.get(getValues(name), 'description')} `
                            case 'inputselect':
                                return _.get(_.find(_.filter(selectOptions, ['value', getValues(name)])), 'label')
                            case 'input':
                                if (datatype.includes('NUMBER')) {
                                    return getValues(name) === 'null' ? '' : parseNumbertoString(getValues(name))
                                }
                                else {
                                    return getValues(name) === 'null' ? '' : getValues(name)
                                }
                            case 'inputcamera':
                                return _.isNull(getValues(name)) ? '' : <Label
                                    as='a'
                                    content={`${label.replace("( Upload Dokumen )", " ")} Sudah Diupload`}
                                    icon='check circle'
                                    color='green'
                                    onClick={async () => {
                                        //let x = field.value

                                        //                                let urls = `files/${x.replace(/\\/g, "/")}`

                                        let x = getValues(name)// getValues(`${name.replace('_no', '')}_file`)

                                        let urls //= `ffbgrading/2024/1/30/SMG.24.K1.01_SRT12.jpg`
                                        // if (default_value.match('date')){
                                        const date = new Date()
                                        let rep = _.map(_.split(default_value, ';'), (x, i) => {
                                            return _.replace(x, '#', '')

                                            //    console.log(rep,x,i)

                                        })
                                        //    rep = _.join(rep,'/')
                                        //    if (!_.isNil(x)){
                                        urls = `${x.replace(/\\/g, "/").replace('uploads', '')}`
                                        //    } else {
                                        //     if (rep.match('date')){
                                        //         // console.log('1')
                                        //         rep = _.replace(rep,'date', `${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()}`)
                                        //         urls =  rep +'/'+filenamecamera +'.jpg'
                                        //         // setValue(names,urls)
                                        //     } else {
                                        //         urls =  rep +'/'+filenamecamera +'.jpg'
                                        //     }
                                        //    }
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
                            default:
                                return getValues(name) === 'null' ? '' : getValues(name)
                        }
                    })()
                }
            </div >
            )
        }

    }
}



export default FormArrayComponents