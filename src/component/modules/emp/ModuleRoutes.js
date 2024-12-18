import { Routes, Route } from 'react-router-dom'

import SetupGangMaster from './gangmaster/Route'
import GangMasterPeriod from './gangmasterperiod/Route'
import HaValidation from './havalidation/Route'
import SetupPayrollAllowdedType  from './payrollallowdedtype/Route'
import SetupPenaltyPanen  from './penaltypanen/Route'
import AllowanceVariable  from './allowdedvariable/Route'
import AllowanceFix  from './allowdedfix/Route'
import OtherPayrollRate  from './otherpayrollrate/Route'
import OPRate from "./oprate/Route";
import NonHarvestingPremiumRate from "./nonharvpremiumrate/Route";
import WorkingCalendar  from './workingcalendar/Route'
import OtherHarvestingRate  from './otherharvestingrate/Route'
import FringeBenefitType from './fringebenefittype/Route'
import GangMasterPasangan from './gangmasterpasangan/Route'
import EmployeeAdHocAllowanceDeduction from './employeeadhocallowancededuction/Route'
import EmployeeOtherReceivables from './employeeotherreceivables/Route'
import EmployeeReceivables from './employeereceivables/Route'
import GangActivityGeneral from './gangactivitygeneral/Route'
import BkmPanenPasangan from './bkmpanenpasangan/Route'
import GangActivityFactory from './gangactivityfactory/Route'
import GangActivityUpkeep from './gangactivityupkeep/Route'
import ParameterMasterPayroll  from './parametermasterpayroll/Route'
import MasterPerencanaanIntrans  from './masterperencanaanintrans/Route'
import VerifUpkeep  from './verifupkeep/Route'





import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/setupgangmaster/*" exact element={<SetupGangMaster />} />
        <Route path="/gangmasterperiod/*" exact element={<GangMasterPeriod />} />
        <Route path="/havalidation/*" exact element={<HaValidation />} />
        <Route path="/payrollallowdedtype/*" exact element={<SetupPayrollAllowdedType />} />
        <Route path="/penaltypanen/*" exact element={<SetupPenaltyPanen />} />
        <Route path="/allowancevariable/*" exact element={<AllowanceVariable />} />
        <Route path="/allowancefix/*" exact element={<AllowanceFix />} />
        <Route path="/otherpayrollrate/*" exact element={<OtherPayrollRate />} />
        <Route path="/oprate/*" exact element={<OPRate />} />
        <Route path="/nonharvpremiumrate/*" exact element={<NonHarvestingPremiumRate />} />
        <Route path="/workingcalendar/*" exact element={<WorkingCalendar />} />
        <Route path="/otherharvestingrate/*" exact element={<OtherHarvestingRate />} />
        <Route path="/fringebenefittype/*" exact element={<FringeBenefitType />} />
        <Route path="/gangmasterpasangan/*" exact element={<GangMasterPasangan />} />
        <Route path="/employeeadhocallowancededuction/*" exact element={<EmployeeAdHocAllowanceDeduction />} />
        <Route path="/employeeotherreceivables/*" exact element={<EmployeeOtherReceivables />} />
        <Route path="/employeereceivables/*" exact element={<EmployeeReceivables />} />
        <Route path="/gangactivitygeneral/*" exact element={<GangActivityGeneral />} />
        <Route path="/bkmpanenpasangan/*" exact element={<BkmPanenPasangan />} />
        <Route path="/gangactivityfactory/*" exact element={<GangActivityFactory />} />
        <Route path="/gangactivityupkeep/*" exact element={<GangActivityUpkeep />} />
        <Route path="/parameterpayroll/*" exact element={<ParameterMasterPayroll />} />
        <Route path="/MasterPerencanaanIntrans/*" exact element={<MasterPerencanaanIntrans />} />
        <Route path="/verifupkeep/*" exact element={<VerifUpkeep />} />




    </Routes>
}

export default Routing;