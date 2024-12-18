import React from "react";
import { Container, Header, Segment } from "semantic-ui-react";


const ContentError = ({ error }) => {
    let div = document.createElement("div");
    div.innerHTML = error[0].toString();

    return (
        <> <Segment basic style={{ marginTop: '40px', paddingTop: '5px', paddingBottom: '5px' }}>
            <Header size="huge"
                floated="left"
                color='red'
                content='Error' />
        </Segment>
            <Container key='content-container' as={Segment} basic style={{
                width: 'auto', marginRight: '100px'
            }}>
                {div.innerText}
            </Container>
        </>

    );

}

export default ContentError 