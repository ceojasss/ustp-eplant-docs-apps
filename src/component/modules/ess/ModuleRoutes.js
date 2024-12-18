import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Spkl from './spkl/Route'
import PengajuanAtk from './pengajuanatk/Route'
import SuratPerjalananDinas from './suratperjalanandinas/Route'
import DayOff from './dayoff/Route'

const Routing = () => {
    return <Routes>
        <Route path="/spkl/*" exact element={<Spkl />} />
        <Route path="/pengajuanatk/*" exact element={<PengajuanAtk />} />
        <Route path="/suratperjalanandinas/*" exact element={<SuratPerjalananDinas />} />
        <Route path="/dayoff/*" exact element={<DayOff />} />
    </Routes>
}

export default Routing;