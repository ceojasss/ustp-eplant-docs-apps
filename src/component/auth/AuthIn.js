import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from "react-redux"
import { redirect, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Icon, Container, Grid, Header, Image, Form, Button, Segment, Message } from 'semantic-ui-react'
import { useForm } from 'react-hook-form'

import _ from 'lodash'
import * as actions from '../../redux/actions'

import './SigninStyle.css'
import LoadingStatus from '../templates/LoadingStatus'


const AuthIn = ({ auth, authsite }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [passwordShown, setPasswordShown] = useState(false);


    const param = useLocation()
    const q = new URLSearchParams(param.search)

    const _id = q.get('id')
    const _site = q.get('site')
    const _redirect = q.get('redirect')


    console.log(_id, _redirect)

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
    };


    const togglePasswordVisiblity = (e) => {
        setPasswordShown(!passwordShown);
    };

    const renderError = () => {

        if (!_.isEmpty(auth.errorMessage)) {
            return (
                <Message icon='warning'
                    size='large'
                    as={Segment}
                    error
                    style={{ width: '900px', margin: 'auto' }}
                    header='Login Gagal'
                    content={auth.errorMessage}
                />
            )
        }
    };



    const login = async () => {

        console.log('login dong ', _id, _site)

        const values = {
            key: _id,
            site: _site,
            loginid: 'N/A',
            password: 'N/A',
        }


        await dispatch(actions.signKey(values, (x) => {
            // // console.log(x)
            navigate(`/${_redirect}`)
        }))
    };

    useEffect(() => {
        login()
        /*        if (auth.authenticated) {
        
                    navigate('/')
                }
                else {
                    login()
                }*/
    }, [auth.authenticated, navigate])

    const checkUser = _.debounce(async e => {


        // // console.log('check user')

        let isCheck

        await dispatch(actions.uservalid({ loginid: e.target.value }, (v) => {
            isCheck = v
            dispatch(actions.loadSite(e.target.value))

        }))


        // // console.log(isCheck)


        //// console.log(e.target.value)
    }, 500)


    const loadSite = async (e) => {
        // // console.log(e.target.value)
        await dispatch(actions.loadSite(e.target.value))

    }



    return (
        <Container fluid style={{ backgroundColor: 'gainsboro', height: '100vh', padding: '100px' }} >
            <LoadingStatus msg={'Authorize User....'} />
            {renderError()}
        </Container >
    )

}


const mapStateToProps = (state) => {
    // // console.log(state)
    return {
        auth: state.auth,
        authsite: state.auth.authorizedsite
    }
}

export default connect(mapStateToProps, actions)(AuthIn)