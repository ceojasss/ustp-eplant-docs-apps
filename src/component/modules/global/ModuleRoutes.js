import { Routes, Route } from 'react-router-dom'
import React from 'react'
import SetupSI from './stsetupsupplierinformation/Route'
import CurrencyDailyRate from './currencydailyrate/Route'
import CurrencyMaster from './currencymaster/Route'

const Routing = () => {
    /* test - 2x*/
    
    return <Routes>
        <Route path="/currencydailyrate/*" exact element={<CurrencyDailyRate />} />
        <Route path="/supplier/*" exact element={<SetupSI />} />
        <Route path="/currencymaster/*" exact element={<CurrencyMaster />} />
        
    </Routes>
}

export default Routing;