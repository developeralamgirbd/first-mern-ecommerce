import React from 'react';
import {useAuth} from "../context/auth";
import Jumbotron from "../components/cards/Jumbotron";

const Home = () => {
    const [auth] = useAuth();

    return (
        <div>
            <Jumbotron title="Home Page" />
            <pre>{JSON.stringify(auth, null, 4)}</pre>
        </div>
    );
};

export default Home;