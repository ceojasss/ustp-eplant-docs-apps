import { Routes, Route } from 'react-router-dom'

import SetupST from './setupstation/Route'
import ParameterMaster from './parametermasterpom/Route'
import ProductStorage from './productstorage/Route'
import FFBGrading from './ffbgrading/Route'

import React from 'react'
import NotFound from '../../templates/NotFound'

const Routing = () => {
    return <Routes>
        <Route path="/" exact element={<NotFound />} />
        <Route path="/station/*" exact element={<SetupST />} />
        <Route path="/parameterpom/*" exact element={<ParameterMaster />} />
        <Route path="/productstorage/*" exact element={<ProductStorage />} />
        <Route path="/ffbgrading/*" exact element={<FFBGrading />} />
    </Routes>
}

export default Routing;