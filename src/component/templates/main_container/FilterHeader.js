import React from "react"
import _ from 'lodash'

import { Button, ButtonGroup, Form, Grid, Input, Label, List, SearchCategory } from "semantic-ui-react"
import Select from 'react-select'
import { useSelector } from "react-redux"
import { navStyles, selectStyles } from "../Style"

const FilterHeader = ({ searchaction }) => {


    let selectOptions = useSelector((state) => state.auth.filteronnav?.rows)

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

    //  console.log(searchaction, searchaction.defaultValue, (_.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value))


    const Filter = () => {

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
                {/* <List.Item key={`ls.${y}`}
                            as='a'
                            onClick={() => searchaction.onButtonclick(x.label)}><b>{x.label}</b></List.Item> */}
            default:
                return <> <Grid.Column width={1} textAlign="right" floated="right" style={{ marginRight: '-1.1em' }}>
                    <Label pointing='right' content={searchaction?.label ? searchaction?.label : 'Kebun'} size='tiny' color='teal' style={{ height: '26px', paddingTop: '0.7em', paddingLeft: '1.3em' }} />
                </Grid.Column> <Grid.Column floated="left" width={3} style={{ marginRight: (sidebarvisible ? '0.8cm' : '10vw') }} >
                        <Select
                            isLoading={(_.isEmpty(selectOptions) ? true : false)}
                            options={selectOptions}
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            styles={navStyles}
                            // isDisabled={!canEdit && true}
                            defaultValue={searchaction.defaultValue || 'Select'}
                            value={_.filter(selectOptions, ['value', _.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value])}
                            onChange={searchaction.handleblur}
                            onBlur={async (value, props) => {
                                // // // // console.log(value)

                                // onsole.log(value, props)

                                //  dispatch({ type: HIDDEN_LIST, payload: { [name]: value.value } })
                                /// field.onChange(value.value)


                                // checkDependencies()


                                //dispatch({ type: HIDDEN_LIST, payload: { [name]: searchaction.value } })

                            }
                                // searchaction.handleblur 
                            }
                        />
                    </Grid.Column></>

        }
    }

    /*    return ((searchaction?.type === 'button' ?
           <ButtonGroup key={`bgs`} size="small" floated='right' style={{ marginRight: '50px' }}>
               {_.map(selectOptions, (x, y) => <Button key={`bgs.${y}`}
                   basic={x.label !== (_.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value)}
                   color='blue'
                   active={x.label === (_.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value)}
                   onClick={() => searchaction.onButtonclick(x.label)}>{x.label}</Button>)}
           </ButtonGroup>
           : <> <Grid.Column width={1} textAlign="right" floated="right" style={{ marginRight: '-1.1em' }}>
               <Label pointing='right' content={searchaction?.label ? searchaction?.label : 'Kebun'} size='tiny' color='teal' style={{ height: '26px', paddingTop: '0.7em', paddingLeft: '1.3em' }} />
           </Grid.Column> <Grid.Column floated="left" width={3} style={{ marginRight: (sidebarvisible ? '0.8cm' : '10vw') }} >
                   <Select
                       isLoading={(_.isEmpty(selectOptions) ? true : false)}
                       options={selectOptions}
                       menuPlacement='auto'
                       menuPortalTarget={document.body}
                       styles={navStyles}
                       // isDisabled={!canEdit && true}
                       defaultValue={searchaction.defaultValue || 'Select'}
                       value={_.filter(selectOptions, ['value', _.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value])}
                       onChange={searchaction.handleblur}
                       onBlur={async (value, props) => {
                           // // // // console.log(value)
     
                           // onsole.log(value, props)
     
                           //  dispatch({ type: HIDDEN_LIST, payload: { [name]: value.value } })
                           /// field.onChange(value.value)
     
     
                           // checkDependencies()
     
     
                           //dispatch({ type: HIDDEN_LIST, payload: { [name]: searchaction.value } })
     
                       }
                           // searchaction.handleblur 
                       }
                   />
               </Grid.Column></>
       ))
    */
    return <Filter />
}

export default FilterHeader

/*
 <Grid.Column width={1} textAlign="right" floated="right" style={{ marginRight: '-1.1em' }}>
            <Label pointing='right' content={searchaction?.label ? searchaction?.label : 'Kebun'} size='tiny' color='teal' style={{ height: '26px', paddingTop: '0.7em', paddingLeft: '1.3em' }} />
        </Grid.Column> <Grid.Column floated="left" width={3} style={{ marginRight: (sidebarvisible ? '0.8cm' : '10vw') }} >
            <Select
                isLoading={(_.isEmpty(selectOptions) ? true : false)}
                options={selectOptions}
                menuPlacement='auto'
                menuPortalTarget={document.body}
                styles={navStyles}
                // isDisabled={!canEdit && true}
                defaultValue={searchaction.defaultValue || 'Select'}
                value={_.filter(selectOptions, ['value', _.isEmpty(searchaction.value) ? searchaction.defaultValue : searchaction.value])}
                onChange={searchaction.handleblur}
                onBlur={async (value, props) => {
                    // // // // console.log(value)

                    // onsole.log(value, props)

                    //  dispatch({ type: HIDDEN_LIST, payload: { [name]: value.value } })
                    /// field.onChange(value.value)


                    // checkDependencies()


                    //dispatch({ type: HIDDEN_LIST, payload: { [name]: searchaction.value } })

                }
                    // searchaction.handleblur 
                }
            />
        </Grid.Column>
*/