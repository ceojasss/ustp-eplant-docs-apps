import { Routes, Route } from 'react-router-dom'
import FormEdit from './FormEdit'
import FormCreate from './FormCreate'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<FormEdit />} />
        <Route path="/new" element={<FormCreate />} />
        <Route path="/edit/:id" element={<FormEdit />} />
    </Routes>
}

export default Routing;