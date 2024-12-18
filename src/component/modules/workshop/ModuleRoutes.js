import { Routes, Route } from 'react-router-dom'
import React from 'react'
import SetupWI from './workshopinformation/Route'
import WorkshopActivity from './workshopactivity/Route'
import WorkshopOrder from './workshoporder/Route'
import WorkOrderCompletion from './workordercompletion/Route'
import WorkshopOrderActivity from './workorderactivity/Route'

const Routing = () => {
    return <Routes>
        {/* <Route path="/stsetupstockgroup/*" exact element={<SetupST />} /> */}
        <Route path="/stworkshop/*" exact element={<SetupWI />} />
        <Route path="/workshopactivity/*" exact element={<WorkshopActivity />} />
        <Route path="/workshoporder/*" exact element={<WorkshopOrder />} />
        <Route path="/wocompletion/*" exact element={<WorkOrderCompletion />} />
        <Route path="/workorderactivity/*" exact element={<WorkshopOrderActivity />} />
    </Routes>
}

export default Routing;