import React from 'react';
import Jumbotron from "../components/cards/Jumbotron";
import {useSearch} from "../context/search";
import ProductCard from "../components/cards/ProductCard";

const SearchPage = () => {

    const [values] = useSearch();

    return (
        <>
            <Jumbotron
                title="Search results"
                subTitle={
                    values?.results?.length < 1
                        ? "No products found"
                        : `Found ${values?.results?.length} products`
                }
            />

            <div className="container mt-3">
                <div className="row">
                    {values?.results?.map((p) => (
                        <div key={p._id} className="col-md-4">
                            <ProductCard p={p} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchPage;