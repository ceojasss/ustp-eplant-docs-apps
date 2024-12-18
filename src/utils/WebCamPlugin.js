import Webcam from 'react-webcam';
import { useEffect,useCallback, useState, useRef } from 'react';
import {Label,Button} from "semantic-ui-react"


const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const WebcamPlugin = (props) => {
   
  const webcamRef = useRef(null);
  const [imageSrc, setImage] = useState("");

  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef,setImage]);

  let videoConstraints = {
    facingMode: facingMode,
    // width: 270,
    // height: 480
  };
// console.log(imageSrc,webcamRef)
  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);
  // console.log(facingMode + videoConstraints);
    return( 
    // <>
    //         <Webcam
    //     audio={false}
    //     ref={webcamRef}
    //     screenshotFormat="image/jpeg"
    //     screenshotQuality={1}
    //     videoConstraints={videoConstraints}
    //   >
    //     {({ getScreenshot }) => (
    //       <button
    //         onClick={() => {
    //           console.log(getScreenshot())
    //         }}
    //       >
    //         Capture photo
    //       </button>
          
    //     )}
    //     <button onClick={handleClick}>Switch camera</button>
    //   </Webcam> </>
    <>
    <div className="webcam-container">
      <div className="webcam-img">
        {imageSrc === "" ? (
          <Webcam
            className="webcam"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            screenshotQuality={1}
          />
        ) : (
          <img
            src={imageSrc}
            alt="Scan"
            // style={{ width: "500px", height: "auto" }}
          />
        )}
      </div>
      <Label color='blue' onClick={handleClick} style={{ marginTop: '10px' }}>Switch camera</Label>
      {imageSrc === "" ? <Button positive floated="right" content='Capture Photo' onClick={capture} style={{ marginTop: '10px' }} /> :
       <><Button negative floated="right" content='Back' onClick={() => setImage("") } style={{ marginTop: '10px' }} />
       <Button positive floated="right" content='Save' onClick={""} style={{ marginTop: '10px' }} /> </>}
      
     
    </div>
  </>
      )   
}


export default WebcamPlugin;
