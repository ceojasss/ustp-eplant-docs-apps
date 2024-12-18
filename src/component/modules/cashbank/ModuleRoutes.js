import { Routes, Route } from 'react-router-dom'
import React from 'react'


import SetupBankroutes from './setupbank/Route'
import PV from './paymentvoucher/Route'
// import AdminRoutes from '../adminpanel/admin/Route'
import RV from './receivevoucher/Route'
import PermintaanAnggaran from './permintaananggaran/Route'
import PettyCash from './pettycash/Route'
import ReimbursePettyCash from './reimbursepettycash/Route'
import Approval from './approval/Route'
import SupplierBank from './supplierbank/Route'
import ContractorBank from './contractorbank/Route'


const Routing = () => {
    return <Routes>
        <Route path="/bankinformation/*" exact element={<SetupBankroutes />} />
        <Route path="/paymentvoucher/*" exact element={<PV />} />
        <Route path="/receivevoucher/*" exact element={<RV />} />
        <Route path="/permintaananggaran/*" exact element={<PermintaanAnggaran />} />
        <Route path="/pettycash/*" exact element={<PettyCash />} />
        <Route path="/reimbursepettycash/*" exact element={<ReimbursePettyCash />} />
        <Route path="/approvalpv/*" exact element={<Approval />} />
        <Route path="/supplierbank/*" exact element={<SupplierBank />} />
        <Route path="/contractorbank/*" exact element={<ContractorBank />} />
    </Routes>
}

export default Routing;