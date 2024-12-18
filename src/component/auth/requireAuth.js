import _ from "lodash"
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";


const ChildComponent = ChildComponent => {

    function ComposedComponent({ auths }) {


        const navigate = useNavigate();


        useEffect(() => {
            if (_.isEmpty(auths)) {
                navigate('/signin')
            }
        }, [navigate, auths]);

        return <ChildComponent />
    }

    const mapStateToProps = state => {
        return { auths: state.auth.authenticated }
    }


    return connect(mapStateToProps)(ComposedComponent)
}

export default ChildComponent