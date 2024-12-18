import React, { useState } from "react";
import _ from 'lodash'
import { Accordion, Header, Label } from "semantic-ui-react";

import ComponentAdaptersGroupArray from "./ComponentAdaptersGroupArray";
import ComponentAdaptersGroup from "./ComponentAdaptersGroup";

import "react-datepicker/dist/react-datepicker.css"
import { getDocTitle } from "../../../utils/FormComponentsHelpler";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const ComponentAdaptersLinked = ({ defaultDataValue, methods, formRefs, postAction, handler1 }) => {
    //const [open, setOpen] = useState(false)
    const [accordionOpen, setAccordionOpen] = useState(true)
    const gridMax = useSelector(state => state.auth.gridwindowmax);


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

    const Controller = () => {
        return <Label as={Header}
            color='green'
            floated="left"
            content={handler1.btnLabel}
            icon={handler1.btnIcon}
            labelposition="right"
            size="small"
            onClick={handler1.addClickHandler}
            style={{ marginBottom: '5px', cursor: 'pointer' }} />
        /*    return <Button
               positive
               floated="left"
               content={handler1.btnLabel}
               icon={handler1.btnIcon}
               onClick={handler1.addClickHandler}
               labelPosition='right' /> */
    }

    const GroupArray = useMemo(() => {
        return <ComponentAdaptersGroupArray
            key="0.componentgroupMixedDetail"
            OnClickRef={formRefs}
            methods={methods}
            defaultDataValue={defaultDataValue}
            postAction={postAction}
            masterdetail={true}
            viewHeight={(gridMax ? '80vh' : (accordionOpen ? '30vh' : '50vh'))}
            createButton={false}
        />
    }, [])


    return (
        <>
            <Accordion
                fluid
                styled
                defaultActiveIndex={0}
                panels={[{
                    key: 'details',
                    title: getDocTitle(),
                    content: {
                        content: <GroupForm key={'group.form'} />
                    }
                }
                ]}
                onTitleClick={(e) => {
                    setAccordionOpen(!accordionOpen)

                }}
                style={{ marginBottom: '0.5em' }}
            />
            <Controller />
            {GroupArray}

        </>)
}

export default ComponentAdaptersLinked