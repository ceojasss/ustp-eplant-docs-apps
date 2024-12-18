import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Appresources } from './templates/ApplicationResources'
import Routing from './templates/Routing'
import LoadingModules from './templates/LoadingModules'
import Template from './templates/Template'
import Vessel from './templates/Vessel'
import PDF from './templates/VesselPDF'

const SwitchCompany = lazy(() => import('./auth/SwitchCompany'))
const Home = lazy(() => import('./Home'))
const Dashboard = lazy(() => import('./Dashboard'))
const Signin = lazy(() => import('./auth/Signin'))
const AuthIn = lazy(() => import('./auth/AuthIn'))
const NotFound = lazy(() => import('./templates/NotFound'))
const Signout = lazy(() => import('./auth/Signout'))
const Header = lazy(() => import('./templates/ContainerHeader'))
const CashBankRoutes = lazy(() => import('./modules/cashbank/ModuleRoutes'))
const InventoryRoutes = lazy(() => import('./modules/inventory/ModuleRoutes'))
const VehicleRoutes = lazy(() => import('./modules/vehicle/ModuleRoutes'))
const NurseryRoutes = lazy(() => import('./modules/nursery/ModuleRoutes'))
const MachineRoutes = lazy(() => import('./modules/machine/ModuleRoutes'))


const PurchasingRoutes = lazy(() => import('./modules/purchasing/ModuleRoutes'))
const FixedassetRoutes = lazy(() => import('./modules/fixedasset/ModuleRoutes'))
const ContractRoutes = lazy(() => import('./modules/contract/ModuleRoutes'))
const PalmOilMillRoutes = lazy(() => import('./modules/palmoilmill/ModuleRoutes'))
const SalesRoutes = lazy(() => import('./modules/sales/ModuleRoutes'))
const FieldOpertaionRoutes = lazy(() => import('./modules/fieldoperation/ModuleRoutes'))
const JournalVoucherRoutes = lazy(() => import('./modules/journalvoucher/ModuleRoutes'))
const GlobalRoutes = lazy(() => import('./modules/global/ModuleRoutes'))
const WorkshopRoutes = lazy(() => import('./modules/workshop/ModuleRoutes'))
const InfrastructureRoutes = lazy(() => import('./modules/infrastructure/ModuleRoutes'))
const AdminRoutes = lazy(() => import('./modules/adminpanel/ModuleRoutes'))
const ReportRoutes = lazy(() => import('./modules/reportpanel/ModuleRoutes'))
const ReportManagementRoutes = lazy(() => import('./modules/reportmanagement/ModuleRoutes'))

const ExportRoutes = lazy(() => import('./modules/exportpanel/ModuleRoutes'))
const UtilRoutes = lazy(() => import('./modules/util/ModuleRoutes'))

const EmpRoutes = lazy(() => import('./modules/emp/ModuleRoutes'))
const HrRoutes = lazy(() => import('./modules/hr/ModuleRoutes'))
const BIRoutes = lazy(() => import('./modules/businessintelligence/ModuleRoutes'))
const GLRoutes = lazy(() => import('./modules/generalledger/ModuleRoutes'))

const ToolsRoutes = lazy(() => import('./modules/tools/ModuleRoutes'))

const ManagementReportRoutes = lazy(() => import('./modules/managementreport/ModuleRoutes'))
const Ess = lazy(() => import('./modules/ess/ModuleRoutes'))
const EmployeeSelfServices = lazy(() => import('./modules/ess/ModuleRoutes'))

//const Edash = lazy(() => import('./modules/executiveDashboard/ModuleRoutes'))
//const ExecSummary = lazy(() => import('./modules/executiveSummary/ModuleRoutes'))

const Executives = lazy(() => import('./modules/executive/ModuleRoutes'))

const ErrorFallback = ({ error, resetErrorBoundary }) => {

    console.log('error fallback', error)

    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}


const App = () => {

    //  // console.log('process', process.env)

    const ApplicationRoutes = () => {
        /*
        fixedasset	,purchasing	,ap	,vehicle	,costbook	,contract,
        hr	,workshop	,gc	,cash	,sales	,cp,
        project,	field,	machine,	employee,	ar,	global,
        rbf	,station	,plasma	,stores	,jv	,budget,
        daop,	infrastructure,	util,	nursery,	rm,	pom
        
        */

        //// console.log('run')

        return (
            <Routes message="" >
                <Route exact path="/" element={<Header />} >
                    <Route index element={<Dashboard />} />
                    <Route path="/home/*" element={<Home />} />
                    {/* register modules routes */}
                    <Route path="/cash/*" element={<CashBankRoutes />} />
                    <Route path="/stores/*" element={<InventoryRoutes />} />
                    <Route path="/fixedasset/*" element={<FixedassetRoutes />} />
                    <Route path="/jv/*" element={<JournalVoucherRoutes />} />
                    <Route path="/vehicle/*" element={<VehicleRoutes />} />
                    <Route path="/machine/*" element={<MachineRoutes />} />
                    <Route path="/purchasing/*" element={<PurchasingRoutes />} />
                    {/* <Route path="/sales/*" exact element={<SalesorderRoutes />} /> */}
                    <Route path="/machine/*" element={<MachineRoutes />} />
                    <Route path="/nursery/*" element={<NurseryRoutes />} />
                    <Route path="/contract/*" element={<ContractRoutes />} />
                    {/* <Route path="/customer/*" exact element={<CustomerRoutes />} /> */}
                    <Route path="/util/*" element={<UtilRoutes />} />
                    <Route path="/sales/*" element={<SalesRoutes />} />
                    <Route path="/pom/*" element={<PalmOilMillRoutes />} />
                    <Route path="/fop/*" element={<FieldOpertaionRoutes />} />
                    <Route path="/global/*" element={<GlobalRoutes />} />
                    <Route path="/workshop/*" element={<WorkshopRoutes />} />
                    <Route path="/inf/*" element={<InfrastructureRoutes />} />
                    <Route path="/emp/*" element={<EmpRoutes />} />
                    <Route path="/hr/*" element={<HrRoutes />} />
                    <Route path="/admin/*" element={<AdminRoutes />} />
                    <Route path="/report/*" element={<ReportRoutes />} />
                    <Route path="/managementreport/*" element={<ReportManagementRoutes />} />
                    <Route path="/export/*" element={<ExportRoutes />} />
                    <Route path="/bi/*" element={<BIRoutes />} />
                    <Route path="/costbook/*" element={<GLRoutes />} />
                    <Route path="/tools/*" element={<ToolsRoutes />} />
                    <Route path="/rm/*" element={<ManagementReportRoutes />} />
                    {/* <Route path="/edash/*" element={<Edash />} /> */}
                    <Route path="/ess/*" element={<Ess />} />
                    
                    {/*                     <Route path="/edash/*" element={<Edash />} />
                    <Route path="/executive/*" element={<ExecSummary />} /> */}
                    <Route path="/edash/*" element={<Executives />} />
                    <Route path="/executive/*" element={<Executives />} />
                    <Route path="/ess/*" element={<EmployeeSelfServices />} />
                    <Route path="*" element={<NotFound />} />

                </Route>
                <Route path="/signin" exact element={<Signin />} />
                <Route path="/authin" exact element={<AuthIn />} />
                <Route path="/signout" exact element={<Signout />} />
                <Route path="/switchcompany" exact element={<SwitchCompany />} />
                <Route path="/view" exact element={<Template />} />
                {/*                 <Route path="/preview" exact element={<Preview />} /> */}
                <Route path="/preview" exact element={<Vessel />} />
                <Route path="/pdf/*" exact element={<PDF />} />
            </Routes>
        )
    }


    return (
        <Router>
            <Routing Appresources={Appresources} >

                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => {
                        // reset the state of your app so the error doesn't happen again
                    }}
                >
                    <Suspense fallback={<LoadingModules />}>
                        <ApplicationRoutes />
                    </Suspense>
                </ErrorBoundary>

            </Routing>
        </Router>
    )
}


export default App