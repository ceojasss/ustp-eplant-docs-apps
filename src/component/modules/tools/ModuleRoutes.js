import { Routes, Route } from 'react-router-dom'
import React from 'react'
import DbMonitor from './databaseMonitoring/Route'

const Routing = () => {
    return <Routes>
        {/* <Route path="/stsetupstockgroup/*" exact element={<SetupST />} /> */}
        <Route path="/databasemonitor/*" exact element={<DbMonitor />} />
    </Routes>
}

export default Routing;