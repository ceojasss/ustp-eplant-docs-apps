import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Approval from './approval/Route'
import LhmApproval from './lhmapproval/Route'
import Mom from './mom/Route'

const Routing = () => {
    /* test - 2x*/

    return <Routes>
        <Route path="/approval/*" exact element={<Approval />} />
        <Route path="/lhmapproval/*" exact element={<LhmApproval />} />
        <Route path="/mom/*" exact element={<Mom />} />

    </Routes>
}

export default Routing;