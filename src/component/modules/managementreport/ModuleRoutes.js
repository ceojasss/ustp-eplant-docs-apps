import { Routes, Route } from 'react-router-dom'
import React from 'react'
import CpoPrice from '../managementreport/cpoprice/Route'


const Routing = () => {
    return <Routes>
        <Route path="/cpoprice/*" exact element={<CpoPrice />} />
    </Routes>
}

export default Routing;