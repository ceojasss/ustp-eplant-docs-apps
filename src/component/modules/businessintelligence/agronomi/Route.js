import { Routes, Route } from 'react-router-dom'
import Index from './'
// import Agro from './Agro'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<Index />} />
    </Routes>
}

export default Routing;
