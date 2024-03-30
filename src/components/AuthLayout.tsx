import { ReactElement, useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";


export default function Protected({children, authentication=true}:{children:ReactElement, authentication:boolean}){

    const authStatus = useAppSelector((state) => state.auth.status)

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        if (authentication && authStatus !== authentication){
            navigate("/login")
        }
        else if (!authentication && authStatus !== authentication){
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, authentication, navigate])

    return loader ? null : <>{children}</>
}
