import React from "react";
import { Label } from "semantic-ui-react";
import { Controller, useFormContext } from 'react-hook-form'
import _ from 'lodash'
import { parseNumber, parseNumbertoString } from "../../../utils/FormComponentsHelpler";

// *library imports placed above ↑

// *local imports placed below ↓



const FormGridDetailComponent = ({ prefixName, names, type, formula, datatype, className, readonly, default_value, id }) => {

    //const dispatch = useDispatch()
    const { setValue, control } = useFormContext()
    //  const colName = names.substring(names.indexOf(']') + 2)


    // console.log(names, readonly)


    /* if (names.includes('tid') && _.isEmpty(getValues(names))) {
        // console.log(names)
        setValue(names, id)
    } */

    const checkDependencies = () => {

    }


    switch (type) {
        case "input":
            if (datatype.includes('NUMBER')) {
                return (
                    <div className={'ui input small'} ><Controller
                        control={control}
                        name={names}
                        render={({ field, fieldState, formState: { errors, isDirty, dirtyFields } }) =>
                        (

                            <input
                                className={`ui input small`}
                                {...field}
                                type='text'
                                key={`field.${names}`}
                                readOnly={readonly === 'true' && true}
                                value={!_.isNull(formula) ? formula.includes('==') ? parseNumbertoString(field.value) === '0' ? (checkDependencies(), parseNumbertoString(default_value)) : (checkDependencies(), parseNumbertoString(field.value)) : parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) : parseNumbertoString(field.value) : parseNumbertoString(field.value) === '0' ? parseNumbertoString(default_value) : parseNumbertoString(field.value)}
                                onBlur={async (e) => {
                                    if (readonly !== 'true') {
                                        setValue(names, parseNumber(e.target.value), { shouldDirty: true })
                                        checkDependencies()
                                    }
                                }}
                                onChange={async (e) => {
                                    setValue(names, (e.target.value), { shouldDirty: true })
                                    checkDependencies()
                                }}
                            />

                        )}
                    /> </div>
                )
            }
            else {
                return (
                    <div className={'ui input small'} >  <Controller
                        control={control}
                        name={names}
                        render={({ field, fieldState, formState: { errors, isDirty, dirtyFields } }) =>
                        (

                            <input
                                className={`ui input small`}
                                {...field}
                                type='text'
                                key={`field.${names}`}
                                readOnly={readonly === 'true' && true}
                                value={field.value}
                                onBlur={async (e) => {
                                    if (readonly !== 'true') {
                                        setValue(names, parseNumber(e.target.value), { shouldDirty: true })
                                        checkDependencies()
                                    }
                                }}
                                onChange={async (e) => {
                                    setValue(names, (e.target.value), { shouldDirty: true })
                                    checkDependencies()
                                }}
                            />

                        )}
                    /></div>
                )

            }
        default:
            return (<Label content={`Error : ${names.toUpperCase()} Itemtype Not Found`} />)
    }

}


export default FormGridDetailComponent