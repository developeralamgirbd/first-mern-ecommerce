import React, { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import ProductCard from "../components/cards/ProductCard";
import { Checkbox, Radio } from "antd";
import { prices } from "../prices";
import useCategories from "../hooks/useCategories";

const ShopPage = ()=> {
    const categories = useCategories();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);

    const getTotal = async ()=>{
        try {
            const {data} = await axios.get('/products-count');
            setTotal(data);
        }catch (e) {
            console.log(e)

        }
    }

    const loadProducts = async ()=>{
        try {
            const {data} = await axios.get('/list-products/'+page);
            setProducts(data);
        }catch (e) {
            console.log(e)
        }
    }

    const loadFilterProducts = async ()=>{
        try {
            const {data} = await axios.post('/filtered-products', {
                checked: checked,
                radio: radio
            });
            setProducts(data.products);
            setTotal(data.total);

        }catch (e) {
            console.log(e.response.data.error);
        }
    }


    const loadMore = async ()=>{
        try {
            setLoading(true);
            const {data} = await axios.get('/list-products/'+page);
            setProducts([...products, ...data]);
            setLoading(false)
        }catch (e) {
            console.log(e)

        }
    }


    const handleCheck = (value, id)=>{
        let all = [...checked];

        if (value){
            all.push(id);
        }else {
            all = all.filter(cId => cId !== id);
        }
        setChecked(all)

    }


    useEffect(()=> {
        if (page === 1) return;
        loadMore().catch()
    }, [page])

    useEffect(()=> {
        if (!checked.length && !radio.length) {
            loadProducts();
        }
    }, [radio, checked]);


    useEffect(()=>{
        if (checked.length || radio.length) {
            setPage(1);
            loadFilterProducts().catch()
        }
    }, [checked, radio])


    useEffect(()=>{
        getTotal().catch();
    }, [])


    return (
        <>
            <Jumbotron title="Hello World" subTitle="Welcome to React E-commerce" />

            {/* <pre>{JSON.stringify({ checked, radio }, null, 4)}</pre> */}

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
                            Filter by Categories
                        </h2>
                        <div className="row p-5">
                            {categories?.map((c) => (
                                <Checkbox
                                    key={c._id}
                                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                                >
                                    {c.name}
                                </Checkbox>
                            ))}
                        </div>

                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
                            Filter by Price
                        </h2>

                        <div className="row p-5">
                            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                                {prices?.map((p, i) => (
                                    <div key={i} style={{ marginLeft: "8px" }}>
                                        <Radio value={p.array}>{p.name}</Radio>
                                    </div>
                                ))}
                            </Radio.Group>
                        </div>

                        <div className="p-5 pt-0">
                            <button
                                className="btn btn-outline-secondary col-12"
                                onClick={() => window.location.reload()}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="col-md-9">
                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
                            {checked.length > 0 || radio.length > 0 ? total : products?.length} Products
                        </h2>

                        <div
                            className="row"
                            style={{ height: "100vh", overflow: "scroll" }}
                        >
                            {products?.map((p, i) => (
                                <div className="col-md-4" key={i}>
                                    <ProductCard p={p} photo={p.demoPhoto} />
                                </div>
                            ))}

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



                    </div>



                </div>
            </div>
        </>
    );
}

export default ShopPage;