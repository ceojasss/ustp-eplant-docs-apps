import React from "react"
import { Segment, Button, Dropdown, Icon, Loader, Label } from "semantic-ui-react";

import { useNavigate } from 'react-router-dom'
import { connect, useDispatch } from "react-redux";
import { openListCompany } from "../../redux/actions";
import { VISIBLE_SIDE } from "../../redux/actions/types";


const Headers = ({ user, sidebarvisible }) => {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const handleItemClick = (e, { value }) => {
        navigate(`/${value}`)
    }




    const changeSite = () => {
        dispatch(openListCompany('test'))
    }

    const options = [
        { key: 'messages', icon: 'mail', text: 'Message', value: 'message' },
        { key: 'setting', icon: 'setting', text: 'Setting', value: 'setting' },
        { key: 'signout', icon: 'sign-out', text: 'Sign Out', value: 'signout', onClick: handleItemClick },
    ]

    const RenderHeader = () => <Segment.Inline style={{ zIndex: '1000' }} >
        <Button floated="left" icon onClick={() => {
            dispatch({ type: VISIBLE_SIDE, payload: !sidebarvisible })
        }} style={{ zIndex: '9999' }}>
            <Icon name={sidebarvisible ? `bars` : `indent`} />
        </Button>
        <Button.Group
            color='blue'
            compact
            attached="top"
            floated='right'
            size="mini"
            style={{ marginTop: '10px', marginRight: (!sidebarvisible ? '1cm' : '8cm') }}>
            <Button basic animated='fade' onClick={changeSite} style={{ marginRight: '0.2cm' }} color='blue' >
                <Button.Content visible> {`Company Site : ${user.site}`} </Button.Content>
                <Button.Content hidden>Switch Company</Button.Content>
            </Button>
            <Button > <Icon name='user circle outline' /> {user.loginid}
                <Label color='teal' floating size="mini"> 0</Label>
            </Button>
            <Dropdown
                style={{ fontSize: '10pt' }}
                className='button icon'
                floating
                options={options}
                trigger={<></>}
            />
        </Button.Group >


    </Segment.Inline >


    if (!user)
        return <Loader />

    return <RenderHeader />
}



const mapStateToProps = (state) => {
    return {
        user: state.auth.menu.user,
        sidebarvisible: state.auth.sidevisible

    }
}

export default connect(mapStateToProps)(Headers) 