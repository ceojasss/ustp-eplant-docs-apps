import React, { useEffect,useCallback, useState, useRef } from "react"
import { Container, Dimmer, Header, Loader, Message,Label,Button, Form } from "semantic-ui-react"
import _ from 'lodash'

import { useDispatch } from 'react-redux'

import { fetchFromOutside, fetchUploadWebcam, resetModalStates } from "../../../redux/actions";
// import Webcam from "../../../utils/WebCamPlugin";
import Webcam from 'react-webcam';
import eplant from "../../../apis/eplant";
import { WEBCAM_COMPONENT } from "../../../redux/actions/types";
// import {Label,Button} from "semantic-ui-react"
// import Webcam from "react-webcam"


const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const DialogWebcam = ({ datas }) => {


    const [loadingScan, setLoadingScan] = useState(false)
    const [data, setData] = useState("")

    const [scanMessage, setScanMessage] = useState('')
    const [imageSrc, setImage] = useState("");
  
    const webcamRef = useRef(null);
    const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT);
    const dispatch = useDispatch()
    // const capture = useCallback(() => {
    //   const imageSrc = webcamRef.current.getScreenshot();
    //   setImage(imageSrc);
    // }, [webcamRef,setImage]);
    // console.log(datas)
    
    // console.log(datas.content[2])
    const capture = ()  => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      // save(imageSrc)
    }
    let path 


    const save = async ()  => {
    //  dispatch (saveWebcam(datas.content[1],datas.content[0],datas.content[2],imageSrc))
    // inputRef
      dispatch(fetchUploadWebcam(datas,imageSrc))
      // dispatch({type: WEBCAM_COMPONENT , payload:imageSrc})
      dispatch(resetModalStates())
    }
    let videoConstraints = {
      facingMode: facingMode,
      width: 480,
      height: 280
    };
   
    const handleClick = useCallback(() => {
      setFacingMode((prevState) =>
        prevState === FACING_MODE_USER
          ? FACING_MODE_ENVIRONMENT
          : FACING_MODE_USER
      );
    }, []);

    // console.log(imageSrc,webcamRef)

    useEffect(() => {
        // if (!_.isEmpty(data))
        //     dispatch(fetchFromOutside(data, cb => {
        //         //// console.log(cb.);

        //         if (!_.isEmpty(cb.data.errorMessage)) {
        //             let erm
        //             if (cb.data.errorMessage.indexOf("ORA-00001") > 1) {
        //                 erm = 'Faktur Already Imported.'
        //             } else {
        //                 erm = cb.data.errorMessage
        //             }


        //             setScanMessage(`Import Gagal : ${erm}`)
        //         }
        //         else {
        //             setScanMessage('Data Efaktur Berhasil Di Import.')
        //         }

        //         setLoadingScan(false);

        //         setData('')
        //     }))

    }, [data, dispatch])



   

    if (loadingScan) {
        return <Container> <Dimmer active inverted >
            <Loader size='massive' >Importing Faktur....</Loader>
        </Dimmer>
        </Container>
    }
    else {
        return(
          <>
          <div className="webcam-container">
            <div className="webcam-img">
              
              {imageSrc === "" ? (
                 <> <Webcam
                  className="webcam"
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  screenshotQuality={1}
                />
                {/* <input
                type="text"
                name="webcam"
                value={imageSrc}
                readOnly
              /> */}
                </>
              ) : (
                <Form.Input><img
                  src={imageSrc}
                  alt="Scan"
                  // style={{ width: "500px", height: "auto" }}
                />
                {/* <input type="text" {...register(datas.content[1])} value={imageSrc}/> */}
                {/* <Controller
                  name="text"
                  control={datas.content[3]}
                  defaultValue=""
                  render={({ field }) => (
                    <input type="text" {...field} name={datas.content[2]}
                    value={imageSrc}
                readOnly />
                  )}
                /> */}
                {/* <input
                type="text"
                name={datas.content[1]}
                value={imageSrc}
                readOnly
              />  */}
                </Form.Input>
              )}
            </div>
            <Label color='blue' onClick={handleClick} style={{ marginTop: '10px' }}>Switch camera</Label>
            {imageSrc === "" ?<><Button negative floated="right" content='Close' onClick={() => dispatch(resetModalStates())} style={{ marginTop: '10px' }} /> <Button positive floated="right" content='Capture Photo' onClick={capture} style={{ marginTop: '10px' }} /> </>:
             <><Button negative floated="right" content='Back' onClick={() => setImage("") } style={{ marginTop: '10px' }} />
             <Button positive floated="right" content='Save' onClick={() =>{save(imageSrc)}} style={{ marginTop: '10px' }} /> </>}
            
           
          </div>
        </>
        )
    }

}

export default (DialogWebcam) 

