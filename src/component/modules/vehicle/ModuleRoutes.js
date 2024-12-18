import { Routes, Route } from 'react-router-dom'
import React from 'react'
import SetupVH from './vhvehiclemaster/Route'
import SetupVHDOC from './vhvehicledocument/Route'
import Vehicleactivity from './vehicleactivity/Route'
import Verifintrans from './verifintrans/Route'
import Vehiclegroup from './vehiclegroup/Route'
import Vehicleavailability from './vehicleavailability/Route'
import ParameterMasterVehicle from './parametermastervehicle/Route'

const Routing = () => {
    return <Routes>
        {/* <Route path="/stsetupstockgroup/*" exact element={<SetupST />} /> */}
        <Route path="/vehiclemaster/*" exact element={<SetupVH />} />
        <Route path="/vehicledocument/*" exact element={<SetupVHDOC />} />
        <Route path="/vehicleactivity/*" exact element={<Vehicleactivity />} />
        <Route path="/verifintrans/*" exact element={<Verifintrans />} />
        <Route path="/vehiclegroup/*" exact element={<Vehiclegroup />} />
        <Route path="/vehicleavailabilitynew/*" exact element={<Vehicleavailability />} />
        <Route path="/parametervehicle/*" exact element={<ParameterMasterVehicle />} />
    </Routes>
}

export default Routing;