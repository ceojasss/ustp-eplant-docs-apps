import React from "react";
import { Form } from "semantic-ui-react"
import { useController, useForm } from "react-hook-form";

export const TextAreaAdapter = (props) => {
    /*  const {
         field: { onChange, onBlur, name, value, ref },
         fieldState: { invalid, isTouched, isDirty },
         formState: { touchedFields, dirtyFields }
     } = useController({
         names,
         control,
         rules: { required: false },
         defaultValue: "",
     }); */


    const { field, fieldState } = useController(props);

    return (
        <Form.TextArea
            {...field}
            label={'wewawa'}
            maxWidth={100}
        />
    );
}