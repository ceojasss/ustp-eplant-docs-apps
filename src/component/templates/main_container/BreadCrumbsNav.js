import React from "react";

import { Breadcrumb } from "semantic-ui-react";

import { Link, useLocation } from 'react-router-dom'

export const BreadcrumbNavs = () => {

    const location = useLocation();
    const arrNav = location.pathname.split('/')

    let content = []

    // // console.log(arrNav.length)

    if (location.pathname === '/') {
        content.push(<Breadcrumb.Section as={Link} active key={'h1'} to="/" content='home' />)
    } else {
        for (let i = 0; i < arrNav.length; i++) {
            if (i <= 1) {
                content.push(<Breadcrumb.Section as={Link} active key={i} to="/" content={i === 0 ? 'home' : arrNav[i]} />)
                content.push(<Breadcrumb.Divider icon='right angle' key={`${i}d`} />)
            }
            else if (i === arrNav.length - 1) {
                content.push(<Breadcrumb.Section active key={i} to="/" content={decodeURIComponent(arrNav[i])} />)
            }
            else if (i === arrNav.length - 2 && arrNav.length > 4) {
                content.push(<Breadcrumb.Section
                    // as={Link}
                    key={`${i}d`}
                    to={`/${arrNav[i - 1]}/${decodeURIComponent(arrNav[i])}`}
                    content={arrNav[i]} />)
                content.push(<Breadcrumb.Divider icon='right angle' key={`${i}dc`} />)
            }
            else if (i === arrNav.length - 2 && arrNav.length <= 4) {
                content.push(<Breadcrumb.Section
                    as={Link}
                    key={`${i}d`}
                    to={`/${arrNav[i - 1]}/${arrNav[i]}`}
                    content={arrNav[i]} />)
                content.push(<Breadcrumb.Divider icon='right angle' key={`${i}dc`} />)
            }
            else if (i === arrNav.length - 3) {
                content.push(<Breadcrumb.Section
                    as={Link}
                    key={`${i}d`}
                    to={`/${arrNav[i - 1]}/${arrNav[i]}`}
                    content={arrNav[i]} />)
                content.push(<Breadcrumb.Divider icon='right angle' key={`${i}dc`} />)
            }
            else {

                content.push(<Breadcrumb.Section as={Link} key={`${i}d`} to="/" content={decodeURIComponent(arrNav[i])} />)
                content.push(<Breadcrumb.Divider icon='right angle' key={`${i}dc`} />)
            }
        }
    }
    return content
}