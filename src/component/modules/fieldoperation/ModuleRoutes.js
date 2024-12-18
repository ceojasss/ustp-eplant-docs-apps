import { Routes, Route } from 'react-router-dom'

import SetupST from './setupblockmaster/Route'
import SetupSI from './setupfieldcrop/Route'
import Supplying from './supplying/Route'
import SupplyingCompletion from './supplyingcompletion/Route'
import DailyPlanting from './dailyplanting/Route'
import PlantingCompletion from './plantingcompletion/Route'
import Rainfall from './rainfall/Route'
import HarvestingTransport from './harvestingtransport/Route'
import RestanAdjustment from './restanadjustment/Route'
import AlokasiPersentaseBBC from './alokasipersentasebbc/Route'
import LandAcquisition from './landacquisition/Route'
import ClassBlockNew from './classblocknew/Route'
import LossesPanen from './lossespanen/Route'
import OilpalmTreeCensusNew from './oilpalmtreecensusnew/Route'
import ProgressLC from './progresslc/Route'
import ParameterMaster from './parametermasterfop/Route'
import TphMaster from './setuptphmaster/Route'
import BlockMasterOrganization from './setupblockmasterorganization/Route'
import BlockMasterUsage from'./setupblokmasterusage/Route'
import JalurEmdek from'./jaluremdek/Route'
import AnalisaBuah from'./analisabuah/Route'

import React from 'react'

const Routing = () => {
    return <Routes>
        <Route path="/blockmaster/*" exact element={<SetupST />} />
        <Route path="/fieldcrop/*" exact element={<SetupSI />} />
        <Route path="/supplying/*" exact element={<Supplying />} />
        <Route path="/supplyingcompletion/*" exact element={<SupplyingCompletion />} />
        <Route path="/dailyplanting/*" exact element={<DailyPlanting />} />
        <Route path="/plantingcompletion/*" exact element={<PlantingCompletion />} />
        <Route path="/rainfall/*" exact element={<Rainfall />} />
        <Route path="/harvestingtransport/*" exact element={<HarvestingTransport />} />
        <Route path="/restanadjustment/*" exact element={<RestanAdjustment />} />
        <Route path="/bbcpercentage/*" exact element={<AlokasiPersentaseBBC />} />
        <Route path="/landacquisition/*" exact element={<LandAcquisition />} />
        <Route path="/classblocknew/*" exact element={<ClassBlockNew />} />
        <Route path="/lossespanen/*" exact element={<LossesPanen />} />
        <Route path="/oilpalmtreecensusnew/*" exact element={<OilpalmTreeCensusNew />} />
        <Route path="/progresslc/*" exact element={<ProgressLC />} />
        <Route path="/parameterfop/*" exact element={<ParameterMaster />} />
        <Route path="/tphmaster/*" exact element={<TphMaster/>}/>
        <Route path="/blockorganization/*" exact element={<BlockMasterOrganization/>}/>
        <Route path="/blockusage/*" exact element={<BlockMasterUsage/>}/>
        <Route path="/jaluremdek/*" exact element={<JalurEmdek/>}/>
        <Route path="/analisabuah/*" exact element={<AnalisaBuah/>}/>
    </Routes>
}

export default Routing;