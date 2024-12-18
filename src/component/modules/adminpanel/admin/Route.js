import { Routes, Route } from 'react-router-dom'
import List from './List'
import FormCreate from './FormCreate'
import FormEdit from './FormEdit'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<List />} />
<Route path="/new" exact element={<FormCreate />} />
<Route path="/edit/:id" exact element={<FormEdit />} />
    </Routes>
}

export default Routing;