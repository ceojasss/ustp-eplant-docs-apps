import React, { createRef, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import { Icon, Popup, Grid } from "semantic-ui-react";
import { useFieldArray, useWatch, useFormContext } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css"

import FormArrayComponents from "./FormGridComponent2";
import { getFormListComponent, getFormSubListComponent } from "../../../utils/FormComponentsHelpler";
import { Calc } from "./Calc";
import { DELETE_LIST, GRID_EDIT_FALSE, GRID_EDIT_TRUE, INCREMENT_TRX_ID } from "../../../redux/actions/types";
import DeletedTables from "../DeletedTables";
import { InputDetailOnModals, resetsubmitlinkdata, TIDincrement } from "../../../redux/actions";


const ComponentAdaptersGrids = ({ formComps, arrayrefs, OnClickRef, defaultDataValue, masterdetail,
    viewHeight, _trxid, deletelist, gridedit, addCount, datalinkedsubmited, formSubComps,
    checkdatalinkedsubmited }) => {

    const dispatch = useDispatch()
    const divRef = useRef(null);
    const tRef = useRef([]);


    const [activecols, setActivecols] = useState()


    const { control, setFocus, trigger, setValue, getValues } = useFormContext()

    const { fields, remove, append } = useFieldArray({
        control,
        name: "inputgrid",
        //  focusAppend: false // auto focus by default.
    });


    const isMasterdetail = (_.isUndefined(masterdetail) ? false : masterdetail)


    //console.log(getValues())


    const formGrouped = (item, arrIndex) => {

        return _.map(formComps, (formFields, i) => {
            //  console.log(formFields.form_visibility)

            return <td
                className='cell-ui-input' key={`${i}.${formFields.name}`} style={{
                    zIndex: '2',
                    display: (formFields.form_visibility === 'GONE' || _.split(getValues('hidelistdisplayonly'), ';').includes(formFields.registername)) && 'none', padding: '0.1vw'
                }}
                onSelect={(e) => {
                    setActivecols(`inputgrid[${arrIndex}].${formFields.registername}`)
                }}> <FormArrayComponents clickref={OnClickRef} {...formFields}
                    names={`inputgrid[${arrIndex}].${formFields.registername}`} index={arrIndex + 1} {...item} />
            </td >
        })
    }


    useEffect(() => {
        if (tRef.current.length > 0) {
            let idx = tRef.current.length
            try {
                tRef.current[idx - 1].current.focus()
            } catch (err) {

            }
        }

        setActivecols(null)

    }, [tRef])


    useEffect(() => {

        let lastSeq = 0

        if (!checkdatalinkedsubmited) {


            const seqNo = _.filter(formComps, ['default_value', 'counter'])
            const seqNoAsVal = (!_.isEmpty(seqNo) && seqNo[0]['registername'])

            if (_.isEmpty(fields)) {
                lastSeq = _.size(fields)
            } else {
                lastSeq = _.get(_.maxBy(getValues('inputgrid'), seqNoAsVal), [seqNoAsVal])
            }

            //  console.log(datalinkedsubmited)

            _.map(datalinkedsubmited, async (x, idx) => {
                //   // //// //// //// console.log(_.isEmpty(x.used))

                if (_.isEmpty(x.used)) {
                    dispatch({ type: INCREMENT_TRX_ID })

                    if (!_.isEmpty(seqNoAsVal)) {
                        _.assign(defaultDataValue.inputgrid, { [seqNoAsVal]: idx + lastSeq + 1 })
                    }

                    _.assign(defaultDataValue.inputgrid, { ...x })

                    append(defaultDataValue.inputgrid, { shouldFocus: true });

                    //await _.assignIn(x, { used: 1 })
                }
            })
            dispatch(resetsubmitlinkdata(() => {

            }))
        }
    }, [])


    useEffect(() => {

        arrayrefs.current = async (callbacks) => {

            if (_.isUndefined(masterdetail)) {


                const last_id = _.max(_.map(control._formValues.inputgrid, 'tid'))

                for (let index = 0; index < addCount; index++) {

                    apenddata(/* _trxid,  */last_id + index, () => {
                        trigger()
                    })
                }
            } else {


                let stop = false

                const parentData = _.map(_.filter(formComps, ['is_child_key', 'true'])
                    , (z) => { return { [z.key]: z.default_value } }
                )


                _.map(parentData, p => {

                    if (_.isUndefined(control._formValues[`${_.replace(_.values(p), '#', '')}`])) {
                        //      // //// //// //// console.log('true')
                        stop = true
                        return;

                    } else {

                        stop = false
                    }
                })


                if (!stop) {
                    const last_id = _.max(_.map(control._formValues.inputgrid, 'tid'))
                    for (let index = 0; index < addCount; index++) {
                        // //// //// //// console.log('jumlah data', control._formValues.inputgrid)

                        apenddata(/* _trxid,  */last_id + index, () => {
                            trigger()
                        })
                    }
                }

            }

            if (callbacks)
                callbacks(divRef.current)

        }


    })


    const headerNative = formComps.map((x, i) => {
        return <th key={x.registername + i}
            className='theadslim'
            style={{ display: (x.form_visibility === 'GONE' || _.split(getValues('hidelistdisplayonly'), ';').includes(x.registername)) && 'none', backgroundColor: 'aliceblue' }} >{x.label}</th>
    })



    const actionColumn = (item, index) => {


        return <td className='fix'  >
            <div style={{ width: '2.9cm' }}>

                <div>
                    {!_.isEmpty(formSubComps) &&
                        <div className="tooltip">
                            <i aria-hidden="true"
                                className={"green add square large link icon"}
                                onClick={() => { dispatch(InputDetailOnModals(item)) }}></i>
                            <span className={index === 0 ? "tooltiptextLeft" : "tooltiptextTop"}>Add Detail Data</span>
                        </div>

                    }&nbsp;&nbsp;
                    <i aria-hidden="true" style={_.get(_.find(formComps), 'isupdate') != 'N' ? null : { pointerEvents: 'none', cursor: 'disabled' }} className={_.get(_.find(formComps), 'isupdate') != 'N' ? "blue pencil square large link icon" : "grey pencil square large link icon"} onClick={() => {
                        if (gridedit.id === item.rowid) {

                            dispatch({ type: (!gridedit.status ? GRID_EDIT_TRUE : GRID_EDIT_FALSE), payload: item.rowid })
                        } else {
                            dispatch({ type: GRID_EDIT_TRUE, payload: item.rowid })

                        }
                    }}></i>&nbsp; &nbsp;
                    <i aria-hidden="true" style={_.get(_.find(formComps), 'isdelete') != 'N' ? null : { pointerEvents: 'none', cursor: 'disabled' }} className={_.get(_.find(formComps), 'isdelete') != 'N' ? "red delete small circular inverted link icon" : "grey delete small circular inverted link icon"} onClick={() => {
                        //// //// console.log(item)
                        if (_.isNull(item.rowid) || _.isUndefined(item.rowid)) {
                            remove(index)
                        }
                        else {
                            if (!_.isNull(item.tid))
                                dispatch({ type: DELETE_LIST, payload: item })
                        }
                    }}></i>
                </div>

            </div>
        </td>
    }

    const Footer = () => {
        const results = useWatch({ control, name: 'inputgrid' });

        if (!_.some(formComps, (x) => { return !_.isNull(x.footer) }))
            return null

        return <tfoot style={{ position: 'sticky', bottom: 0, zIndex: '10000' }} >
            <tr><td className='theadslimfix'
                style={{ backgroundColor: 'aliceblue', fontWeight: 'bold', fontSize: 'x-small', padding: '0em !important' }} >Total</td>
                {
                    _.map(formComps, (fields, i) => {
                        // // //// //// //// console.log(fields.key)
                        return < td
                            className='theadslim'
                            key={fields.registername + ".footer." + i}
                            style={{ textAlign: 'right', display: (fields.form_visibility === 'GONE' || _.split(getValues('hidelistdisplayonly'), ';').includes(fields.registername)) && 'none', backgroundColor: 'aliceblue', padding: '0em !important' }} >
                            {(() => {
                                if (_.isNull(fields.footer))
                                    return null

                                return <FormArrayComponents {...fields} clickref={OnClickRef} names={`${fields.registername}summarydisplayonly`} isFooter={true} />

                            })()}
                        </td>
                    })
                }<td className='fix'
                    style={{ backgroundColor: 'aliceblue', padding: '0em !important', width: '500px !important' }}>
                    <Popup
                        trigger={<Icon name={_.isEmpty(deletelist) ? 'trash alternate outline' : 'trash alternate'} color="red" />}
                        // content={_.size(deletelist) === 0 ? 'Item Delete' : `${JSON.stringify(deletelist)} Data Deleted`}
                        content={_.size(deletelist) === 0 ? 'Item Delete' : <DeletedTables
                            as={Grid.Column}
                            columns={_.map(_.filter(formComps, ['sneak_peek', 'true']), (x) => { return [x.key, x.label, x.type] })}//{_.keys(deletelist[0])}
                            data={deletelist} />
                        }
                        position='left center'
                    />

                    <Popup
                        content={JSON.stringify(control._formState.errors)}
                        on='click'
                        header={'form validation error list'}
                        positionFixed
                        inverted
                        trigger={<Icon name={'warning'} color="red" />}
                    />
                </td>
            </tr>
        </tfoot >


    }

    const apenddata = async (trxid, cb) => {

        // //// //// //// console.log(trxid, _trxid)

        let parentData

        if (isMasterdetail) {
            parentData = _.map(_.filter(formComps, ['is_child_key', 'true']), (z) => { return { [z.key]: z.default_value } })
        }


        if (_.isUndefined(control._defaultValues.inputgrid) || _.isEmpty((control._defaultValues.inputgrid))) {


            await dispatch(TIDincrement(x => {

                if (!_.isUndefined(parentData)) {
                    _.map(parentData, p => {
                        _.update(defaultDataValue.inputgrid, _.keys(p), (x) => control._formValues[`${_.replace(_.values(p), '#', '')}`])

                    })
                }
                _.assign(defaultDataValue.inputgrid, { tid: x })


                if (_.size(control._formValues.inputgrid) === 0) {
                    append({}, { shouldFocus: true });


                    // //// //// //// console.log(control._formValues.inputgrid)

                    _.map(defaultDataValue.inputgrid, async (xz, z) => { setValue(`inputgrid[0].${z}`, xz, { shouldDirty: true }) })
                } else {
                    if (isMasterdetail) {
                        append(defaultDataValue.inputgrid, { shouldFocus: true });
                    } else {

                        // //// //// //// console.log(defaultDataValue.inputgrid)
                        //append(defaultDataValue.inputgrid, { shouldFocus: true });
                        append({}, { shouldFocus: true });

                        ////// //// //// console.log(control._formValues.inputgrid, _.size(control._formValues.inputgrid) - 1, trxid)

                        _.map(defaultDataValue.inputgrid, async (xz, z) => { setValue(`inputgrid[${_.size(control._formValues.inputgrid) - 1}].${z}`, xz, { shouldDirty: true }) })

                        if (cb) cb()
                    }


                    // //// //// //// console.log(control._formValues.inputgrid)

                }


            }))

        }
        else {


            dispatch({ type: INCREMENT_TRX_ID })
            const last_id = _.max(_.map(control._defaultValues.inputgrid, 'tid'))

            // // //// //// console.log('append 2', last_id, trxid, addCount)
            if (addCount === 1) {
                _trxid = last_id + _trxid
            } else {
                _trxid = trxid + 1
            }

            if (!_.isUndefined(parentData)) {
                _.map(parentData, p => {
                    _.update(defaultDataValue.inputgrid, _.keys(p), (x) => control._formValues[`${_.replace(_.values(p), '#', '')}`])

                })
            }

            _.assign(defaultDataValue.inputgrid, { tid: _trxid })

            const def = _.omit(_.mapValues(control._defaultValues.inputgrid[0], x => { return null }), 'inputgrid')


            _.merge(def, defaultDataValue.inputgrid)

            //    append({def}, { shouldFocus: true });
            append({}, { shouldFocus: true });
            //// //// //// //// console.log(_.keys(control._formValues.inputgrid))

            let keys = Object.keys(control._formValues.inputgrid);
            let last = keys[keys.length - 1];
            // //// //// //// console.log(control._formValues.inputgrid[last]);

            _.map(def, async (xz, z) => { setValue(`inputgrid[${last}].${z}`, xz, { shouldDirty: true }) })

        }

        //   trigger();

        // //// //// //// console.log(control)
        if (cb)
            cb()
    }


    return (
        <>
            <div
                ref={divRef}
                className="ui container" style={{
                    overflowY: 'scroll',
                    //   overflow: 'scroll',
                    display: 'block',
                    height: (isMasterdetail ? viewHeight : '60vh'),
                    width: '100vw',
                }}
            >

                <table className="ui celled sortable striped compact table" >
                    <thead style={{ position: 'sticky', top: '0', zIndex: '10000' }}>
                        <tr key={`tgridheader`}>
                            <th className='theadslimfix' style={{ backgroundColor: 'aliceblue', padding: '0em !important' }} >No</th>
                            {headerNative}
                            <th className='theadslimfix' style={{ backgroundColor: 'aliceblue', padding: '0em !important' }}>Action</th></tr>
                    </thead>
                    <tbody >

                        {

                            _.map(fields, (item, index) => {

                                // // //// //// console.log(item,index)

                                if (tRef.current.length !== fields.length) {
                                    // add or remove refs
                                    // // //// //// //// console.log('f', fields)
                                    tRef.current = Array(fields.length)
                                        .fill()
                                        .map((_, i) => tRef.current[i] || createRef());
                                }

                                let bgcolors
                                const currentRowid = (!_.isUndefined(fields[index]) ? fields[index].rowid : null)
                                // console.log(_.get(_.find(formComps,{editstatus:'always'}),'editstatus'))
                                if ((_.get(_.find(formComps, { editstatus: 'always' }), 'editstatus') == 'always' || gridedit.id === currentRowid && gridedit.status) || _.isEmpty(currentRowid)) {
                                    bgcolors = 'palegreen'
                                    /* 
                                                                        if (!_.isEmpty(tRef.current[index].current)) {
                                                                            tRef.current[index].current.focus()
                                                                        } */
                                }

                                const NotDeleted = _.isEmpty(_.find(deletelist, ['tid', item.tid]))

                                return (<tr
                                    tabIndex={0}
                                    //ref={trowRef.current[index]}
                                    ref={tRef.current[index]}
                                    style={{ backgroundColor: bgcolors, display: (!NotDeleted && 'none') }}
                                    key={`trow.${item.tid}.${index}`}
                                    onKeyDown={async (e) => {
                                        let cIdx, cName

                                        if (e.code === 'ArrowUp' && index > 0 && e.ctrlKey) {
                                            //   // //// //// //// console.log(tRef.current[index], index)

                                            // tRef.current[index - 1].current.focus()
                                            // setFocus(`inputgrid[${cIdx - 1}].${cName}`)


                                            if (!_.isUndefined(activecols)) {//const cRname = activecolumn.substring(0, activecolumn.indexOf(']') + 1)
                                                if (!_.isNil(activecols)) {
                                                    cIdx = Number(activecols.substring(activecols.indexOf('[') + 1, activecols.indexOf(']')))
                                                    cName = activecols.substring(activecols.indexOf(']') + 2)
                                                }
                                            }
                                            //  // //// //// console.log('down', activecols, cIdx, cName)


                                            tRef.current[index - 1].current.focus()

                                            //// //// //// console.log(`focus inputgrid[${cIdx - 1}].${cName}`)


                                            try {
                                                setFocus(`inputgrid[${cIdx - 1}].${cName}`)


                                            } catch (error) {
                                                console.log('fucst eror', error)
                                            }

                                        } else
                                            if (e.code === 'ArrowDown' && e.ctrlKey) {
                                                //   // //// //// //// console.log(tRef.current.length, tRef.current[index].current, reactselectopen)
                                                ////// //// //// console.log(tRef.current[index].current.children)
                                                if (tRef.current.length === Number(tRef.current[index].current.children[0].innerHTML)) {
                                                    let pos = tRef.current.length
                                                    apenddata()
                                                } else {
                                                    //// console.log(activecols, _.isNil(activecols))

                                                    if (!_.isUndefined(activecols)) {//const cRname = activecolumn.substring(0, activecolumn.indexOf(']') + 1)
                                                        if (!_.isNil(activecols)) {
                                                            cIdx = Number(activecols.substring(activecols.indexOf('[') + 1, activecols.indexOf(']')))
                                                            cName = activecols.substring(activecols.indexOf(']') + 2)
                                                        }
                                                    }
                                                    //// //// //// console.log('down', activecols, cIdx, cName)
                                                    //// console.log('name', `inputgrid[${cIdx - 1}].${cName}`)

                                                    tRef.current[index + 1].current.focus()

                                                    //// //// //// console.log(`focus inputgrid[${cIdx + 1}].${cName}`)

                                                    try {
                                                        console.log(`focus down inputgrid[${cIdx + 1}].${cName}`)
                                                        setFocus(`inputgrid[${cIdx + 1}].${cName}`)
                                                    } catch (error) {
                                                        console.log('fucst eror 2', error)
                                                    }

                                                }
                                            }
                                        //                                // //// //// //// console.log(tRef.current.length, tRef.current[index].current.children[0].innerHTML)
                                    }}>
                                    <td className='fix' key={`item.${index + 1}`} style={{ textAlign: 'center' }}>{index + 1}</td>
                                    {formGrouped(item, index)}
                                    {actionColumn(item, index)}
                                </tr>)
                            })}
                    </tbody>
                    <Calc control={control} setValue={setValue} comp={formComps} />
                    <Footer />
                </table>
            </div ></>
    )


}

const mapStateToProps = (state) => {

    return {
        _trxid: state.auth.trxid,
        datalinkedsubmited: (!_.isUndefined(state.auth.datalinkedsubmited) && state.auth.datalinkedsubmited),
        checkdatalinkedsubmited: _.isEmpty(state.auth.datalinkedsubmited),
        formComps: getFormListComponent(),
        formSubComps: getFormSubListComponent(),
        addCount: state.auth.fieldAddNumber,
        deletelist: state.auth.deletelist,
        singleload: state.auth.singleload,
        gridedit: state.auth.gridedit
    }
}

export default connect(mapStateToProps)(ComponentAdaptersGrids)