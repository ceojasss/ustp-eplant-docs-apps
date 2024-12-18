import { Routes, Route } from 'react-router-dom'
// import Charts from './Charts'
import List from './index'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<List/>} />
    </Routes>
}

export default Routing;