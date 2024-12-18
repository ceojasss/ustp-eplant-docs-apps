import { useMemo } from "react"
import _ from 'lodash'

import { useDispatch, useSelector } from "react-redux"
import { Container, Form, Icon, Popup, Segment, Select } from "semantic-ui-react"
import { setSelectedFilter } from "../../modules/executive/ModuleAction"

const selectoptions = (v) => _.map(v, (s, si) => {
    return {
        'key': si,
        'text': Object.values(s)[1],
        'value': Object.values(s)[0],
    }
})


const ContentFilter = () => {

    const dispatch = useDispatch()


    const content = useSelector(state => state.auth.filtercontent)
    const selected = useSelector(state => state.auth.filterselected)




    const renderContent = useMemo(() => _.map(content, (cv, idx) => {

        switch (cv.group.returntype) {
            case 'checkbox':


                return <Form.Group key={`cfilter.${idx}`} width={3} style={{ fontSize: 'smaller' }}>
                    {_.map(cv.rows, (cb, cbi) => {
                        const v = Object.values(cb)

                        const isCheck = v[0] === cv?.group?.value
                        //  console.log(v[1], isCheck)

                        // if (v[0] !== cv.group.default_selected_value) {
                        return <Form.Radio key={`cbi.${cbi}`}
                            label={v[1]}
                            style={{ fontWeight: 'bold', fontSize: 'xx-small' }}
                            checked={isCheck}
                            value={v[0]}
                            onChange={async (e, selected) => {

                                //                                const picked = _.find(selected.options, ['value', selected.value])

                                const val = { value: v[0], remarks: v[1], code: cv?.group?.code }
                                dispatch(setSelectedFilter(val))

                                // console.log( cb, val, selected)
                            }}
                        />
                        // }
                    })}
                </ Form.Group>
            default:
                return <Form.Field
                    key={`cfilter.${idx}`}
                    control={Select}
                    width={7}
                    options={selectoptions(cv?.rows)}
                    label={<div style={{ fontSize: 'smaller', fontWeight: 'bold' }}>
                        {cv?.group?.group}&nbsp;&nbsp;
                        {!_.isEmpty(cv?.group?.value) && <Popup content={`Clear Filter ${cv?.group?.group}`}
                            position='top left' size="tiny"
                            trigger={<Icon.Group onClick={() => {
                                const clear = { value: '', remarks: '', code: cv?.group?.code }
                                dispatch(setSelectedFilter(clear))
                            }}>
                                <Icon name='filter' link color="red" /> <Icon corner color="red" name='times' />
                            </Icon.Group>} />}
                    </div >}
                    placeholder={cv?.group?.group}
                    search
                    value={cv?.group?.value}
                    searchInput={{ id: `cfilter.${idx}` }}
                    onChange={async (e, selected) => {

                        const picked = _.find(selected.options, ['value', selected.value])
                        const val = { value: picked?.value, remarks: picked?.text, code: cv?.group?.code }

                        dispatch(setSelectedFilter(val))
                    }}
                    style={{ fontSize: 'smaller' }}
                />
        }

    }), [content, selected])


    if (!content)
        return null;

    return < div className={`container-segment}`} key={`cs-}`}>
        <Segment.Group raised key={`sg.filter0`} style={{ margin: '4px'/* , maxWidth: '20vw' */ }}  >
            <Segment clearing style={{
                fontSize: 'small',
                fontWeight: 'bold',
                marginBottom: '-10px',
                paddingTop: '10px'
            }} secondary>
                <Icon fitted name={'filter'}
                    style={{ float: 'inline-start' }} />&nbsp;Content Filter
            </Segment>
            <Segment style={{
                paddingTop: '10px',
                maxHeight: '60vh',
            }} >
                <Container style={{ width: '15vw' }} >
                    <Form size="small">
                        {renderContent}
                    </Form>
                </Container>
            </Segment>
        </Segment.Group>
    </div>
}


export default ContentFilter