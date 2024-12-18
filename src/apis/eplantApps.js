import axios from 'axios'
import _ from 'lodash'
import jwt_decode from 'jwt-decode'
import { DEFAULTOPTIONS, SITEOPTIONS } from '../component/Constants';

/* export default axios.create({
    baseURL: 'http://localhost:3000/api/'
}
)
 */

const fetchClientApps = () => {

    // console.log(process.env)
    let opts
    let token = localStorage.getItem('token');

    if (token) {
        var decoded = jwt_decode(token);
        if (decoded.exp < new Date() / 1000) {
            localStorage.removeItem('token')
            token = null
        }
    }


    if (_.isNull(token)) {
        opts = DEFAULTOPTIONS
    } else {
        opts = SITEOPTIONS[decoded.site]
    }

    let instance = axios.create(opts)
    // Set the AUTH token for any request
    instance.interceptors.request.use(function (config) {


        config.baseURL = DEFAULTOPTIONS.baseURL

        let tokens = localStorage.getItem('token');

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

export default fetchClientApps();