import React, { useEffect } from "react"
import _ from 'lodash'

import { Button, ButtonGroup, Grid, Label, List } from "semantic-ui-react"
import Select from 'react-select'
import { useSelector } from "react-redux"
import { filterHeaderStyles, navStyles } from "../Style"

const FilterHeader2 = ({ searchaction }) => {


    let selectOptions = useSelector((state) => state.auth.filteronnav2?.rows)

    const sidebarvisible = useSelector((state) => state.auth.sidevisible)

    if (!_.isEmpty(selectOptions)) {

        selectOptions = _.map(selectOptions, v => {


            let obj = {}
            for (let index = 0; index < _.size(_.values(v)); index++) {

                let val

                if (index === 0) {
                    val = 'value'
                } else if (index === 1) {
                    val = 'label'
                } else {
                    val = `extradata${index}`
                }

                obj = { ...obj, [val]: Object.values(v)[index] }

            }

            return obj
        })

    }



    if (!searchaction)
        return null

    //  console.log('filter', searchaction, searchaction.defaultValue, (_.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value))



    if (_.isEmpty(selectOptions))
        return <> loading filter</>





    const Filter = () => {
        // console.log(selectOptions[2])

        switch (searchaction?.type) {
            case 'button':
                return <ButtonGroup key={`bgs`} size="tiny" floated='right' style={{ marginRight: '50px' }}>
                    {_.map(selectOptions, (x, y) => <Button key={`bgs.${y}`}
                        basic={x.label !== (_.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value)}
                        color='blue'
                        active={x.label === (_.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value)}
                        onClick={() => searchaction.onButtonclick(x.label)}>{x.label}</Button>)}
                </ButtonGroup>
                break;
            case 'list':
                return <List size="tiny" bulleted horizontal /* style={{ marginLeft: '30px' }}  */>
                    {_.map(selectOptions,
                        (x, y) => x.label !== 'USTP' && <List.Item key={`ls.${y}`}
                            as='a'
                            onClick={() => searchaction.onButtonclick(x.label)}><b>{x.label}</b></List.Item>)
                    }
                </List >
            default:
                return <> <Grid.Column width={1} textAlign="right" floated="right" style={{ marginRight: '-1.1em' }}>
                    <Label pointing='right' content={searchaction?.label ? searchaction?.label : 'Kebun'} size='tiny' color='teal' style={{ height: '26px', paddingTop: '0.7em', paddingLeft: '1.3em' }} />
                </Grid.Column> <Grid.Column floated="left" width={3} style={{ marginRight: (sidebarvisible ? '0.8cm' : '10vw') }} >
                        <Select
                            isLoading={(_.isEmpty(selectOptions) ? true : false)}
                            defaultValue={selectOptions[searchaction.defaultValue]}
                            options={selectOptions}
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            styles={filterHeaderStyles}
                            // isDisabled={!canEdit && true}
                            //{411 || 'Select'}
                            value={_.isEmpty(searchaction.value) ? selectOptions[searchaction.defaultValue] : _.filter(selectOptions, ['value', searchaction.value])}
                            onChange={searchaction.handleblur}
                            onBlur={searchaction.handleblur}
                        />
                    </Grid.Column></>

        }
    }


    return <Filter />
}

export default FilterHeader2