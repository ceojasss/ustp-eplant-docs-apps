import { Routes, Route } from 'react-router-dom'

import SetupST from './stsetupstockgroup/Route'
import SetupSI from './setupstoreinformation/Route'
import InputMR from './materialrequest/Route'
import InputTV from './transfervoucher/Route'
import InputTRV from './transferreceivevoucher/Route'
import InputRTS from './returntostore/Route'
import InputWOV from './writeoffvoucher/Route'
import InputSA from './storeadjusment/Route'
import InputWIPS from './wipstockledger/Route'
import InputFGS from './finishgoodstockledger/Route'
import InputSIV from './storeissuevoucher/Route'
import ParameterMasterStores from "./parametermasterstores/Route"
import StockItem from "./stockitem/Route"
import UpdateSiv from "./updatesiv/Route"

import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/stsetupstockgroup/*" exact element={<SetupST />} />
        <Route path="/storeinformation/*" exact element={<SetupSI />} />
        <Route path="/materialrequest/*" exact element={<InputMR />} />
        <Route path="/returntostore/*" exact element={<InputRTS />} />
        <Route path="/writeoffvoucher/*" exact element={<InputWOV />} />
        <Route path="/storeadjusment/*" exact element={<InputSA />} />
        <Route path="/wipstockledger/*" exact element={<InputWIPS />} />
        <Route path="/finishgoodstockledger/*" exact element={<InputFGS />} />
        <Route path="/transfervoucher/*" exact element={<InputTV />} />
        <Route path="/transferreceivevoucher/*" exact element={<InputTRV />} />
        <Route path="/siv/*" exact element={<InputSIV />} />
        <Route path="/parameterstores/*" exact element={<ParameterMasterStores />} />
        <Route path="/stockitem/*" exact element={<StockItem />} />
        <Route path="/updatesiv/*" exact element={<UpdateSiv />} />
    </Routes>
}

export default Routing;