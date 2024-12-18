import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from "react-redux"
import { useLocation, useNavigate } from 'react-router-dom'
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react'
import { useForm } from 'react-hook-form'

import _ from 'lodash'
import * as actions from '../../redux/actions'

import './SigninStyle.css'
import { toast } from 'react-toastify'


const SwitchCompany = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [passwordShown, setPasswordShown] = useState(false);


    const { state: company } = useLocation();

    //// console.log(company);

    useEffect(() => {

        dispatch(actions.switchCompany({ ...company }, (v) => {


            if (v === 'success') {
                toast.success('Company Changed Success', { autoClose: 1000 })

                dispatch(actions.setModalStates(''))
                navigate('/')

            }
        }
        ))

    }, [])


    return <Segment placeholder style={{ height: '100vh' }}>
        <Dimmer active inverted >
            <Loader size='large'>Switch Company</Loader>
        </Dimmer>
    </Segment>
}


const mapStateToProps = (state) => {
    // console.log(state)
    return {
        auth: state.auth,
        authsite: state.auth.authorizedsite
    }
}

export default connect(mapStateToProps, actions)(SwitchCompany)