import axios from 'axios'

import jwt_decode from 'jwt-decode'
import { DEFAULTOPTIONS, DOWNLOADOPTS } from '../component/Constants';

/* export default axios.create({
    baseURL: 'http://localhost:3000/api/'
}
)
 */

const fetchClient = () => {

    // console.log(process.env)

    let instance = axios.create(DOWNLOADOPTS)

    // Create instance
    /*  let instance = axios.create(
         {
             baseURL: `http://${process.env.REACT_APP_URLS}:3000/api/`,
             transformRequest: [(data) => {
                 console.log(data)
                 return data;
             }]
         }
     ); */

    let token = localStorage.getItem('token');




    //console.log('fetch client')

    //console.log(defaultOptions.baseURL)

    if (token) {
        var decoded = jwt_decode(token);
        if (decoded.exp < new Date() / 1000) {
            localStorage.removeItem('token')
            token = null
        }
    }

    // Set the AUTH token for any request
    instance.interceptors.request.use(function (config) {


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

export default fetchClient();
