import React from 'react'
import { Routes, Route } from 'react-router-dom'

import RouteAdmin from './report/Route'

const Routing = () => <Routes>

    <Route path=":route/*" exact element={<RouteAdmin />} />

</Routes>


export default Routing;