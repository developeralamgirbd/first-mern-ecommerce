import React, { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";

const ProductsByCategory = ()=> {
    // state
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    // hooks
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if (params?.slug) loadProductsByCategory();
    }, [params?.slug]);

    const loadProductsByCategory = async () => {
        try {
            const { data } = await axios.get(`/products-by-category/${params.slug}/${page}`);
            setCategory(data.category);
            setProducts(data.products);
            setTotal(data.total);

        } catch (err) {
            console.log(err);
        }
    };



    useEffect(()=> {
        if (page === 1) return;
        loadMore().catch()
    }, [page])

    const loadMore = async ()=>{
        try {
            setLoading(true);
            const {data} = await axios.get(`/products-by-category/${params.slug}/${page}`);
            setProducts([...products, ...data.products]);
            setLoading(false)
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Jumbotron
                title={category?.name}
                subTitle={`${total} products found in "${category?.name}"`}
            />

            <div className="container-fluid">
                <div className="row mt-3">
                    {products?.map((p, i) => (
                        <div key={i} className="col-md-4">
                            <ProductCard p={p} photo={p.demoPhoto} />
                        </div>
                    ))}
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
        </>
    );
}

export default ProductsByCategory