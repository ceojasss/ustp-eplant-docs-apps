import React, { useEffect } from 'react'
import _ from 'lodash'
import { Sidebar, Segment, Loader, Dimmer, Header as HeaderUI, Icon, Container } from 'semantic-ui-react'
import { connect, useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { Outlet, useNavigate } from 'react-router-dom'


import Headers from './Headers'
import SideMenu from './Sidemenu'
import Footer from './Footer'
import { fetchMenu } from "../../redux/actions"
import requireAuth from '../auth/requireAuth'
import { Appresources } from './ApplicationResources'
import '../Public/CSS/App.css'


const Header = ({ menu, auth, errors, admin }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {

        if (_.isEmpty(auth.authenticated)) {
            navigate('/signin')
        }
        else {

            let decodedToken = jwt_decode(auth.authenticated);
            let currentDate = new Date();

            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                navigate('/signout')
            }
            else {
                dispatch(fetchMenu())
            }
        }

    }, [auth.authenticated, dispatch])



    const renderError = () => {
        return (
            <Container textAlign='center' style={{ height: '97vh', marginTop: '40vh' }} >
                <HeaderUI as='h1' icon >
                    <Icon name='broken chain' color='red' />
                    {errors}
                    <HeaderUI.Subheader
                        style={{ fontSize: '20px', fontWeight: 'bold' }}
                        content={Appresources.TRANSACTION_ALERT.TELL_ADMIN} />
                </HeaderUI>
            </Container>
        )
    }


    const RenderPage = () => {

        if (errors)
            return renderError()


        return (
            <Segment.Group style={{ height: '97vh' }} >
                <Sidebar.Pushable as={Segment}  >
                    {!_.isEmpty(auth.authenticated) && <SideMenu />}
                    <Sidebar.Pusher className='imgs' style={{ background: 'whitesmoke' }}>
                        <Headers />
                        {(() => {
                            if (menu.length === 0) {
                                return (<Dimmer active inverted > <Loader size='massive' content='Loading..' inline />  </Dimmer>)
                            } else {
                                return <Outlet key='outlet-router' />
                            }

                        })()}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
                <Footer />
            </Segment.Group>)
    }

    return RenderPage()

}

const mapStateToProps = (state) => {
    return {
        errors: state.auth.errorMessage,
        menu: state.auth.menu,
        auth: state.auth,
        admin: state.auth.activeRoute
    }
}


//export default connect(null, { fetchMenu })(Header)
export default requireAuth(connect(mapStateToProps, { fetchMenu })(Header))