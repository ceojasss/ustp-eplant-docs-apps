import { Routes, Route } from 'react-router-dom'
import RouteAdmin from './export/Route'

import React from 'react'

const Routing = () => <Routes> <Route path=":route/*" exact element={<RouteAdmin />} />  </Routes>


export default Routing;