import React, { useState } from "react";
import _ from 'lodash'
import { useSelector, useDispatch } from "react-redux";
import { Accordion } from "semantic-ui-react";

import ComponentAdaptersGroupArray from "./ComponentAdaptersGroupArray";
import ComponentAdaptersGroup from "./ComponentAdaptersGroup";

import { getDocTitle, getFilterComponent, getFormListComponent } from "../../../utils/FormComponentsHelpler";
import "react-datepicker/dist/react-datepicker.css"
import { SET_ACCORDION } from "../../../redux/actions/types";


const ComponentAdaptersMixed = ({ defaultDataValue, methods, formRefs, postAction, actionDetailRef }) => {
    const dispatch = useDispatch()

    const [accordionOpenz, setAccordionOpen] = useState(true)
    const gridMax = useSelector(state => state.auth.gridwindowmax);
    const accordionOpen = useSelector(state => state.auth.accordionOpen);


    const masterdetailtype = _.get(getFormListComponent()[0], 'masterdetailtype');
    const filter = getFilterComponent()


    const GroupForm = () => {
        return <ComponentAdaptersGroup
            key="0.componentgroupMixed"
            OnClickRef={formRefs}
            innerRef={formRefs}
            {...methods}
            defaultDataValue={defaultDataValue}
            postAction={postAction}
            masterdetail={true}
        />
    }

    const GroupArray = () => {
        return <ComponentAdaptersGroupArray
            key="0.componentgroupMixedDetail"
            OnClickRef={formRefs}
            methods={methods}
            defaultDataValue={defaultDataValue}
            postAction={postAction}
            masterdetail={true}
            viewHeight={(masterdetailtype == 'FORM_MASTER_DETAIL_GENERATED' ? gridMax ? '80vh' : (accordionOpen ? '40vh' : '50vh') /*accordionOpen ? '20vh' : '30vh'*/ : gridMax ? '80vh' : (accordionOpen ? '33vh' : '50vh'))}
            createButton={true} />
    }

    //console.log('render mix')
    return (
        <>
            {_.isEmpty(filter) ? <Accordion
                fluid
                styled
                activeIndex={accordionOpen ? 0 : -1}
                panels={[{
                    key: 'details',
                    title: getDocTitle(),
                    content: { content: <GroupForm key={'group.form'} /> },
                }
                ]}
                onTitleClick={(e) => {
                    //console.log(e)
                    //setAccordionOpen(!accordionOpen)
                    dispatch({ type: SET_ACCORDION, payload: !accordionOpen })
                }}
                style={{ marginBottom: '0.5em' }}
            /> : <GroupForm key={'group.form'} />}
            <GroupArray />
        </>)
}

export default ComponentAdaptersMixed