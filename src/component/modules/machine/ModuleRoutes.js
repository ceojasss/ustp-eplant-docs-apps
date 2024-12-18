import { Routes, Route } from 'react-router-dom'
import React from 'react'
import SetupMI from './machineinformation/Route'
import MachineActivity from './machineactivity/Route'
import ParameterMasterMachine from './parametermastermachine/Route'

const Routing = () => {
    return <Routes>
        <Route path="/machineinformation/*" exact element={<SetupMI />} />
        <Route path="/machineactivity/*" exact element={<MachineActivity />} />
        <Route path="/parametermachine/*" exact element={<ParameterMasterMachine />} />
    </Routes>
}

export default Routing;