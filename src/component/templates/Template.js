import React from "react";
import { Image, Grid } from 'semantic-ui-react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'


const Template = (props) => {

    const [searchParams] = useSearchParams();


    for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        console.log(param, value);
    }

    return (

        <Grid stretched style={{ marginTop: '20vh' }} centered>
            <Image
                as={Link}
                style={{ paddingRight: '260px' }}
                size="massive"
                src='/404.jpg'
                to='/'
            />
        </Grid>


    )
}

export default Template