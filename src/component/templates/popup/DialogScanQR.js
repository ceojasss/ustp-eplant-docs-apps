import React, { useEffect, useState } from "react"
import { Container, Dimmer, Header, Loader, Message } from "semantic-ui-react"
import _ from 'lodash'

import { useDispatch } from 'react-redux'

import { fetchFromOutside } from "../../../redux/actions";
import Html5QrcodePlugin from "../../../utils/Html5QrcodePlugin";



const DialogScanQR = ({ message }) => {


    const [loadingScan, setLoadingScan] = useState(false)
    const [data, setData] = useState("")

    const [scanMessage, setScanMessage] = useState('')



    const dispatch = useDispatch()

    console.log('user')

    useEffect(() => {

        if (!_.isEmpty(data))
            dispatch(fetchFromOutside(data, cb => {
                //// console.log(cb.);

                if (!_.isEmpty(cb.data.errorMessage)) {
                    let erm
                    if (cb.data.errorMessage.indexOf("ORA-00001") > 1) {
                        erm = 'Faktur Already Imported.'
                    } else {
                        erm = cb.data.errorMessage
                    }


                    setScanMessage(`Import Gagal : ${erm}`)
                }
                else {
                    setScanMessage('Data Efaktur Berhasil Di Import.')
                }

                setLoadingScan(false);

                setData('')
            }))

    }, [data, dispatch])



    const onNewScanResult = (decodedText, decodedResult) => {
        setLoadingScan(true)
        if (decodedResult && decodedText !== "") {

            setData(decodedText);

        };

    }

    if (loadingScan) {
        return <Container> <Dimmer active inverted >
            <Loader size='massive' >Importing Faktur....</Loader>
        </Dimmer>
        </Container>
    }
    else {
        return <>
            <Html5QrcodePlugin
                fps={10}
                qrbox={400}
                disable400Flip={false}
                qrCodeSuccessCallback={onNewScanResult}
                aspectRatio={2}
            />
            <Message negative content={<Header content={scanMessage} />} visible />
        </>
    }

}

export default (DialogScanQR) 