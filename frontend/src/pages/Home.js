import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/auth";
import Jumbotron from "../components/cards/Jumbotron";
import ProductCard from "../components/cards/ProductCard";
import axios from "axios";

const Home = () => {
    const [auth] = useAuth();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadProducts = async ()=> {
        try {
            const {data} = await axios.get('/list-products/'+page);
            setProducts(data);
        }catch (e) {
            console.log(e)
        }
    }

    const getTotal = async ()=> {
        try {
            const {data} = await axios.get('/products-count');
            // console.log(data);
            setTotal(data);
        }catch (e) {
            console.log(e)
        }

    }
    
    const loadMore = async ()=>{
        try {
            setLoading(true);
            const {data} = await axios.get('/list-products/'+page);
            setProducts([...products, ...data]);
            setLoading(false);
        }catch (e) {
            console.log(e);
        }
    }

    useEffect(()=> {
        if (page === 1) return;
        loadMore().catch(e => console.log(e));

    }, [page])

    useEffect(()=> {
        loadProducts().catch(e => console.log(e));
        getTotal().catch(e => console.log(e));
    }, [])

    const arr = [...products];
    const sortedBySold = arr?.sort((a, b) => a.sold < b.sold ? 1 : -1);

    return (
        <>
            <Jumbotron title="Hello World" sutTitle="Welcome to React E-commerce" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
                            New Arrivals
                        </h2>
                        <div className="row">
                            {products?.map((p) => (
                                <div className="col-md-6" key={p._id}>
                                    <ProductCard p={p} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
                            Best Sellers
                        </h2>
                        <div className="row">
                            {sortedBySold?.map((p) => (
                                <div className="col-md-6" key={p._id}>
                                    <ProductCard p={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container text-center p-5">
                    {products && products.length < total && (
                        <button
                            className="btn btn-warning btn-lg col-md-6"
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(page + 1);
                            }}
                        >
                            {loading ? "Loading..." : "Load more"}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;