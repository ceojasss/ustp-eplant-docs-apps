import { Routes, Route } from 'react-router-dom'
import DailyRoute from './dailydashboard/Route'
import AgroRoute from './agronomi/Route'
import MillRoute from './mill/Route'

import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/dailydashboard/*" exact element={<DailyRoute />} />
        <Route path="/agronomi/*" exact element={<AgroRoute />} />
        <Route path="/mill/*" exact element={<MillRoute />} />
    </Routes>
}

export default Routing;