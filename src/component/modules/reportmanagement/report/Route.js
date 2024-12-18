import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Forms from './Form'

const Routing = () => <Routes>
    <Route path="/*" exact element={<Forms />} />
</Routes>


export default Routing;