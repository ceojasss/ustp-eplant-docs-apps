import React, { useEffect, useState } from "react"
import { Container, Dimmer, Header, Loader, Message } from "semantic-ui-react"
import _ from 'lodash'

import { connect, useDispatch } from 'react-redux'

import { QRSelected, fetchFromOutside } from "../../../redux/actions";
import Html5QrcodePlugin from "../../../utils/Html5QrcodePlugin";
import { QR_COMPONENT, RESET_QR_COMPONENT } from "../../../redux/actions/types";
import { useFormContext } from "react-hook-form";



const DialogScanQR = (formComp2) => {

    const [loadingScan, setLoadingScan] = useState(false)
    const [data, setData] = useState("")
    const {setValue} = useFormContext()

    const [scanMessage, setScanMessage] = useState('')
// console.log(_.find(_.filter(formComp2.formComp2,{fieldtype:'inputqr'}),'registername'))
const datValue = _.find(_.filter(formComp2.formComp2,{fieldtype:'inputqr'}),'registername')

    const dispatch = useDispatch()
// console.log(data)
    useEffect(() => {

        if (!_.isEmpty(data)){
        //     // dispatch(QRSelected(data))
            setValue(datValue.registername,data,{shouldDirty:true})
            setLoadingScan(true);
            // setData('')
        }
        // console.log(data)
            // dispatch(fetchFromOutside(data, cb => {
            //     //// console.log(cb.);

            //     if (!_.isEmpty(cb.data.errorMessage)) {
            //         let erm
            //         if (cb.data.errorMessage.indexOf("ORA-00001") > 1) {
            //             erm = 'Faktur Already Imported.'
            //         } else {
            //             erm = cb.data.errorMessage
            //         }


            //         setScanMessage(`Import Gagal : ${erm}`)
            //     }
            //     else {
            //         setScanMessage('Data Efaktur Berhasil Di Import.')
            //     }
            // console.log(message)

            // setScanMessage('Data Berhasil Discan.')
            // setLoadingScan(true);
           
            // }))

    }, [data,dispatch])



    const onNewScanResult = (decodedText, decodedResult) => {
        setLoadingScan(true)
        if (decodedResult && decodedText !== "") {

            setData(decodedText);

        };

    }

    // if (loadingScan) {
    //     return <Container> <Dimmer active inverted >
    //         <Loader size='massive' >Importing Data....</Loader>
    //     </Dimmer>
    //     </Container>
    // }
    // else {
        return <>
            <Html5QrcodePlugin
                fps={10}
                qrbox={400}
                disable400Flip={false}
                qrCodeSuccessCallback={onNewScanResult}
                aspectRatio={2}
            />
            {/* <Message negative content={<Header content={scanMessage} />} visible /> */}
        </>
    // }

}

export default (DialogScanQR) 