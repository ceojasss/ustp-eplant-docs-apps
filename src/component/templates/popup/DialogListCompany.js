import React, { useEffect } from "react"
import { Loader, Dimmer, Container, Popup, Button, Card } from "semantic-ui-react"
import _ from 'lodash'

import { connect, useDispatch } from "react-redux"
import { fetchSites } from "../../../redux/actions"
import { useNavigate } from "react-router-dom"





const DialogListCompany = ({ user, auths_site }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchSites(user))
    }, [user])



    const handlerClick = (to, current) => {

        //console.log('data', to)
        const company = {
            loginid: current.loginid,
            site: to.site,
            companyname: to.fullcompanyname
        }


        navigate('/switchcompany', {
            state: {
                company
            }
        })

        /*         dispatch(switchCompany(req, () => {
                    dispatch(setModalStates(''))
                   
                }
                ))
         */
        // navigate('/switchcompany')
    }


    const RenderSite = ({ auths_site, user }) => {
        // console.log('render site')
        return <Container textAlign='center' >
            <Card.Group style={{ marginLeft: '20px' }}>
                {_.map(auths_site, (x, index) => {
                    console.log(x, index)

                    return <Card key={`card-${index}`}>
                        <Card.Content>
                            <Card.Header>{x.site}</Card.Header>
                            {/* <Card.Meta>{x.companyname}</Card.Meta>
                             */}<Card.Description>
                                {x.companyname}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Popup
                                style={{ zIndex: 100000 }}
                                key={`popup.${index}`}
                                trigger={
                                    <Button basic primary icon='exchange' labelPosition='right' content={`Switch ${x.site}`} />
                                }
                                content={<Button size='medium' primary content={`${x.site} Switch Confirmation`} onClick={() => handlerClick(x, user)} />}
                                on='click'
                                position='top center'
                            />
                        </Card.Content>
                    </Card>
                })}
            </Card.Group>
            {/*     <List celled horizontal relaxed='very' size="huge">
                {
                    (() => {
                        return _.map(auths_site, (x, index) => {
                            return <Popup
                                style={{ zIndex: 100000 }}
                                key={`popup.${index}`}
                                trigger={
                                    <List.Item>
                                        <List.Content as='a' >
                                            <Icon name='sign in' size="large" />
                                            <List.Header style={{ color: 'currentcolor' }}>{x.companyname}</List.Header>
                                        </List.Content>
                                    </List.Item>
                                }
                                content={<Button size='large' primary content={`Switch to ${x.site}`} onClick={() => handlerClick(x, user)} />}
                                on='click'
                                position='top-center'
                            />
                        })
                    })()
                }
            </List> */}
        </Container>
    }

    if (_.isEmpty(auths_site))
        return <Container textAlign='center'>
            <Dimmer active inverted >
                <Loader />
            </Dimmer>
        </Container>

    return <RenderSite auths_site={auths_site} user={user} />
}

const mapStateToProps = (state) => {

    return {
        user: state.auth.menu.user,
        auths_site: !_.isUndefined(state.auth.user_site_auth) && state.auth.user_site_auth
    }
}

export default connect(mapStateToProps)(DialogListCompany) 