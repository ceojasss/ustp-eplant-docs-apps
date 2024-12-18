import React from "react"
import { Header, Label } from "semantic-ui-react";
import { useScreenSize } from "../../utils/FormComponentsHelpler"
const Footer = () => {
    const ss = useScreenSize();

    return (
        <>
            <Label size='tiny'
                content={`${ss.width} x ${ss.height}`}
                icon='tv'
                attached="bottom right" />
            <div className="ui center aligned container" style={{ paddingTop: '10px' }} >
                <Header as='h6' content={`© Union Sampoerna Triputra Persada - ${new Date().getFullYear()}`} />
                {/*                 <p className="ui tiny header" >© Union Sampoerna Triputra Persada - {new Date().getFullYear()}</p>
 */}            </div>
        </>)
}

export default Footer