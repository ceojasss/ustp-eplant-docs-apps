import React from "react";
import { Form, Message } from "semantic-ui-react";
import { useFormContext, useFormState } from 'react-hook-form'
import { useDispatch } from "react-redux";
import _ from 'lodash'
import { useWatch } from "react-hook-form";
// *library imports placed above ↑
// *local imports placed below ↓

import { ShowLov } from "../../../redux/actions";


/*SEKARANG */
const FooterComponents = ({ field, fieldtype, label, lovs, className, datatype }) => {


    const { name } = field
    const dispatch = useDispatch()

    const { getValues, setValue, control, getFieldState } = useFormContext()
    const { errors, dirtyFields, isDirty } = useFormState(control)

    const itemClickHandler = (lov, value) => dispatch(ShowLov(lov, value, (_.isNil(getValues(value)) ? '' : getValues(value))))

    //? Handling Onclick Ref For Submitting Transaction

    if (fieldtype.match(/^(inputsearch|inputlov|inputselect)$/) && _.isEmpty(lovs)) {
        return (<Message
            compact
            color="red"
            //icon='warning'
            header={`Error : ${name} Lovs not set`}
        />)
    }




    switch (fieldtype) {
        case "input":
            return (
                <Form.Input className={className}>
                    <input
                        className={className}
                        {...field}
                        type={datatype.includes('NUMBER') ? 'number' : 'text'}
                        style={{ fontWeight: 'bold' }}
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
                        }}
                    />
                </Form.Input >
            );


        default:
            return (<Message
                compact
                color="red"
                //icon='warning'
                header={`Error : ${name.toUpperCase()} Itemtype  Not Found`}
            />)



    }


}

export default FooterComponents