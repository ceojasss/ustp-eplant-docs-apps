import { Routes, Route } from 'react-router-dom'
import Edit from './FormEdit'
import Create from './FormCreate'
import List from './List'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<List />} />
        <Route path="/new" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
        {/*         <Route path="/new" element={<FormCreate />} />
        <Route path="/edit" element={<SetupBankEdit />} /> */}

    </Routes>
}

export default Routing;