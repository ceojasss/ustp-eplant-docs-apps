import React, { useEffect, useRef } from 'react';
import _ from 'lodash'


import 'jspdf-autotable';
import { fetchreportdata } from '../../redux/actions';
import { connect, useDispatch } from 'react-redux';
import { paymentvoucher } from './pdf_container/paymentvoucher';
import { purchaserequest } from './pdf_container/purchaserequest';
import { siv } from './pdf_container/siv';
import { sivsolar } from './pdf_container/sivsolar';
import { sivlx } from './pdf_container/sivlx';
import { evaluasiperformavendor } from './pdf_container/evaluasiperformavendor';
import { registrasivendor } from './pdf_container/registrasivendor';
import { useLocation } from 'react-router-dom';
import { parseJWT } from '../../utils/FormComponentsHelpler';
import { receivevoucher } from './pdf_container/receivevoucher';
import { Dimmer, Divider, Header, Icon, Loader, Segment, SegmentGroup } from 'semantic-ui-react';


const PreviewPdf = ({ datareport, auth }) => {


    const location = useLocation();
    // console.log(location);

    
    const qp = new URLSearchParams(location.search);

    const pdfPreviewRef = useRef(null);

    //const tkn = jwt_decode(store.getState().auth.authenticated)
    const dispatch = useDispatch()

    const handleKeyDown = (event) => {
        // Check if Ctrl key is pressed and 'P' key is pressed
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault(); // Prevent default browser behavior (e.g., printing)
            // Your custom logic for handling Ctrl+P event
            console.log('Ctrl+P pressed!');
        }
    };


    useEffect(() => {
        const handleKeyPress = (event) => {
            handleKeyDown(event);
        };

        document.addEventListener('keydown', handleKeyPress);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array ensures the effect runs only once after component mounts


    useEffect(() => {


        const queryParams = new URLSearchParams(location.search);

        const routes = location.pathname.replace('/pdf/', '')

        // console.log(routes);


        const jparam = {
            "route": routes,
            //  "index": "0",
            "parameters": location.search,
            "url": "executivesummary/generatedata",
        }

        console.log(jparam);

        if (auth.authenticated)
            dispatch(fetchreportdata(jparam))

    }, [location, auth.authenticated])

    
   




    useEffect(() => {

        const usrtkn = parseJWT(auth.authenticated)

         

        if (!_.isEmpty(datareport)) {

            // ** check report type by route and generate accordingly
            switch (datareport.route) {
                case 'viewpv':
                    paymentvoucher(usrtkn, datareport, pdfPreviewRef)
                    break;
                case 'viewrv':
                    receivevoucher(usrtkn, datareport, pdfPreviewRef)
                    break;
                case 'viewpr':
                case 'viewprtest':
                    purchaserequest(usrtkn, datareport, pdfPreviewRef)
                    break;
                case 'viewevalvendor':
                    evaluasiperformavendor(usrtkn, datareport, pdfPreviewRef)
                    break;
                case 'viewregvendor':
                    registrasivendor(usrtkn, datareport, pdfPreviewRef)
                    break;
                case 'viewsiv':
                    siv(usrtkn, datareport, pdfPreviewRef)
                    break;
                case 'viewsivsolar':
                    sivsolar(usrtkn, datareport, pdfPreviewRef)
                    break;
                case 'viewsivlx':
                    sivlx(auth.authenticated, datareport, pdfPreviewRef)
                    break;
                default:
                    // todo
                    break;
            }
        }

    }, [datareport])


    if (_.isEmpty(auth.authenticated)) {
        return <p>Not Logged In.</p>
    }


    if (_.isEmpty(datareport)) {
        return <div style={{ textAlign: 'center', marginTop: '45vh' }}>
            <Header as='h3' >
                <Icon.Group size='large'>
                    <Icon loading size='big' name='circle notched' />
                    <Icon name='file pdf outline' />
                </Icon.Group>
                Preparing Report...
            </Header>
        </div>
    } else {

        return <div style={{ height: '98vh' }}>
            <iframe
                title="PDF Preview"
                type='application/pdf'
                ref={pdfPreviewRef}
                width="100%"
                height="100%"

            />
        </div>
    }


    /*     return (<div style={{ height: '98vh' }}>
            <iframe
                title="PDF Preview"
                type='application/pdf'
                ref={pdfPreviewRef}
                width="100%"
                height="100%"
    
            />
        </div> */


    /*  <Loader size='huge'
       content='Preparing Report... '
       active inline='centered'
       style={{ marginTop: '40vh' }} />
  <iframe
        title="PDF Preview"
        type='application/pdf'
        ref={pdfPreviewRef}
        width="100%"
        height="100%"

    /> */

}

const mapStateToProps = (state) => {

    return {
        datareport: state.auth.datareport,
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(PreviewPdf)
