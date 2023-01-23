import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({children})=>{

    const [auth, setAuth] = useState({
        user: null,
        token: ''
    });

    // axios config
    axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
    axios.defaults.headers.common["Authorization"] = auth?.token;


    useEffect(()=>{
        const authData = localStorage.getItem('auth');
        if (authData){
            const parsed = JSON.parse(authData);
            setAuth({...auth, user: parsed.user, token: parsed.token});
        }
    }, []);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export {useAuth, AuthProvider};