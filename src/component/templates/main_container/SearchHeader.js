import React from "react"
import _ from 'lodash'

import { Grid, Input } from "semantic-ui-react"


const SearchHeader = ({ searchaction }) => {


    if (!searchaction)
        return null

    return (
        <Grid.Column floated='right' width={5} >
            <Input
                size="mini"
                action={{
                    icon: 'search',
                    className: 'inverted circular link',
                    color: 'blue',
                    size: 'mini',
                    onClick: searchaction.onclick
                }
                }
                defaultValue={_.isEmpty(searchaction.value) ? '' : null}
                onKeyPress={searchaction.handleKeyPress}
                onBlur={searchaction.handleblur}//searchaction.value ? searchaction.value : null}
                placeholder='Search...'
            />
        </Grid.Column>)
}

export default SearchHeader