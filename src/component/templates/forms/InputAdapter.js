import * as React from "react";
import { Field } from "react-final-form";
import { useFormContext, Controller, useForm } from "react-hook-form";
import { Input, TextArea, Form } from "semantic-ui-react"

const InputAdapter = ({ labels, registername, isrequired, fieldtype, onClick, onChange }) => {
    const { register } = useFormContext();

    const classCol = 'column-custom'
    const className = `field `//${meta.error && meta.touched ? "error" : ""}`



    const Fields = () => {
        if (fieldtype === 'inputlov') {
            return (
                <Form.Field
                    label={labels}
                    input={{ ...register(registername, { required: isrequired, onChange }) }}
                    control={Input}
                    icon={fieldtype === 'inputlov' ? { name: 'search', circular: true, link: true, onClick: onClick } : undefined}
                />
            )
        }
        else if (fieldtype === 'input') {
            return (
                <Form.Field
                    label={labels}
                    input={{ ...register(registername, { required: isrequired }) }}
                    control={Input}//{fieldtype === 'input' ? Input : TextArea}
                />
            )
        } else if (fieldtype === 'textArea') {
            return (
                <Form.TextArea
                    label={labels}
                    input={{ ...register(registername, { required: isrequired }) }}
                    control={Input}//{fieldtype === 'input' ? Input : TextArea}
                />
            )
        }


    }


    return (
        <div className={classCol}>
            <div className={className}>
                <Fields />
            </div>
        </div>)

}

export default InputAdapter