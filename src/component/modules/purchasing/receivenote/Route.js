import { Routes, Route } from 'react-router-dom'

import FormCreate from './FormCreate'
import ListData from './List'
import React from 'react'
import FormEdit from './FormEdit'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<ListData />} />
        <Route path="/new" element={<FormCreate />} />
        <Route path="/edit/:id" element={<FormEdit/>} />
    </Routes>
}

export default Routing;