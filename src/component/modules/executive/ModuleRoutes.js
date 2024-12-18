import { Routes, Route, useLocation } from 'react-router-dom'

import _ from 'lodash'

import React from 'react'
import Summary from './summary/Route'
import Dashboard from './dashboard/Route'

const Routing = () => {
    /* test - 2x*/

    const location = useLocation();
    const mainPath = _.split(location.pathname, '/')[1]

    return <Routes>
        <Route path="/:module/*" exact element={mainPath === 'edash' ? <Dashboard /> : <Summary />} />
    </Routes>
}

export default Routing;