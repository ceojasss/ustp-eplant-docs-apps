import axios from 'axios'
import _ from 'lodash'

import jwt_decode from 'jwt-decode'
import { DEFAULTOPTIONS, SITEOPTIONS } from '../component/Constants';
import { intlFormatDistanceWithOptions } from 'date-fns/fp';

/* export default axios.create({
    baseURL: 'http://localhost:3000/api/'
}
)
 */

const fetchClientSite = () => {

    let token = localStorage.getItem('token');
    let decoded

    let opts



    if (token) {
        decoded = jwt_decode(token);
        if (decoded.exp < new Date() / 1000) {
            localStorage.removeItem('token')
            token = null
        }
    }



    opts = DEFAULTOPTIONS


    const instance = axios.create(opts)


    //    console.log(decoded, DEFAULTOPTIONS)

    // Set the AUTH token for any request

    //  instance.baseURL = `http://${process.env.REACT_APP_URLS}:3100/api/`


    instance.interceptors.request.use(function (config) {

        //   console.log(config, SITEOPTIONS[decoded.site].baseURL)


        // console.log(token, localStorage.getItem('token'))


        let tokens = localStorage.getItem('token');

        if (tokens) {
            decoded = jwt_decode(tokens);
            if (decoded.exp < new Date() / 1000) {
                localStorage.removeItem('token')
                tokens = null
            }
        }


        if (!_.isNull(tokens)) {
            config.baseURL = `${SITEOPTIONS[decoded.site].baseURL}`
        }

        //console.log(token, tokens)
        if (!token && !tokens) {
            //        console.log('here')
            config.headers.Authorization = token ? `${token}` : '';
        }
        else {
            //      console.log('heres')
            config.headers.Authorization = tokens;
        }


        return config;


    });



    return instance;
};

export default fetchClientSite();