import { Routes, Route } from 'react-router-dom'

import SetupSI from './setupcustomer/Route'
import ParameterMaster from './parametermastersales/Route'

import React from 'react'

const Routing = () => {
    return <Routes>
        {<Route path="/customer/*" exact element={<SetupSI />} />}
        {<Route path="/parametersales/*" exact element={<ParameterMaster />} />}
    </Routes>
}

export default Routing;