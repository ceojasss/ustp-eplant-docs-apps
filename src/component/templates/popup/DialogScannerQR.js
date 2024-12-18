import React, { useEffect, useRef, useState } from "react"
import { Container, Dimmer, Header, Icon, Image, Loader, Message } from "semantic-ui-react"
import _ from 'lodash'

import { useDispatch } from 'react-redux'

//import { QrReader } from "react-qr-reader";
import { fetchFromOutside } from "../../../redux/actions";



const DialogScannerQR = ({ message }) => {


    const [loadingScan, setLoadingScan] = useState(false)
    const [data, setData] = useState("")
    const [rawdata, setRawData] = useState("")

    /*  const [onScan, setOnScan] = useState(true)
  */
    const [scanMessage, setScanMessage] = useState('')
    const inputRef = useRef(null);

    const [activeScan, setActiveScan] = useState(true)

    useEffect(() => {

        // console.log(activeScan)

        if (activeScan) {
            setScanMessage('')
            setRawData('')
            setData('')
            inputRef.current.focus();
        }
    }, [activeScan])



    const dispatch = useDispatch()



    useEffect(() => {
        const timeOutId = setTimeout(() => setData(rawdata), 500);
        return () => clearTimeout(timeOutId);
    }, [rawdata])



    useEffect(() => {

        if (!_.isEmpty(data)) {
            setLoadingScan(true)
            dispatch(fetchFromOutside(data, async cb => {
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
                setActiveScan(false)

                setLoadingScan(false);
                // setOnScan(false)
                setData('')
                setRawData('')
            }))
        }

    }, [data, dispatch])

    /*   const handleError = (err) => {
          console.error(err);
      };
  
  
      const onNewScanResult = (decodedText, decodedResult) => {
          setLoadingScan(true)
          if (decodedResult && decodedText !== "") {
  
              setData(decodedText);
  
          };
  
      }
   */
    if (loadingScan) {
        return <Container> <Dimmer active inverted >
            <Loader size='massive' >Importing Faktur....</Loader>
        </Dimmer>
        </Container>
    }
    else {
        return <>
            <input
                type="text"
                ref={inputRef}
                value={rawdata}
                onChange={e => setRawData(e.target.value)}
                style={{ position: 'absolute', top: '-9999px' }} // Hide the input
                onBlur={() => {
                    setActiveScan(false)
                }}
            /*   onKeyDown={(e) => {
                  // console.log(e)
              }} */
            />
            {/*    <div> scanned item {data && <p>Scanned Item: {data}</p>}</div> */}
            {activeScan && <Image src='/qr_scan.gif' size='medium' centered />}
            {!activeScan && <Header as='h1' icon textAlign="center" onClick={() => {
                setActiveScan(true)
            }}
                style={{ cursor: 'pointer' }}>
                <Icon name='qrcode' size="massive" />
                <Header.Content>Click To Activate QR Scan</Header.Content>
            </Header >}

            <Message
                content={<Header content={scanMessage} />}
                visible />

        </>
    }

}

export default (DialogScannerQR) 