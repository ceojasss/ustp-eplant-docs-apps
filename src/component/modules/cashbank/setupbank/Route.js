import { Routes, Route } from 'react-router-dom'
import SetupBankEdit from './FormEdit'
import FormCreate from './FormCreate'
import SetupBankList from './List'
import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<SetupBankList />} />
        <Route path="/new" element={<FormCreate />} />
        <Route path="/edit/:id" element={<SetupBankEdit />} />
    </Routes>
}

export default Routing;