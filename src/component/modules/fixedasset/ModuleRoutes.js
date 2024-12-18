import { Routes, Route } from 'react-router-dom'
import React from 'react'
import SetupFATAX from './fataxgroup/Route'
import SetupFA from './fagroup/Route'
import SetupFAMaster from './famaster/Route'
import FAClearingAddition from './faclearingaddition/Route'
import FAMaturityStatement from './famaturitystatement/Route'
import FaRepair from './farepair/Route'
import FaDisposal from './fadisposal/Route'
import CIPAddition from './cipaddition/Route'
import ParameterMaster from './parametermasterfa/Route'

const Routing = () => {
    return <Routes>
        {/* <Route path="/stsetupstockgroup/*" exact element={<SetupST />} /> */}
        <Route path="/fataxgroup/*" exact element={<SetupFATAX/>} />
        <Route path="/fagroup/*" exact element={<SetupFA/>} />
        <Route path="/famaster/*" exact element={<SetupFAMaster/>} />
        <Route path="/faclearingaddition/*" exact element={<FAClearingAddition/>} />
        <Route path="/maturitystatement/*" exact element={<FAMaturityStatement/>} />
        <Route path="/farepair/*" exact element={<FaRepair/>} />
        <Route path="/fadisposal/*" exact element={<FaDisposal/>} />
        <Route path="/cipaddition/*" exact element={<CIPAddition/>} />
        <Route path="/parameterfixedasset/*" exact element={<ParameterMaster/>} />

    </Routes>
}

export default Routing; 