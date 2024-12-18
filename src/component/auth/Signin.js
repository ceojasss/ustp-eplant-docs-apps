import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { Icon, Container, Grid, Header, Image, Input, Form, Button, Segment, Message, Label } from 'semantic-ui-react'
import { useForm } from 'react-hook-form'

import _ from 'lodash'
import * as actions from '../../redux/actions'

import './SigninStyle.css'


const Signin = ({ auth, authsite }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [passwordShown, setPasswordShown] = useState(false);

    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm({ mode: "onBlur" });


    // // console.log('site', authsite)


    const onSubmit = (data) => {


        alert(JSON.stringify(data));
    };


    const togglePasswordVisiblity = (e) => {
        setPasswordShown(!passwordShown);
    };

    const renderError = () => {

        // // console.log(errors)
        if (!_.isEmpty(errors)) {
            return (
                <Message icon='warning'
                    size='large'
                    as={Segment}
                    error
                    style={{ width: '900px', margin:'auto'}}
                    header='Login Gagal'
                    list={_.map(errors, x => x.message)}
                />
            )
        }
        else if (!_.isEmpty(auth.errorMessage)) {
            return (
                <Message icon='warning'
                    size='large'
                    as={Segment}
                    error
                    style={{ width: '900px', margin:'auto' }}
                    header='Login Gagal'
                    content={auth.errorMessage}
                />
            )
        }
    };

    const renderErrorSubmit = (error) => {
        if (error) {
            return (
                <Message error floating size="mini">
                    <Message.Header>{error}</Message.Header>
                </Message>
            );
        }
    }

    const handleSubmits = async (values) => {
        // // console.log(values)
        await dispatch(actions.signin(values, (x) => {
            // // console.log(x)
            navigate('/')
        }))
    };

    useEffect(() => {

        if (auth.authenticated) {

            navigate('/')
        }
    }, [auth.authenticated, navigate])

    const checkUser = _.debounce(async e => {


        // // console.log('check user')

        let isCheck

        await dispatch(actions.uservalid({ loginid: e.target.value }, (v) => {
            isCheck = v
            dispatch(actions.loadSite(e.target.value))

        }))


        // // console.log(isCheck)

        if (isCheck !== 'exist') {

            //// console.log('error')
            setError("loginid", { type: 'manual', message: 'user not found' })
        }

        //// console.log(e.target.value)
    }, 500)


    const loadSite = async (e) => {
        // // console.log(e.target.value)
        await dispatch(actions.loadSite(e.target.value))

    }



    return (
        <Container fluid style={{  backgroundColor: 'gainsboro', height: '100vh', padding: '100px' }} >
                {/* <Grid.Row> */}
                    
                {/* </Grid.Row>
                <Grid.Row> */}
                    <Form as={Segment} raised style={{margin: 'auto', width: '900px', backgroundColor: 'whitesomke' }} size='large'>
                <Grid columns={2} centered >
                    <Grid.Column><div style={{marginTop:'15px'}} className='img'></div></Grid.Column>
                    <Grid.Column>
                    <Header size="huge" as={Grid.Column} textAlign="center">
                        <Image circular src='/ustp_logo.png' verticalAlign='middle' />
                        {(_.isUndefined(process.env.REACT_APP_LOGIN) ? 'iPlantation' : process.env.REACT_APP_LOGIN ) + ' Login'}
                    </Header>
                        <form onSubmit={handleSubmit(handleSubmits)}>
                            <Form.Input label='User ID' error={!_.isEmpty(errors['loginid']) && true}>
                                <input
                                    type='text'
                                    name="loginid"
                                    placeholder='User id'
                                    autoComplete='username'
                                    style={{ textTransform: 'uppercase' }}
                                    {...register("loginid",
                                        {
                                            required: "User ID Harus Diisi",
                                            onChange: checkUser,
                                            maxLength: 80,
                                            onBlur: loadSite
                                        },
                                    )}
                                />
                            </Form.Input >

                            <Form.Input label='Password' icon error={!_.isEmpty(errors['password']) && true}>
                                <input placeholder='Password'
                                    type={`${passwordShown ? "text" : "password"}`}
                                    {...register("password", { required: "Password Harus Diisi", maxLength: 80 })}
                                    autoComplete='current-password'
                                />
                                <Icon link name='eye' onClick={() => {
                                    togglePasswordVisiblity()
                                }} />
                            </Form.Input>

                            <Form.Input label='Site' error={!_.isEmpty(errors['site']) && true}>
                                <select //className='ui.form .field'
                                    className="ui selection dropdown"
                                    {...register("site", { required: "Site Harus Dipilih", maxLength: 80 })}>
                                    <option />
                                    {_.map(authsite, (v) => {
                                        // // console.log(v)
                                        return <option key={v.companyid} value={v.companyid}>{v.companyname}</option>
                                    })}
                                    {/*                                     {['GCM', 'SMG', 'SLM', 'SBE', 'SJE'].map(user => { return <option key={user}>{user}</option>; })} */}                                </select>
                            </Form.Input>
                            
                            <Button
                                primary
                                fluid
                                //style={{ width: '200px' }}
                                type='submit'
                                content="Login"
                                onClick={() => {
                                    reset(values => (
                                        {
                                            ...values,
                                            loginid: values.loginid.toUpperCase(),
                                        }
                                    ))
                                }}
                            />


                        </form>
                    <Header /*style={{ marginTop: '-20px' }}*/ size="small" as={Grid.Column} textAlign="center"
                        content={`© PT. Union Sampoerna Triputra Persada - ${new Date().getFullYear()}`} />
                        </Grid.Column>
            </Grid>
                    </Form>
                        {renderError()}
                {/* </Grid.Row> */}
                {/* <Grid.Row> */}
                {/* </Grid.Row> */}
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

export default connect(mapStateToProps, actions)(Signin)