import React, { useEffect, useMemo } from "react";
import { Form, Grid, Icon, Label, Message, Radio } from "semantic-ui-react";

import Select, { components } from 'react-select'
import { connect, useDispatch, useSelector } from "react-redux";
import _ from 'lodash'
import ReactDatePicker from "react-datepicker";
// *library imports placed above ↑
// *local imports placed below ↓

import "react-datepicker/dist/react-datepicker.css"

import { monthStyles } from "../Style";
import { useFormContext, useFormState } from "react-hook-form";
import { ShowLovQuery } from "../../../redux/actions";
import { encryptString, GetMonthName, isNumeric } from "../../../utils/DataHelper";
import { parseDatetoString } from "../../../utils/FormComponentsHelpler";
import InputMask from "react-input-mask";

/*SEKARANG */
const FormComponentParam = ({ field, param_display, attrb, itemtype, query_lang, param_seq, comp, rb }) => {

    const dispatch = useDispatch()
    const { control, getValues, setValue } = useFormContext()

    const { errors } = useFormState(control)

    const MonthOptions = []

    let lov = useSelector(state => state.auth.selectedValue)

    useMemo(() => {

        if (itemtype === 'monthpicker') {
            for (let index = 1; index <= 12; index++) {
                MonthOptions.push({ value: index, label: GetMonthName(index) })
            }
        }

    }, [field])

    const radioChange = async (val) => {
        // console.log(field.name, val)
        setValue(field.name, val)

    }

    const selectOptions = [
        { value: 'chocolate', label: 'Januari' },
        { value: 'strawberry', label: 'Febuari' },
        { value: 'vanilla', label: 'Maret' },
    ]

    const lovHandler = async () => {

        let stmt = query_lang



        const z1 = _.remove(query_lang.split(':ITEMCHAR'), (x) => {

            return isNumeric(x.substr(0, 1))
        })

        const w1 = _.map(z1, (v) => {


            const deps = v.substr(0, 1)



            const val = _.find(comp, ['param_seq', Number(deps)]).param_code

            const attrbs = _.find(comp, ['param_seq', Number(deps)]).attrb

            const itemtypes = _.find(comp, ['param_seq', Number(deps)]).itemtype


            let value



            if (getValues(val) instanceof Object) {

                if (getValues(val) instanceof Date) {
                    if (itemtypes === 'datepicker') {
                        value = `to_date('${parseDatetoString(getValues(val))}','dd-mm-yyyy')`
                    } else {
                        value = `'${getValues(val).getFullYear()}'`

                    }
                }
                else {

                    value = `'${Object.values(getValues(val))[0]}'`
                }
            } else {
                value = `'${(attrbs === 'POPULATE' ? getValues(`${val}displayonly`) : getValues(val))}'`
            }


            return { [`:ITEMCHAR${deps}`]: value }
        })



        _.map(w1, (x, z) => {
            const search = _.keys(x)[0]
            stmt = _.replace(stmt, search, `${x[search]}`)
        }
        )

        // console.log(stmt)

        const qwery = await encryptString(stmt)

        dispatch(ShowLovQuery(qwery, field.name, param_display))
    }


    /**handling lov values */
    useEffect(() => {

        if (!_.isEmpty(lov)) {
            lov = Object.values(lov)

            if (lov[0] && (lov[0] === field.name)) {

                let val = Object.values(lov[1].values)

                setValue(lov[0], val[0], { shouldDirty: true })
                setValue(`${lov[0]}displayonly`, val[1], { shouldDirty: true })


            }
        }

    }, [lov]);


    const ComponentReturn =
        (() => {
            switch (itemtype) {
                case "input":
                    return <Form.Field
                        inline
                        key={field.id}
                    >
                        <label style={{ width: '4cm' }}>{param_display}</label>
                        <input style={{ fontSize: 'smaller' }} {...field} value={field.value || ''} />
                    </Form.Field>
                case "input_inputsearch":
                    return <Form.Group >
                        <Form.Input size="mini" icon label={param_display} width={5}>
                            <input style={{ fontSize: 'smaller' }} {...field} value={field.value || ''} />
                            <Icon
                                name='search'
                                bordered
                                color="blue"
                                link
                                onClick={lovHandler}
                            />
                        </Form.Input>
                        <Form.Input size="mini" icon label={`${param_display} Description`} width={10}>
                            <input
                                style={{ fontSize: 'smaller' }}
                                readOnly
                                value={(_.isEmpty(getValues(`${field.name}displayonly`)) ? '' : getValues(`${field.name}displayonly`))} />
                        </Form.Input>
                    </Form.Group>
                case "yearpicker":
                    return <Form.Field size="mini" key={field.id} inline>
                        <label style={{ width: '4cm' }}>{param_display}</label>
                        <ReactDatePicker
                            {...field}
                            showYearPicker
                            dateFormat="yyyy"
                            yearItemNumber={9}
                            portalId="root-portal"
                            selected={field.value}
                        /></Form.Field>
                case "monthpicker":
                    return <Grid style={{ marginBottom: '1px' }}>
                        <Grid.Column style={{ width: '4.3cm' }}>
                            <label style={{ fontSize: 'smaller', fontWeight: 'bold' }}>{param_display}</label>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Select
                                {...field}
                                options={MonthOptions}
                                menuPlacement='auto'
                                menuPortalTarget={document.body}
                                styles={monthStyles}
                            />
                        </Grid.Column>
                    </Grid>
                case "datepicker":
                    return <Form.Field size="mini" key={field.id} inline>
                        <label style={{ width: '4cm' }}>{param_display}</label>
                        <ReactDatePicker
                            {...field}
                            showDatePicker
                            dateFormat="dd-MM-yyyy"
                            yearItemNumber={9}
                            portalId="root-portal"
                            selected={field.value}
                            customInput={<InputMask mask="99-99-9999" style={{ textAlign: 'center' }} />}
                        /></Form.Field>
                case "inputselect":
                    return <Form.Group key={field.id}>
                        <Form.Input size="mini" icon label={param_display} width={5} >
                            <input {...field}
                                value={field.value || ''} />
                            <Icon
                                name='search'
                                bordered
                                color="blue"
                                link
                                onClick={lovHandler}
                            />
                        </Form.Input>
                        <Form.Input size="mini" icon label={`${param_display} Description`} width={10}>
                            <input
                                readOnly
                                value={(_.isEmpty(getValues(`${field.name}displayonly`)) ? '' : getValues(`${field.name}displayonly`))} />
                        </Form.Input>
                    </Form.Group>
                case "radiogroup":
                    return <Form.Group inline key={field.id} >
                        <label style={{ fontSize: 'smaller' }} >{param_display}</label>
                        {
                            (() => {
                                return _.map(rb, (v, idx) => {
                                    return <Form.Field
                                        style={{ fontSize: 'smaller' }}
                                        key={`rb.field,${idx}`}
                                        control={Radio}
                                        label={v.rb_label}
                                        value={v.rb_val}
                                        checked={field.value === v.rb_val}
                                        onChange={() => radioChange(v.rb_val)}

                                    />
                                })
                            })()
                        }

                        {/* <Form.Radio
                            label={param_display}
                        /> */}
                    </Form.Group>
                default:
                    return <Message
                        key={`error.${param_display}`}
                        compact
                        color="red"
                        header={`Error : ${param_display.toUpperCase()} Itemtype  Not Found`}
                    />
            }
        })()

    return ComponentReturn


}

export default FormComponentParam