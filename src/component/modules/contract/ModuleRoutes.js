import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Contractor from './setupcontractor/Route'
import ContractInvoiceTuslah from './contractinvoicetuslah/Route'
import PerintahKerjaTuslah from './perintahkerjatuslah/Route'
import ContractRequest from './contractrequest/Route'
import PerintahKerja from './perintahkerja/Route'
import InvoiceContract from './invoicecontract/Route'
import WorkInProgress from './workinprogress/Route'
import ContractProgress from './contractprogress/Route'
import ContractProgressTuslah from './contractprogresstuslah/Route'
import ParameterMasterContract from './parametermastercontract/Route'
import ContractRequestHO from './contractrequestho/Route'
import ProformaContract from './proformacontract/Route'


const Routing = () => {
    return <Routes>
        <Route path="/contractor/*" exact element={<Contractor />} />
        <Route path="/contractinvoicetuslah/*" exact element={<ContractInvoiceTuslah />} />
        <Route path="/contractrequest/*" exact element={<ContractRequest />} />
        <Route path="/perintahkerja/*" exact element={<PerintahKerja />} />
        <Route path="/invoicecontract/*" exact element={<InvoiceContract />} />
        <Route path="/perintahkerjatuslah/*" exact element={<PerintahKerjaTuslah />} />
        <Route path="/workinprogress/*" exact element={<WorkInProgress />} />
        <Route path="/contractprogress/*" exact element={<ContractProgress />} />
        <Route path="/contractprogresstuslah/*" exact element={<ContractProgressTuslah />} />
        <Route path="/parametercontract/*" exact element={<ParameterMasterContract />} />
        <Route path="/contractrequestho/*" exact element={<ContractRequestHO/>} />
        <Route path="/proformacontract/*" exact element={<ProformaContract/>} />

    </Routes>
}

export default Routing;