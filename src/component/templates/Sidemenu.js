import React, { useMemo, useState, useEffect } from 'react'
import { Sidebar, Accordion, Image, Header, Dimmer, Loader, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from "lodash"
import './sidebar.css'

const SideMenu = ({ jsonData, userid, sidebarvisible }) => {


    const handleTitleClick = (e, itemProps) => {

        const { index } = itemProps


    }


    const LinkTo = (v) => {
        let routing

        routing = v?.route

        if (routing && routing.indexOf('report') !== -1) {
            return <Link className='link' to={`/${v.route}/${v.controlsystem}`} state={{ route: `/${v.route}/${v.controlsystem}` }} > {v.title} </Link>
        } else {
            return <Link className='link' to={`/${v.controlsystem}/${v.route}`} state={{ route: `/${v.controlsystem}/${v.route}` }} > {v.title} </Link>
        }
    }

    const AccordionRender = ({ index, v }) => (_.get(v, 'useweb') == 'Y' ?
        < Accordion.Title

            key={`${v.module}${v.submodule}${v.parent}`}
            style={{ marginTop: '0px', marginBottom: '0px', marginLeft: '30px' }}
            icon={v.icon}
            index={index}
            content={LinkTo(v)}
            onClick={handleTitleClick}
        />
        : _.get(userid, 'loginid') == 'RAHMADINA HO' || _.get(userid, 'loginid') == 'DWI HO' || _.get(userid, 'loginid').match(/ADMIN.*/) ? < Accordion.Title
            key={`${v.module}${v.submodule}${v.parent}`}
            style={{ marginTop: '0px', marginBottom: '0px', marginLeft: '30px' }}
            icon={v.icon}
            index={index}
            content={LinkTo(v)}
            onClick={handleTitleClick}
        /> : null
    )



    const accordify = jsonData => {
        if (_.size(jsonData) === 0) {
            return;
        } else {
            for (let i = 0; i < jsonData.length; i++) {

                accordify(jsonData[i]["content"]);

                if (_.size(jsonData[i]["content"]) !== 0) {
                    jsonData[i]["content"] = {
                        content: (
                            <>
                                <Accordion.Accordion /*defaultActiveIndex={0}*/
                                    //  activeIndex={1}
                                    key={`idx${i}}`}
                                    panels={jsonData[i]["content"]}
                                    style={{ marginTop: '0px', marginLeft: '30px' }}
                                    onTitleClick={(e, p) => {
                                        // // console.log(' sub title click ', p)
                                    }}
                                />
                                {_.map(jsonData[i]["contentvalues"], (v) => <AccordionRender index={i} v={v} key={v.key} />)}
                            </>
                        ),
                    };
                } else {
                    jsonData[i]["content"] = { content: _.map(jsonData[i]["contentvalues"], (v, idx) => < AccordionRender index={idx} v={v} key={v.key} />) }
                }
            }

        }
    }

    useMemo(() => accordify(jsonData), [jsonData]);

    const RenderSidebar = () => {
        const [isVisible, setIsVisible] = useState(true);
    
        const handleScreenSizeChange = () => {
            if (window.innerWidth <= 414) {
                setIsVisible(!sidebarvisible);
            } else {
                setIsVisible(sidebarvisible); // Ganti dengan cara Anda mengatur sidebarvisible
            }

            console.log('lebar :',window.innerWidth );
        };
    
        useEffect(() => {
            handleScreenSizeChange();
            window.addEventListener('resize', handleScreenSizeChange);
            return () => {
                window.removeEventListener('resize', handleScreenSizeChange);
            };
        }, [sidebarvisible]); // Pastikan untuk menyertakan variabel yang mempengaruhi perubahan pada useEffect
    
        return (
            <Sidebar
                animation='push'
                icon='labeled'
                visible={isVisible}
                content={
                    <>
                        <Image
                            fluid
                            as={Header}
                            style={{ padding: '10px' }}
                            src="/LOGO EPLANT v2 opsi3.png"
                        />
                        <Accordion
                            key='treemain'
                            className='treeMain'
                            panels={jsonData} // Ganti dengan cara Anda mendapatkan jsonData
                            style={{ fontSize: 'smaller' }}
                            onTitleClick={(e, p) => {
                            }}
                        />
                    </>
                }
            />
        );
    };

    const RenderLoading = () => {
        return (
            <Sidebar
                animation='push'
                icon='labeled'
                visible
            >
                <Image wrapped fluid
                    as={Header}
                    style={{ padding: '10px' }}
                    src="/LOGO EPLANT v2 opsi3.png"
                />
                <Dimmer active inverted style={{ maxHeight: '100px', marginTop: '120px' }}>
                    <Loader size='small'>Loading</Loader>
                </Dimmer>
            </Sidebar >
        )
    }


    if (!jsonData || jsonData.length === 0 || _.isEmpty(userid))
        return <RenderLoading />


    return <RenderSidebar {...jsonData} />
}


const mapStateToProps = (state) => {
    // // // console.log(state)
    return {
        userid: state.auth.menu.user,
        jsonData: state.auth.menu.values,
        sidebarvisible: state.auth.sidevisible
    }


}


//export default SideMenu
export default connect(mapStateToProps)(SideMenu)