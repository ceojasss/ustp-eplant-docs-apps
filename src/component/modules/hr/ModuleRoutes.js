import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Family from './family/Route'
import ContactInfo from './contactinfo/Route'
import Reference from './reference/Route'
import WorkingExperience from './workingexperience/Route'
import DiciplinaryNotification from './diciplinarynotification/Route'
import RewardNotification from './rewardnotification/Route'
import CareerHistory from './careerhistory/Route'
import Education from './education/Route'
import Language from './language/Route'
import Training from './training/Route'
import Skills from './skills/Route'
import Termination from './termination/Route'
import MedicalExternal from './medicalexternal/Route'
import MedicalInternal from './medicalinternal/Route'
import TaxStatus from './taxstatus/Route'
import GradeStatus from './gradestatus/Route'
import TrainingSchedule from './trainingschedule/Route'
import BAAbsensi from './baabsensi/Route'
import Biodata from './biodata/Route'
import AtkIssued from './atkissued/Route'
import ParameterMasterHr from './parametermasterhr/Route'
import MedicalHO from './medicalho/Route'
import SetupCuti from './setupcuti/Route'
import RealisasiSpd from './realisasispd/Route'
import Mom from './mom/Route'
import BarangAssets from './barangassets/Route'

const Routing = () => {
    return <Routes>
        <Route path="/family/*" exact element={<Family />} />
        <Route path="/contactinfo/*" exact element={<ContactInfo />} />
        <Route path="/reference/*" exact element={<Reference />} />
        <Route path="/workingexperience/*" exact element={<WorkingExperience />} />
        <Route path="/diciplinarynotification/*" exact element={<DiciplinaryNotification />} />
        <Route path="/rewardnotification/*" exact element={<RewardNotification />} />
        <Route path="/careerhistory/*" exact element={<CareerHistory />} />
        <Route path="/education/*" exact element={<Education />} />
        <Route path="/language/*" exact element={<Language />} />
        <Route path="/training/*" exact element={<Training />} />
        <Route path="/skills/*" exact element={<Skills />} />
        <Route path="/termination/*" exact element={<Termination />} />
        <Route path="/medicalexternal/*" exact element={<MedicalExternal />} />
        <Route path="/medicalinternal/*" exact element={<MedicalInternal />} />
        <Route path="/taxstatus/*" exact element={<TaxStatus />} />
        <Route path="/gradestatus/*" exact element={<GradeStatus />} />
        <Route path="/trainingschedule/*" exact element={<TrainingSchedule />} />
        <Route path="/baabsensi/*" exact element={<BAAbsensi />} />
        <Route path="/biodata/*" exact element={<Biodata />} />
        <Route path="/atkissued/*" exact element={<AtkIssued />} />
        <Route path="/parameterhr/*" exact element={<ParameterMasterHr />} />
        <Route path="/medicalho/*" exact element={<MedicalHO />} />
        <Route path="/setupcuti/*" exact element={<SetupCuti />} />
        <Route path="/realisasispd/*" exact element={<RealisasiSpd />} />
        <Route path="/mom/*" exact element={<Mom />} />
        <Route path="/barangassets/*" exact element={<BarangAssets />} />
    </Routes>
}

export default Routing;