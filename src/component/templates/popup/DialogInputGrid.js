import React, { createRef, useEffect, useRef, useState } from "react"
import _ from 'lodash'
import { useFieldArray, useFormContext } from "react-hook-form"
import { connect, useDispatch } from "react-redux"
import { Button, Label } from "semantic-ui-react"

import '../../Public/CSS/App.css'

import { getFormSubListComponent } from "../../../utils/FormComponentsHelpler"
import FormGridDetailComponent from "../forms/FormGridDetailComponent"
import { setModalStates } from "../../../redux/actions"
import { Appresources } from "../ApplicationResources"



const DialogInputGrid = ({ modals, column, formComps, _trxid, autogenerate }) => {

    const subDivRef = useRef();
    const tSubRef = useRef([]);
    const dispatch = useDispatch()

    const { control, setFocus, setValue, getValues } = useFormContext()

    const indexDetail = _.findIndex(control._formValues.inputgrid, ['tid', modals.lovdata.item.tid])

    const [activecols, setActivecols] = useState()

    const hName = `inputgrid[${indexDetail}]`
    const dName = `inputgrid[${indexDetail}].inputgriddetail`


    const { fields, append } = useFieldArray({ control, name: dName });

    /* console.log(indexDetail, modals.lovdata.item)
    console.log(control._formValues.inputgrid)
    console.log(dName, getValues('inputgrid'))

    console.log(control._formState.dirtyFields) */

    useEffect(
        () => {

            if (!autogenerate) {
                // console.log('check', autogenerate)
            } else {
                //   console.log('run', autogenerate)
                _.map(autogenerate, x => { append(x) })
            }

        }, [autogenerate]
    )

    const headerNative = _.map(formComps, (x, i) => {
        return <th key={x.registername + i} className='theadslim' style={{ display: x.form_visibility === 'GONE' && 'none', backgroundColor: 'aliceblue' }}>
            {x.label}
        </th>
    })

    const actionColumn = (item, index) => {
        return <td className='fix'  ><i aria-hidden="true"
            style={_.get(_.find(formComps), 'isdelete') !== 'N' ? null : { pointerEvents: 'none', cursor: 'disabled' }}
            className={_.get(_.find(formComps), 'isdelete') !== 'N' ? "red delete small circular inverted link icon" : "grey delete small circular inverted link icon"}></i></td>
    }

    const RenderForm = (item, arrIndex) => {


        if (_.isNil(item.tid)) {
            // // console.log('2 set', item, arrIndex, getValues(`${dName}[${arrIndex}]`))
            setValue(`${dName}[${arrIndex}].tid`, item.id, { shouldDirty: true })
        }

        return _.map(formComps, (formFields, i) => <td
            className='cell-ui-input'
            key={`${i}.${formFields.name}`}
            style={{
                zIndex: '2', display: formFields.form_visibility === 'GONE' && 'none', padding: '0.1vw'
            }}
            onSelect={(e) => { setActivecols(`inputgrid[${arrIndex}].${formFields.registername}`) }}>
            <FormGridDetailComponent  {...formFields}
                prefixName={dName}
                names={`${dName}[${arrIndex}].${formFields.registername}`}
                index={arrIndex + 1}
                {...item} />
        </td >)
    }


    const appenddata = async (trxid, cb) => {

        let defaultValues = _.mapValues(_.keyBy(formComps, 'key'), 'default_value')

        _.map(defaultValues, (_val, _key) => {
            if (_.includes(_val, '#')) {
                _.set(defaultValues, _key, getValues(`${hName}.${_.replace(_val, '#', '')}`))
            }
        })

        if (cb)
            cb(defaultValues)
    }

    const clickhandler = () => { appenddata('', (_value) => { append(_value) }) }


    return (
        <> <Label
            content='Tambah Data'
            style={{ marginLeft: '10px', width: '3cm', cursor: 'pointer',/*  marginLeft: '-0.01cm', */ marginBottom: '5px' }}
            color="green"
            icon={'plus'}
            size="small"
            onClick={clickhandler} />
            <div
                ref={subDivRef}
                className="ui container"
                style={{ overflowY: 'scroll', display: 'block', height: ('50vh'), width: '100vw', }}
            >
                <table className="ui celled sortable striped compact table" >
                    <thead style={{ position: 'sticky', top: '0', zIndex: '99999' }}>
                        <tr key={`tgridheader`}><th className='theadslimfix' style={{ backgroundColor: 'aliceblue', padding: '0em !important' }} >No</th>
                            {headerNative}<th className='theadslimfix' style={{ backgroundColor: 'aliceblue', padding: '0em !important' }}>Action</th></tr>
                    </thead>
                    <tbody>

                        {
                            _.map(fields, (item, index) => {


                                if (tSubRef.current.length !== fields.length) {
                                    // add or remove refs
                                    tSubRef.current = Array(fields.length)
                                        .fill()
                                        .map((_, i) => tSubRef.current[i] || createRef());
                                }

                                let bgcolors
                                const NotDeleted = {}

                                return (<tr
                                    tabIndex={0}
                                    ref={tSubRef.current[index]}
                                    style={{ backgroundColor: bgcolors, display: (!NotDeleted && 'none') }}
                                    key={`trow.${item.tid}.${index}`}
                                    onKeyDown={async (e) => {
                                        let cIdx, cName

                                        if (e.code === 'ArrowUp' && index > 0 && e.ctrlKey) {

                                            if (!_.isUndefined(activecols)) {
                                                cIdx = Number(activecols.substring(activecols.indexOf('[') + 1, activecols.indexOf(']')))
                                                cName = activecols.substring(activecols.indexOf(']') + 2)
                                            }

                                            //       console.log(hName, cIdx, cName, `${hName}.inputgriddetail[${cIdx - 1}].${cName}`)

                                            tSubRef.current[index - 1].current.focus()
                                            setFocus(`${hName}.inputgriddetail[${cIdx - 1}].${cName}`)

                                        } else
                                            if (e.code === 'ArrowDown' && e.ctrlKey) {
                                                if (tSubRef.current.length === Number(tSubRef.current[index].current.children[0].innerHTML)) {
                                                    //  let pos = tSubRef.current.length
                                                    appenddata()
                                                } else {


                                                    if (!_.isUndefined(activecols)) {
                                                        cIdx = Number(activecols.substring(activecols.indexOf('[') + 1, activecols.indexOf(']')))
                                                        cName = activecols.substring(activecols.indexOf(']') + 2)
                                                    }

                                                    tSubRef.current[index + 1].current.focus()
                                                    setFocus(`${hName}.inputgriddetail[${cIdx + 1}].${cName}`)
                                                }
                                            }
                                    }}><td className='fix' key={`item.${index + 1}`} style={{ textAlign: 'center' }}>{index + 1}</td>
                                    {RenderForm(item, index)}
                                    {actionColumn(item, index)}</tr>)
                            })}
                    </tbody>
                </table>

            </div>

            <Button negative
                icon='window close'
                floated="right"
                content='Tutup'
                style={{ marginTop: '5px' }}
                labelPosition="left"
                onClick={() => dispatch(setModalStates(Appresources.BUTTON_LABEL.LABEL_CANCEL))} />
        </>)
}

const mapStateToProps = state => {

    return {
        _trxid: state.auth.trxid,
        formComps: getFormSubListComponent(),
        activeRow: state.auth.modals.activeRow,
        modals: state.auth.modals,
        column: state.auth.modals.lovdata,
        autogenerate: state.auth.generate_exec_detail
    }
}


export default connect(mapStateToProps)(DialogInputGrid) 