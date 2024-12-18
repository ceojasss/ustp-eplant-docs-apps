import { useEffect } from "react"
import { connect, useDispatch } from "react-redux"
import { signout } from "../../redux/actions"

import { useNavigate } from 'react-router-dom'

const SignOut = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(signout())

        navigate('/signin')
    }

    );

    return null
}


export default connect(null, { signout })(SignOut)