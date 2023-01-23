import React, {useEffect, useState} from 'react';
import axios from "axios";

const useCategories = () => {
const [categories, setCategories] = useState([]);
    const loadCategories = async ()=>{
        try {
            const {data} = await axios.get('/categories');
            setCategories(data)
        }catch (e) {
            console.log(e)
        }

    }

    useEffect(()=> {
        loadCategories().catch(e => console.log(e));
    }, [])

    return categories;
};

export default useCategories;