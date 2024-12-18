import { combineReducers, createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import createReducerManager from '../manager';
import { staticReducers } from './auth';

import { composeWithDevTools } from 'redux-devtools-extension';

export const configureStore = () => {
    const reducerManager = createReducerManager(staticReducers);

    // Create a store with the root reducer function being the one exposed by the manager.
    const store = createStore(/* createReducer() */reducerManager.reduce, composeWithDevTools(applyMiddleware(reduxThunk)))


    //    store.dynamicReducers = {};
    // Add a dictionary to keep track of the registered async reducers
    store.asyncReducers = {}

    store.removeReducer = async (key) => {

        // console.log('removing store', key)



        delete store.asyncReducers[key];
        store.replaceReducer(createReducer(store.asyncReducers));
    }

    store.injectReducer = async (key, asyncReducer) => {

        store.asyncReducers[key] = asyncReducer
        store.replaceReducer(createReducer(store.asyncReducers))
    }


    return store;
}

const createReducer = (dynamicReducers = {}) => {

    return combineReducers({
        ...staticReducers,
        ...dynamicReducers
    });
}

const store = configureStore()



export default store
