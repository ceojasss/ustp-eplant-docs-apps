import { Routes, Route } from 'react-router-dom'
import React from 'react'
import InputPR from './purchaserequest/Route'
import InputPO from './purchaseorder/Route'
import InputRN from './receivenote/Route'
import ForceClosePR from './forceclosepr/Route'
import PenerimaanPRP from './penerimaanprp/Route'
import POTransportExpedition from './potransportexpedition/Route'
import RN from './returnnote/Route'
import IVWPO from './invoicewithoutpo/Route'
import PPRAO from './penerimaanprao/Route'
import InputIV from "./invoice/Route";
import InputFCPO from "./forceclosepo/Route";
import PurchaseOrderTransport from './purchaseordertransport/Route'
import PurchaseOrderCanceled from './purchaseordercanceled/Route'
import ReturnNoteNonGRN from './returnnotenongrn/Route'
import ApprovalForm from './approvalform/Route'
import SetupSI from './stsetupsupplierinformation/Route'
import ParameterMasterPurchasing from './parametermasterpurchasing/Route'
import SetupPurchaseItem from './setuppurchaseitem/Route'
import PurchaseOrderContract from './purchaseordercontract/Route'
import ProformaPurchaseOrder from './proformapurchaseorder/Route'
import EvalSupplier from './evaluasisupplier/Route'
import EvalVendor from './evalvendor/Route'
import SupplierVisitation from './suppliervisitation/Route'


const Routing = () => {
    return <Routes>
        <Route path="/purchaserequest/*" exact element={<InputPR />} />
        <Route path="/purchaseorder/*" exact element={<InputPO />} />
        <Route path="/receivenote/*" exact element={<InputRN />} />
        <Route path="/forceclosepr/*" exact element={<ForceClosePR />} />
        <Route path="/penerimaanprp/*" exact element={<PenerimaanPRP />} />
        <Route path="/potransportexpedition/*" exact element={<POTransportExpedition />} />
        <Route path="/returnnote/*" exact element={<RN />} />
        <Route path="/invoicewpo/*" exact element={<IVWPO />} />
        <Route path="/penerimaanprao/*" exact element={<PPRAO />} />
        <Route path="/invoice/*" exact element={<InputIV />} />
        <Route path="/forceclosepo/*" exact element={<InputFCPO />} />
        <Route path="/purchaseordertransport/*" exact element={<PurchaseOrderTransport />} />
        <Route path="/purchaseordercancel/*" exact element={<PurchaseOrderCanceled />} />
        <Route path="/returnnotenongrn/*" exact element={<ReturnNoteNonGRN />} />
        <Route path="/approvalform/*" exact element={<ApprovalForm />} />
        <Route path="/supplierpurchasing/*" exact element={<SetupSI />} />
        <Route path="/parameterpurchasing/*" exact element={<ParameterMasterPurchasing />} />
        <Route path="/setuppurchaseitem/*" exact element={<SetupPurchaseItem />} />
        <Route path="/pocontract/*" exact element={<PurchaseOrderContract />} />
        <Route path="/proformapurchaseorder/*" exact element={<ProformaPurchaseOrder />} />
        <Route path="/evalsupplier/*" exact element={<EvalSupplier />} />
        <Route path="/evalvendor/*" exact element={<EvalVendor />} />
        <Route path="/suppliervisitation/*" exact element={<SupplierVisitation />} />


    </Routes>
}

export default Routing;