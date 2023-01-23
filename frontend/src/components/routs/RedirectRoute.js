import { useEffect, useState } from "react";
import {Navigate, Outlet} from "react-router-dom";
import { useAuth } from "../../context/auth";
import Loading from "./Loading";
import axios from "axios";
import Login from "../../pages/auth/Login";

const RedirectRoute= ()=> {
    // context
    const [auth] = useAuth();
    // state
    const [ok, setOk] = useState(false);

    const authorizeBaseUserDashboardUrl = auth?.user?.role === 1 ? 'admin' : 'user';
    // console.log(auth)

    useEffect(() => {

        const authCheck = async () => {
            const { data } = await axios.get(`/auth-check`);
            if (data.ok) {
                setOk(true);
            } else {
                setOk(false);
            }
        };

        if (auth?.token) {
            authCheck().catch();
        }

    }, [auth?.token]);

    return ok ? <Loading path={'dashboard/'+authorizeBaseUserDashboardUrl}/> : <Outlet/> ;

}

export default RedirectRoute;