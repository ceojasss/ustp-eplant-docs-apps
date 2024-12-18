import { Routes, Route } from 'react-router-dom'
import React from 'react'
import SetupBJ from './bjbatchjournal/Route'
import InputJV from './journalvoucher/Route'
import InputDN from './debitnote/Route'


const Routing = () => {
    return <Routes>
        {/* <Route path="/stsetupstockgroup/*" exact element={<SetupST />} /> */}
        <Route path="/batchjournal/*" exact element={<SetupBJ />} />
        <Route path="/journalvoucher/*" exact element={<InputJV />} />
        <Route path="/debitnote/*" exact element={<InputDN />} />
    </Routes>
}

export default Routing;