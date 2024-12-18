import { Routes, Route } from 'react-router-dom'
import React from 'react'
import SetupST from '../nursery/nurserymaster/Route'
import NurseryRequest from '../nursery/nurseryrequest/Route'
import NurseryIssue from './nurseryissue/Route'
import NurseryReturn from '../nursery/nurseryreturn/Route'
import ParameterMaster from '../nursery/parametermasternursery/Route'

const Routing = () => {
    return <Routes>
        <Route path="/nurserymaster/*" exact element={<SetupST />} />
        <Route path="/nurseryrequest/*" exact element={<NurseryRequest />} />
        <Route path="/nurseryissue/*" exact element={<NurseryIssue />} />
        <Route path="/nurseryreturn/*" exact element={<NurseryReturn />} />
        <Route path="/parameternursery/*" exact element={<ParameterMaster />} />
    </Routes>
}

export default Routing;