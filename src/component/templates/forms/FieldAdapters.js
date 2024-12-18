import React from "react";
import { Form, Label, Input, Select, TextArea, Icon } from "semantic-ui-react";
import { Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css"

import ReactDatePicker from "react-datepicker"
const FieldAdapters = ({ setValue, control, getValues, register, triggerValidation, components, itemClickHandler }) => {

    // // console.log(components)

    const classCol = `column-custom`

    const genderOptions = [
        { key: 'm', text: 'Male', value: 'male' },
        { key: 'f', text: 'Female', value: 'female' },
        { key: 'o', text: 'Other', value: 'other' },
    ]

    let rowsGroup

    return (
        <>
            {/* <Form.Group> */}
            {components.map(({ classRows, lovs, label, className, registername, isrequired, fieldtype }) => {
                const classnames = `field-${className}`
                // console.log('value')
                return (
                    <div className={classCol} key={registername}>
                        {(
                            () => {
                                if (fieldtype === 'textArea') {
                                    return (
                                        <Form.Field
                                            className={classnames}
                                            label={label}
                                            input={{ ...register(registername, { required: isrequired }) }}
                                            control={TextArea}
                                            name={registername}
                                            onChange={async (e, { name, value }) => {
                                                //  // console.log(name)
                                                setValue(name, value)
                                                // await triggerValidation({ name });
                                            }}
                                        />
                                    )
                                }
                                else if (fieldtype === 'select') {
                                    return (
                                        <Form.Field
                                            className={classnames}
                                            label={label}
                                            input={{ ...register(registername, { required: isrequired }) }}
                                            control={Select}
                                            options={genderOptions}//{fieldtype === 'input' ? Input : TextArea}
                                            name={registername}
                                            onChange={async (e, { name, value }) => {
                                                // // console.log(name)
                                                setValue(name, value)
                                                // await triggerValidation({ name });
                                            }}
                                        />
                                    )
                                }
                                else if (fieldtype === 'inputlov') {
                                    return (

                                        <Form.Field
                                            className={classnames}
                                            label={label}
                                            control={Input}
                                            name={registername}
                                            onChange={async (e, { name, value }) => {
                                                //  // console.log(name)
                                                setValue(name, value)
                                                // await triggerValidation({ name });
                                            }}
                                        >
                                            <input {...register(registername, { required: isrequired })} />
                                            <Icon size='large' style={{ paddingTop: '10px', marginLeft: '5px', marginRight: '5px' }} name='search' link={true} onClick={() => itemClickHandler(lovs, registername)} />
                                            <Label size='large' content={getValues(`${registername}displayonly`)} style={{ paddingTop: '10px' }} />
                                        </Form.Field>)

                                }
                                else if (fieldtype === 'inputdate') {
                                    return (
                                        <div
                                            className={`field ${classnames}`}
                                        >
                                            <Controller

                                                control={control}
                                                name={registername}
                                                render={({ field }) => (
                                                    <>   <label> {label}  </label>
                                                        <ReactDatePicker
                                                            className="ui form"
                                                            placeholderText="Select date"
                                                            onChange={(e) => field.onChange(e)}
                                                            selected={field.value}
                                                        />
                                                    </>
                                                )}
                                            />
                                        </div>)
                                }

                                return (

                                    <Form.Field
                                        className={classnames}
                                        label={label}
                                        input={{ ...register(registername, { required: isrequired }) }}
                                        control={Input}
                                        name={registername}
                                    />)
                            }
                        )()}
                    </div>
                )

            }
            )
            }
        </ >
    )
}

export default FieldAdapters