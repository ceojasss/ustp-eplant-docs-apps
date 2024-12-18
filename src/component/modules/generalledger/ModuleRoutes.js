import { Routes, Route } from 'react-router-dom'
import React from 'react'
import DataLegalLimbahCair from './datalimbahcair/Route'
import DataLegalLimbahPadat from './datalimbahpadat/Route'
import DataLegalPemakaianAir from './datapemakaianair/Route'

import TaxEfaktur from './efaktur/Route'
import Closing from './closing/Route'

import CommodityPrice from './commodityprice/Route'

const Routing = () => {
    /* test - 2x*/

    return <Routes>
        <Route path="/limbahcair/*" exact element={<DataLegalLimbahCair />} />
        <Route path="/limbahpadat/*" exact element={<DataLegalLimbahPadat />} />
        <Route path="/pemakaianair/*" exact element={<DataLegalPemakaianAir />} />
        <Route path="/efaktur/*" exact element={<TaxEfaktur />} />
        <Route path="/closing/*" exact element={<Closing />} />
        <Route path="/commodityprice/*" exact element={<CommodityPrice />} />
    </Routes>
}

export default Routing;