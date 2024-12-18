import { Routes, Route } from 'react-router-dom'
import ListData from './view'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<ListData />} />
    </Routes>
}

export default Routing;