import React, { useEffect, useRef } from "react";
import { Divider, Form, Grid, Header, Icon, Label, Select } from "semantic-ui-react";
import { useFieldArray, useFormContext, useFormState } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import ReactDatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash'

import InputMask from "react-input-mask";

// *library imports placed above ↑
// *local imports placed below ↓

import { DATEFORMAT, NEWS } from "../../Constants";
import eplant from "../../../apis/eplant";
import { DialogLoading, ShowLovDeps } from "../../../redux/actions";
import foo from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import { parseDatetoString, parseNumber, parseNumbertoString, parseStrTimeTodate, parseToDate, perseEpochToDate } from "../../../utils/FormComponentsHelpler";
import { MODAL_TRX_OPEN } from "../../../redux/actions/types";

const sum = (getValues, setValue, colName, _field) => {



    let values = 0
    _.map(getValues().inputgrid, (x) => {

        //// console.log(colName, _.get(x, [colName]))
        values += _.get(x, [colName])
    })

    // // console.log(values)

    setValue(`${colName}summarydisplayonly`, values)

}


const FormArrayComponents = ({ clickref, field, label, sourcetype, type, disabled, lovs, className, postAction, iseditable, datatype, lov_dependent,
    lov_list_item, child_component, default_value, footer, isFooter, masterdetail, formula }) => {


    // console.log(field)

    const dispatch = useDispatch()
    const { name } = field
    const inputgrid = useRef(null);
    const { getValues, setValue, control, register, getFieldState, handleSubmit } = useFormContext()

    const { ref, ...rest } = register(name);

    //const { errors, dirtyFields, isDirty, touchedFields } = useFormState(control)


    let selectOptions = _.filter(useSelector((state) => state.auth.populateselect), [0, lovs])
    let lov = useSelector(state => state.auth.selectedValue)
    let gridstatus = useSelector(state => state.auth.gridedit)
    let periode = new Date(useSelector((state) => state.auth.tableDynamicControl.dateperiode))


    let startperiode = new Date(periode.getFullYear(), periode.getMonth(), 1)


    let endperiode = new Date(periode.getFullYear(), periode.getMonth() + 1, 0)


    const rowName = name.substring(0, name.indexOf(']') + 1)
    const rowIdx = name.substring(name.indexOf('[') + 1, name.indexOf(']'))
    const colName = name.substring(name.indexOf(']') + 2)


    let arrayError = []
    let errorUniq = null
    let dataclean

    let canEdit = true

    if (iseditable && !postAction.match(NEWS)) {
        canEdit = false
    }

    // // console.log(getValues())

    //  // console.log('grids', errors)//, _.isEmpty(errors))

    //  // console.log('form', field.value)

    if (!_.isEmpty(errors) && !_.isUndefined(errors["inputgrid"])) {

        //    // console.log(errors)

        if (!_.isUndefined(errors.inputgrid["type"])) {

            if (errors.inputgrid["type"] === 'unique') {
                arrayError = errors.inputgrid.message.split(",")
            }
        }

        if (_.includes(arrayError, rowIdx)) {
            errorUniq = 'Duplicate Rows'
        }

    }


    useEffect(() => {

        clickref.current = async (cb) => {

            // await dispatch({ type: MODAL_TRX_OPEN })

            await handleSubmit(async (data) => {
                // // console.log('ih 1')
                // console.log('handle submit')

                // console.log('handle submit open loading supposedly')

                if (!isDirty) {
                    return;
                }




                let inserts = []
                let updates = []
                let header




                cb(data, { header, inserts, updates })


            })()


        }
    })




    const lovHandler = () => {

        const deps = _.map(_.split(lov_dependent, ';'), x => {
            if (x === 'sourcetype') {
                window[`${x}0`] = sourcetype;
                //// console.log(window['sourcetype0'])
                return window[`${x}0`]
            }
            else {
                return x
            }
        })
        dispatch(ShowLovDeps(lovs, name, (_.isNil(field.value) ? '' : field.value), deps))
    }

    const CellError = ({ isError, content, nameComponent, errRowIndex }) => {

        let isRowError = false

        _.map(_.filter(_.keys(isError), x => x.includes('inputgrid')), val => {
            const errRowIdx = (!_.isUndefined(val) && val.substring(val.indexOf('[') + 1, val.indexOf(']')))

            if (errRowIdx === errRowIndex) {
                isRowError = true;
                return
            }

        })


        /* 
                if (type === 'inputsearch')
                    // console.log(name,content)
         */

        if (errorUniq)
            return <Header
                color="red"
                as={'h5'}
                content={errorUniq}
                style={{ paddingLeft: '5px', marginBottom: '-0.9px' }} />



        //        // console.log(_.keys(isError), name)

        //if (!_.isUndefined(isError)) {

        if (isRowError) {

            if (!_.isUndefined(content))
                return <span style={{ fontSize: '9pt', color: 'red', fontWeight: 'bold' }}>{content.message}</span>


            return <span style={{ fontSize: '9pt' }}>&nbsp;</span>
        }


        return null;
    }

    const FooterError = ({ isError, content }) => {

        // // console.log(isError)

        if (!_.isEmpty(isError))
            return <Header
                color="red"
                as={'h5'}
                content={'error'}
                style={{ paddingLeft: '5px', marginBottom: '-0.9px' }} />



        return null;
    }


    const loadOptions = _.debounce((inputValue, callback) => {

        let deps = ''

        if (lov_dependent) {
            _.map(_.split(lov_dependent, ';'), (val, i) => {
                let ivalue = ''

                //  // console.log(val)

                if (val === 'sourcetype') {
                    ivalue = sourcetype
                }
                else {
                    ivalue = getValues(`${name.substring(-1, name.indexOf(']') + 1)}.${val}`)

                    if (ivalue instanceof Object) {
                        ivalue = Object.values(ivalue)[0]
                    }

                }
                deps += `&${i + 1}=${ivalue}`
            })

        }

        eplant.get(`/lov/${lovs}?0=${inputValue}${deps}`).then(res => {
            callback([{ label: lov_list_item.split(';'), options: res.data.rows }])
        })
    }, 500)



    const formatOptionLabel = (options, label) => {

        if (lov_list_item.split(';').length === 1)
            return (<Grid columns={lov_list_item.split(';').length}>
                <Grid.Row >
                    <Grid.Column
                        key={name + '1'} width={11} children={_.values(options)[1]} />
                </Grid.Row>
            </Grid>)


        return (
            <Grid columns={lov_list_item.split(';').length}>
                <Grid.Row >
                    {Object.values(options).map(
                        (name, index) => {
                            if (index + 1 > lov_list_item.split(';').length)
                                return null

                            return <Grid.Column
                                key={name + index} width={(index === 0 ? 3 : index === 1 ? 8 : 3)} children={name} />
                        })}
                </Grid.Row>
            </Grid>
        )
    };

    const formatGroupLabel = ({ label }) => {
        //// console.log(label)
        return (
            <>
                <Grid column={label.length} style={{ background: 'GhostWhite' }}>
                    <Grid.Row>
                        {label.map((name, index) => (<Grid.Column
                            key={name + index}
                            style={{ fontColor: 'Black' }}
                            width={(index === 0 ? 4 : 6)} children={name} />))}
                    </Grid.Row>
                </Grid >
                <Divider />
            </>
        )


    };

    const checkDependencies = () => {

        if (!_.isEmpty(child_component) && getFieldState(name).isDirty) {
            //   // console.log('masuk')
            _.map(child_component.split(';'), (v, i) => {
                //// console.log(v)
                const rowfieldname = `${rowName}.${v}`
                if (!_.isEmpty(getValues(rowfieldname))) {
                    setValue(rowfieldname, null, { shouldDirty: true })
                }
            })
        }

        if (!_.isEmpty(formula)) {

            let calculateTo = formula.substring(0, formula.indexOf('='))

            let operator = (formula.indexOf('+') === -1 ?
                (formula.indexOf('-') === -1 ?
                    (formula.indexOf('*') === -1 ? 'N/A' : '*') : '-') : '+')

            let variable1 = formula.substring(formula.indexOf('=') + 1, formula.indexOf(operator))
            let variable2 = formula.substring(formula.indexOf(operator) + 1)
            //let variable2 = formula.substring(0, formula.indexOf('='))

            let val1 = getValues(`${rowName}.${variable1}`)
            let val2 = getValues(`${rowName}.${variable2}`)
            let cal = eval(`${val1} ${operator} ${val2}`)

            setValue(`${rowName}.${calculateTo}`, cal, { shouldDirty: true })
        }

    }


    /*     useEffect(() => {
            if (type == 'inputtime') {
                if (field.value instanceof Date)
                    // console.log(name, field.value.getTime())
            }
        }, [type]);
    
     */


    /* HANDLING LOV */
    useEffect(() => {
        if (!_.isUndefined(lov)) {
            lov = Object.values(lov)
            if (lov[0]) {
                //   // console.log(lov[1].cells)
                try {
                    setValue(lov[0], lov[1].cells[0].value) //set value to call object 
                    setValue(`${lov[0]}displayonly`, lov[1].cells[1].value)//add description value for called object 
                } catch {
                    setValue(lov[0], '')
                }
            }
        }
    }, [lov]);



    if (!_.isEmpty(selectOptions)) {

        selectOptions = Object.values(selectOptions)[0][1].map(v => (
            //   const x = Object.values(v)
            {
                'key': Object.values(v)[0],
                'text': Object.values(v)[1],
                'value': Object.values(v)[0]
            })
        )

    }

    //// console.log('formvalues', getValues())

    //// console.log(name, errors[name], errors)
    if (isFooter)
        return (
            <>
                <FooterError isError={errors} content={errors[name]} />
                <Form.Input className={className}>
                    <input
                        className={className}
                        {...field}
                        type={datatype.includes('NUMBER') ? 'number' : 'text'}
                        style={{ fontWeight: 'bold' }}
                        key={`field.${name}`}
                        readOnly
                        value={field.value || ''}
                        onClick={() => {

                        }}
                    />
                </Form.Input >
            </>
        );



    return (<div {...field} className={`field.${className}`} key={`field.${name}`} style={{ textAlign: 'center' }}>
        {
            (() => {
                switch (type) {
                    case 'inputtime':
                        return _.isEmpty(field.value) ? '' : `${_.padStart(field.value.getHours(), 2, '0')}:${_.padStart(field.value.getMinutes(), 2, '0')}`
                    case 'inputsearch':
                        return _.isEmpty(field.value) ? '' : `${_.get(field.value, 'code')} - ${_.get(field.value, 'description')} `
                    default:
                        return field.value === 'null' ? '' : field.value
                }
            })()
        }
    </div>
    )



    if ((gridstatus.status === true && getValues(`${rowName}.rowid`) === gridstatus.id) || _.isEmpty(getValues(`${rowName}.rowid`))) {
        switch (type) {
            case "textarea":
            case "input":
                if (datatype.includes('NUMBER')) {
                    return (<>
                        <CellError isError={errors} content={errors[name]} nameComponent={name} errRowIndex={rowIdx} />
                        <Form.Input className={className}>
                            <input
                                className={className}
                                {...field}
                                type='text'
                                key={`field.${name}`}
                                disabled={!canEdit && true}
                                value={parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) : parseNumbertoString(field.value)}
                                onChange={async (e) => {
                                    setValue(name, parseNumber(e.target.value), { shouldDirty: true })
                                }}
                                onBlur={async (e) => {
                                    setValue(name, parseNumber(e.target.value), { shouldDirty: true })

                                    checkDependencies()

                                }}
                            />
                        </Form.Input >
                    </>)
                }
                else {
                    return (
                        <>
                            <CellError isError={errors} content={errors[name]} nameComponent={name} errRowIndex={rowIdx} />
                            <Form.Input className={className}>
                                <input
                                    /*     ref={(e) => {
                                            ref(e)
                                            inputgrid.current = e // you can still assign to ref
                                        }} */
                                    {...field}
                                    className={className}
                                    type='text'
                                    key={`field.${name}`}
                                    disabled={disabled === 'disabled' && true}
                                    value={(_.isEmpty(field.value) ? (_.isEmpty(default_value) ? '' : default_value) : field.value)}
                                    onChange={async (e) => { field.onChange(e) }}
                                    onBlur={async (e) => {
                                        field.onBlur(e)
                                        checkDependencies()
                                    }}
                                />
                            </Form.Input >
                        </>
                    )
                }
            case "inputlov":
                return (
                    <Form.Input
                        className={className}>
                        <input
                            className={className}
                            {...field}
                            ref={(e) => {
                                ref(e)
                                inputgrid.current = e // you can still assign to ref
                            }}
                            type='text'
                            key={`field.${name}`}
                            value={field.value || ''}
                            onChange={async (e) => {
                                field.onChange(e)
                            }}
                        />
                        <Icon
                            key={`icon.${name}`}
                            size='large'
                            style={{ paddingTop: '10px', marginLeft: '5px', marginRight: '5px' }}
                            name='search' link={true}
                            onClick={lovHandler
                                //itemClickHandler(lovs, name)
                            }
                        />
                        <Label key={`label.${name}`} size='large' content={getValues(`${name}displayonly`)} style={{ paddingTop: '10px' }} />
                    </Form.Input>
                );

            case "inputselect":
                return (
                    <div {...field}>
                        <Form.Field
                            className={className}
                            control={Select}
                            options={selectOptions}//{fieldtype === 'input' ? Input : TextArea}
                            name={name}
                            value={(_.isUndefined(field.value) ? (_.isEmpty(default_value) ? '' : default_value) : field.value)}
                            ref={(e) => {
                                ref(e)
                                inputgrid.current = e // you can still assign to ref
                            }}
                            onChange={async (e, { name, value }) => {
                                // // console.log(name)
                                setValue(name, value)
                                // await triggerValidation({ name });
                            }}
                        />
                    </div>
                )
            case "inputsearch":
                return (
                    <>
                        <CellError
                            isError={errors}
                            content={errors[_.filter(_.keys(errors), x => x.includes(name))[0]] && errors[_.filter(_.keys(errors), x => x.includes(name))[0]]}
                            nameComponent={name}
                            errRowIndex={rowIdx} />
                        <AsyncSelect
                            {...field}
                            className={`field ${className}`}
                            defaultValue
                            name={name}
                            cacheOptions
                            value={(_.isEmpty(field.value) ? (_.isEmpty(default_value) ? '' : default_value) : field.value)}
                            ref={(e) => {
                                ref(e)
                                inputgrid.current = e // you can still assign to ref
                            }}
                            menuPlacement='auto'
                            loadOptions={loadOptions}
                            onChange={async (e) => { field.onChange(e) }}
                            getOptionValue={e => Object.values(e)[0]}
                            getOptionLabel={formatOptionLabel}//e => Object.values(e).join(' - ')}
                            formatGroupLabel={formatGroupLabel}
                            onBlur={async (e) => {
                                field.onBlur(e)
                                checkDependencies()
                            }}
                        />
                    </>
                );
            case "inputdatesimple":
                return (
                    <div className={`field field ${className}`}>
                        <CellError isError={errors} content={errors[name]} nameComponent={name} errRowIndex={rowIdx} />
                        <ReactDatePicker
                            {...field}
                            open={false}
                            name={name}
                            dateFormat={DATEFORMAT}
                            error={errors[name] ? true : false}
                            placeholderText="DD-MM-YYYY"
                            value={parseDatetoString(field.value) === '' ? parseDatetoString(default_value) : parseDatetoString(field.value)}
                            //value={field.value}
                            includeDateIntervals={[{ start: startperiode, end: endperiode }]}
                            onChangeRaw={async (e) => {

                                if (e.target.value.includes('_')) {
                                    setValue(name, e.target.value, { shouldDirty: true })
                                } else {
                                    setValue(name, parseToDate(e.target.value), { shouldDirty: true })

                                }



                            }}
                            onKeyDown={
                                async (e) => {
                                    if (e.key === 'Enter') {
                                        // console.log('changes', e.target.value)
                                        setValue(name, parseToDate(e.target.value), { shouldDirty: true })
                                    }
                                }
                            }
                            customInput={<InputMask mask="99-99-9999" style={{ textAlign: 'center' }} />}
                        />
                    </div >
                )
            case "inputdate":
                return (
                    <div className={`field field ${className}`}>
                        <CellError isError={errors} content={errors[name]} nameComponent={name} errRowIndex={rowIdx} />
                        <ReactDatePicker
                            {...field}
                            ref={(e) => {
                                ref(e)
                                inputgrid.current = e // you can still assign to ref
                            }}
                            name={name}
                            dateFormat={DATEFORMAT}
                            error={errors[name] ? true : false}
                            placeholderText="DD/MM/YYYY"
                            openToDate={(_.isUndefined(field.value) ? startperiode : field.value)}
                            value={field.value}
                            includeDateIntervals={[{ start: startperiode, end: endperiode }]}
                            adjustDateOnChange
                            selected={field.value}
                            onChange={async (props) => {

                                setValue(name, props)
                                field.onChange(props)
                            }}
                            onKeyDown={
                                (e) => {
                                    //     // console.log('down', e)
                                    //  setValue(name, new date())
                                    if (!isNaN(parseToDate(e.target.value))) {
                                        setValue(name, parseToDate(e.target.value))
                                    }
                                }
                            }
                            customInput={<InputMask mask="99/99/9999" style={{ textAlign: 'center' }} />}
                            popperPlacement='bottom'
                            popperModifiers={{
                                flip: {
                                    behavior: ['bottom'] // don't allow it to flip to be above
                                },
                                preventOverflow: {
                                    enabled: false // tell it not to try to stay within the view (this prevents the popper from covering the element you clicked)
                                },
                                hide: {
                                    enabled: false // turn off since needs preventOverflow to be enabled
                                }
                            }}
                        />
                    </div >
                )
            /* case "inputtime":
                return (
                    <div className={`field field ${className}`}>
                        <CellError isError={errors} content={errors[name]} nameComponent={name} errRowIndex={rowIdx} />
                        <ReactDatePicker
                            {...field}
                            dateFormat="HH:mm"
                            placeholderText="HH:MI"
                            timeFormat="HH:mm"
                            name={name}
                            //value={field.value}
                            value={parseStrTimeTodate(field.value) === '' ? parseStrTimeTodate(default_value) : parseStrTimeTodate(field.value)}
                            //onChange={async (e, va) => {
                            //  // console.log(e)
                            //e.setSeconds(0)
                            // e.setMilliseconds(0)
                            //                     // console.log(e)
                            //
                            //                       field.onChange(e)//.getTime())
                            ///                      }}
                            onChangeRaw={async (e, va) => {
                                // console.log(e.target.value)
                                if (e.target.value.includes('_')) {
                                    setValue(name, e.target.value, { shouldDirty: true })
                                } else {
                                    setValue(name, parseStrTimeTodate(e.target.value), { shouldDirty: true })
     
                                }
                                //field.onChange(e)//.getTime())
                            }}
                            showTimeSelectOnly
                            showTimeSelect
                            timeIntervals={1}
                            selected={parseStrTimeTodate(field.value) ? parseStrTimeTodate(field.value) : ''}
                            customInput={<InputMask mask="99:99" style={{ textAlign: 'center' }} />}
                        />
                    </div>
                ); */
            case "inputtime":
                return (
                    <div className={`field field ${className}`}>
                        <CellError isError={errors} content={errors[name]} nameComponent={name} errRowIndex={rowIdx} />
                        <ReactDatePicker
                            {...field}
                            ref={(e) => {
                                ref(e)
                                inputgrid.current = e // you can still assign to ref
                            }}
                            dateFormat="HH:mm"
                            placeholderText="HH:MI"
                            timeFormat="HH:mm"
                            name={name}
                            value={field.value}
                            onChange={async (e, va) => {

                                e.setSeconds(0)
                                e.setMilliseconds(0)

                                //                           // console.log('change', e)

                                field.onChange(e)
                            }}
                            showTimeSelectOnly
                            showTimeSelect
                            timeIntervals={1}
                            selected={field.value ? field.value : ''}
                            customInput={<InputMask mask="99:99" style={{ textAlign: 'center' }} />}
                        />
                    </div>
                );
            case "fieldcalculate":
                return <>
                    <CellError isError={errors} content={errors[name]} nameComponent={name} errRowIndex={rowIdx} />
                    <Form.Input className={className}>
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
                    </Form.Input >
                </>
            default:
                return (<Label content={`Error : ${name.toUpperCase()} Itemtype  Not Found`} />)
        }
    }
    else {
        return (<div {...field} className={`field.${className}`} key={`field.${name}`} style={{ textAlign: 'center' }}>
            {
                (() => {
                    switch (type) {
                        case 'inputtime':
                            return _.isEmpty(field.value) ? '' : `${_.padStart(field.value.getHours(), 2, '0')}:${_.padStart(field.value.getMinutes(), 2, '0')}`
                        case 'inputsearch':
                            return _.isEmpty(field.value) ? '' : `${_.get(field.value, 'code')} - ${_.get(field.value, 'description')} `
                        default:
                            return field.value === 'null' ? '' : field.value
                    }
                })()
            }
        </div>
        )
    }

}

export default FormArrayComponents