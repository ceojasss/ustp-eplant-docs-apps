import { Routes, Route } from 'react-router-dom'
import React from 'react'
import BodDaily from './dailybod/Route'

const Routing = () => {
    /* test - 2x*/

    return <Routes>
        <Route path="/:module/*" exact element={<BodDaily />} />
        {/*     <Route path="/dailybod/*" exact element={<BodDaily />} />
        <Route path="/millcontroller/*" exact element={<BodDaily />} />
        <Route path="/produksitbs/*" exact element={<BodDaily />} />
        <Route path="/stockcpopk/*" exact element={<BodDaily />} />
        <Route path="/recoverycuciost/*" exact element={<BodDaily />} />
        <Route path="/dispatchpks/*" exact element={<BodDaily />} />
        <Route path="/pengolahanpks/*" exact element={<BodDaily />} />
        <Route path="/arusstokcpopk/*" exact element={<BodDaily />} />
        <Route path="/penjualancpopk/*" exact element={<BodDaily />} />
        <Route path="/opsperfmtdffbprodnucleus/*" exact element={<BodDaily />} />
        <Route path="/deliveryorderstatus/*" exact element={<BodDaily />} />
        <Route path="/monitoracakkosong/*" exact element={<BodDaily />} />
        <Route path="/oilcontent/*" exact element={<BodDaily />} />
        <Route path="/monitoringmharvesting/*" exact element={<BodDaily />} />
        <Route path="/rearotasipanen/*" exact element={<BodDaily />} />
        <Route path="/pengirimantbs/*" exact element={<BodDaily />} />
        <Route path="/rekaprotasipanen7hari/*" exact element={<BodDaily />} />
        <Route path="/dataperumahan/*" exact element={<BodDaily />} />
        <Route path="/pemakaianbbm/*" exact element={<BodDaily />} />
        <Route path="/pembeliansolar/*" exact element={<BodDaily />} />
        <Route path="/retasetransporter/*" exact element={<BodDaily />} />
        <Route path="/panenmingguan/*" exact element={<BodDaily />} />
        <Route path="/tingkatkehadiran/*" exact element={<BodDaily />} />
        <Route path="/panenplasmainti/*" exact element={<BodDaily />} />
        <Route path="/mpppanen/*" exact element={<BodDaily />} />
        <Route path="/bodrainy/*" exact element={<BodDaily />} />
        <Route path="/outstandingprpo/*" exact element={<BodDaily />} />
        <Route path="/stockpupukton/*" exact element={<BodDaily />} />
        <Route path="/stockpupukrupiah/*" exact element={<BodDaily />} />
        <Route path="/ctmtt/*" exact element={<BodDaily />} />
        <Route path="/ctmtb/*" exact element={<BodDaily />} />
        <Route path="/keluarmasukkendaraan/*" exact element={<BodDaily />} />
        <Route path="/monitorwsvh/*" exact element={<BodDaily />} />
        <Route path="/progresspemupukan/*" exact element={<BodDaily />} />
        <Route path="/realisasipenanaman/*" exact element={<BodDaily />} />
        <Route path="/summaryoutstandingap/*" exact element={<BodDaily />} />
        <Route path="/analisabiayainfrastruktur/*" exact element={<BodDaily />} />
 */}

    </Routes>
}

export default Routing;
