import React, { useMemo, useEffect } from "react";
import _ from 'lodash'
import { Button, Form, Header, Modal, Tab } from "semantic-ui-react";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";

import FormComponents from "./FormComponent";
import { getDocTitle, getFilterComponent, getFormComponent } from "../../../utils/FormComponentsHelpler";

import "react-datepicker/dist/react-datepicker.css"
import DialogScanQR from "../popup/DialogScanComponentQR";
import { MODAL_TRX_CLOSE } from "../../../redux/actions/types";

const ComponentAdaptersGroup = ({ control, trigger, formComp, postAction, OnClickRef, masterdetail, formComp2, filter, btn }) => {

    let isMasterdetail = _.isUndefined(masterdetail) ? false : masterdetail

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const openmodal = useSelector(state => state?.auth?.modalstrx)

    const modals = useMemo(() => {
        return <Modal open={openmodal} >
            <Modal.Header content={<Header as='h2' icon='qrcode' content='Scan QR' />} />
            <Modal.Content >
                <DialogScanQR formComp2={_.get(formComp2,'form.group')}/>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => dispatch({ type: MODAL_TRX_CLOSE })} content='Tutup' negative />
            </Modal.Actions>
        </Modal>
    }, [openmodal])


    const FormGrouped =
        ({ indexing, fields, last, hasTab }) => {

            // console.log(indexing, last, hasTab)

            return (<Form.Group
                key={`${indexing}.1`}
                style={{
                    marginTop: '-0.35cm'/*/*(last ? '-0.1cm' : '-0.4cm')  '-0.2cm' */,
                    marginBottom: (!last ? '0.4cm' : (!hasTab ? '-0.4cm' : '0.2cm')),
                    fontSize: 'smaller'
                }}
                children={_.map(fields, (f, i) => {
                    return (
                        <Controller
                            key={`c.${f.registername}`}
                            control={control}
                            name={f.registername}
                            render={(field) => {
                                return <FormComponents
                                    key={`f-${f.registername}`}
                                    {...field}
                                    {...f}
                                    postAction={postAction}
                                    clickref={OnClickRef}
                                />
                            }
                            }

                        />)
                })
                }
            />)
        }

    const ResetButton = () => {
        return <Button content='Tambah Data Baru' icon='add' positive onClick={() => {
            navigate('./')
            /* reset();
            InitDefaultValues(); */
        }} style={{ display: 'none' }} />
    }

    const formGroups = _.map(_.keys(formComp2), (v, idx) => _.groupBy(formComp2[v], 'grouprowsseq'))

    const fg = _.mapKeys(formGroups, (x, id) => _.keys(formComp2)[id])

    const Formelm = useMemo(() => _.map(
        Object.keys(formComp),
        (v, index) => {
            return <FormGrouped key={`groupforms.${index}`} indexing={`${index}.${v}`} fields={formComp[v]} />
        }), [])

    const RenderTab = () => {
        const tcomp = _.groupBy(formComp2['form.group.tab'], 'groupclassname')

        let counter = 0
        return _.map(tcomp, (l, idx) => {
            function setCharAt(str, index, chr) {
                if (index > str.length - 1) return str;
                return str.substring(0, index) + chr + str.substring(index + 1);
            }
            const comps = _.groupBy(l, 'grouprowsseq')
            let title = idx.replaceAll('_', ' ').toLowerCase()
            title = setCharAt(title, 0, '')
            // const title = idx.replaceAll('_', ' ').replaceAt(/\d+/g, '').toLowerCase()
            return {
                key: `menu.tab${idx}`,
                menuItem: title.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
                pane: (
                    <Tab.Pane key={`tab.pane${idx}`} >
                        {
                            _.map(comps, (v, index) => {
                                counter++
                                return <FormGrouped key={`groupformst.${counter}`} indexing={`${idx}.${counter} `} fields={v} />
                            })
                        }
                    </Tab.Pane >)
            }
        })
    }


    const RenderForm = () => {
        const comps = _.groupBy(formComp2['form.group'], 'grouprowsseq')
        const filters = _.groupBy(filter['form.group'], 'grouprowsseq')


        const hasTab = !_.isEmpty(_.groupBy(formComp2['form.group.tab'], 'groupclassname'))

        const lastKey = _.findLastKey(comps)

        if (_.isEmpty(comps)) {
            return _.map(filters, (v, index) => <FormGrouped key={`groupforms.${index} `} indexing={`${index}.${v} `} fields={v} last={index === lastKey}
                hasTab={hasTab} />)
        } else {
            return _.map(comps, (v, index) => <FormGrouped key={`groupforms.${index} `} indexing={`${index}.${v} `} fields={v} last={index === lastKey}
                hasTab={hasTab} />)
        }
    }


    const FormelmTab = useMemo(() => {
        return <>
            {RenderForm()}
            {
                !_.isEmpty(_.groupBy(formComp2['form.group.tab'], 'groupclassname')) &&
                <Tab key='tab-panes01' panes={RenderTab()} renderActiveOnly={false} />}
            {btn}
        </>
    }, [])


    useEffect(() => {
        const triggeringValidation = async () => {
            try {
                await trigger();
            } catch (error) {
                // abaikan ... //// console.log(error)
            }
        }

        triggeringValidation()
    }, []);


    return (<div key={'componentadaptersgroup.0'}>
        {!isMasterdetail &&
            <Header as='h3' dividing>
                {getDocTitle()}
                {ResetButton()}
            </Header>}
        {FormelmTab}
        {modals}
    </div>)
}



const mapStateToProps = (state) => {
    return {
        formComp2: _.groupBy(getFormComponent(state, 'FORM'), 'classRows'/* , 'grouprowsseq' */),
        formComp: _.groupBy(getFormComponent(state, 'FORM'), 'grouprowsseq'),
        formsx: getFormComponent(state, 'FORM'),
        filter: _.groupBy(getFilterComponent(state, 'FILTER'), 'classRows'/* , 'grouprowsseq' */)

    }
}

export default connect(mapStateToProps)(ComponentAdaptersGroup)