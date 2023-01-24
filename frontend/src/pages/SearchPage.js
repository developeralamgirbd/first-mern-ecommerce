import React, {useEffect, useState} from 'react';
import Jumbotron from "../components/cards/Jumbotron";
import {useSearch} from "../context/search";
import ProductCard from "../components/cards/ProductCard";
import axios from "axios";

const SearchPage = () => {

    const {products, setProducts, keyword, total, setTotal} = useSearch();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadMore = async ()=>{
        try {
            console.log(keyword)

            setLoading(true);
            const { data } = await axios.get(`/products/search/${keyword}/${page}`);
            setProducts([...products, ...data.results]);
            setTotal(data?.total);
            setLoading(false);
        }catch (e) {
            console.log(e)

        }
    }

    useEffect(()=> {
        if (page === 1) {
            return;
        }
        loadMore().catch()
    }, [page])

    return (
        <>
            <Jumbotron
                title="Search results"
                subTitle={
                    total < 1
                        ? "No products found"
                        : `Found ${total} products`
                }
            />

            <div className="container mt-3">
                <div className="row">
                    {products?.map((p,i) => (
                        <div key={i} className="col-md-4">
                            <ProductCard p={p} photo={p.demoPhoto} />
                        </div>
                    ))}
                </div>

                <div className="container text-center p-5">
                    {products && products?.length < total && (
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

export default SearchPage;