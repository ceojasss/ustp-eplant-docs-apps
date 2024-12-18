import { Routes, Route } from 'react-router-dom'
import RouteAdmin from './admin/Route'
// import List from './List'
// import Create from './FormCreate'
// import Edit from './FormEdit'

import React from 'react'

const Routing = () => {
    return <Routes>
<Route path=":route/*" exact element={<RouteAdmin />} />
{/* <Route path="/admin/:route" exact element={<List />} />
<Route path="/admin/:route/new" exact element={<Create />} />
<Route path="/admin/:route/edit/:id" exact element={<Edit />} /> */}

    </Routes>
}

export default Routing;