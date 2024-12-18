import { Routes, Route } from 'react-router-dom'
import Dailydashboard from './index.js'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<Dailydashboard />} />
    </Routes>
}

export default Routing;