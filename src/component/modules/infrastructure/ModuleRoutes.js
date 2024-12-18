import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Infrastructures from './infrastructures/Route'
import InfrastructureaType from './infratype/Route'
import InfrastructureaSubType from './infrasubtype/Route'
import InfrastructureaStatus from "./infrastructurestatus/Route";
import InfrastructuresProgress from './infrastructuresprogress/Route'

const Routing = () => {
    return <Routes>
        <Route path="/infrastructure/*" exact element={<Infrastructures />} />
        <Route path="/infratype/*" exact element={<InfrastructureaType />} />
        <Route path="/infrasubtype/*" exact element={<InfrastructureaSubType />} />
        <Route path="/infrastructurestatus/*" exact element={<InfrastructureaStatus />} />
        <Route path="/infrastructureprogress/*" exact element={<InfrastructuresProgress />} />
    </Routes>
}

export default Routing;
