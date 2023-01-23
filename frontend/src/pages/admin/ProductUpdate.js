import React, {useEffect, useState} from 'react';
import {useAuth} from "../../context/auth";
import AdminMenu from "../../components/nav/AdminMenu";
import {Select} from "antd";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
const {Option} = Select;

const ProductUpdate = () => {
    const [auth] = useAuth();
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [shipping, setShipping] = useState('');
    const [quantity, setQuantity] = useState('');
    const [id, setId] = useState('');

    const navigate = useNavigate();
    const params = useParams();
    // console.log(params);
    const loadProduct = async ()=> {
        try {
            const {data} = await axios.get('/product/'+params.slug);
            setId(data._id);
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
            setShipping(data.shipping);
            setQuantity(data.quantity);
            setCategory(data.category._id);
        }catch (e) {
            console.log(e);
        }

    }

    const loadCategories = async () => {
        try {
            const {data} = await axios.get('/categories');
            setCategories(data);
        }catch (e){
            console.log(e)
        }
    }

    useEffect(()=> {
        loadProduct().catch(e => console.log(e));
        loadCategories().catch(e => console.log(e));
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append('name', name);
            productData.append('description', description);
            productData.append('price', price);
            productData.append('quantity', quantity);
            productData.append('shipping', shipping);
            productData.append('category', category);
            photo && productData.append('photo', photo);
            await axios.put('/product/'+id, productData);
            // navigate('/dashboard/admin/products');
            window.location.href = '/dashboard/admin/products'

        }catch (e) {
            if (e.response.status === 400){
                toast.error(e.response.data.error);
            }
            console.log(e)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const answer = window.confirm('Are you sure delete this product');
            if (!answer) return;

            const {data} = await axios.delete('/product/'+id);
            toast.success(`"${data.name}" product is deleted`);
            navigate('/dashboard/admin/products');

        }catch (e) {
            console.log(e);
        }
    }


    return (
        <>
            <Jumbotron
                title={`Hello ${auth?.user?.name}`}
                subTitle="Admin Dashboard"
            />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Update Product</div>

                        {photo ? (
                            <div className="text-center">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="product photo"
                                    className="img img-responsive"
                                    height="200px"
                                />
                            </div>
                        ) : (
                            <div className="text-center">
                                <img
                                    crossOrigin="anonymous"
                                    src={`${
                                        process.env.REACT_APP_API_BASE_URL
                                    }/product/photo/${id}?${new Date().getTime()}`}
                                    alt="product photo"
                                    className="img img-responsive"
                                    height="200px"
                                />
                            </div>
                        )}

                        <div className="pt-2">
                            <label className="btn btn-outline-secondary col-12 mb-3">
                                {photo ? photo.name : "Upload photo"}
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                    hidden
                                />
                            </label>
                        </div>

                        <input
                            type="text"
                            className="form-control p-2 mb-3"
                            placeholder="Write a name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <textarea
                            className="form-control p-2 mb-3"
                            placeholder="Write a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            type="number"
                            className="form-control p-2 mb-3"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <Select
                            // showSearch
                            bordered={false}
                            size="large"
                            className="form-select mb-3"
                            placeholder="Choose category"
                            value={category}
                            onChange={(value) => setCategory(value)}
                        >
                            {categories?.map((c) => (
                                <Option key={c._id} value={c._id}>
                                    {c.name}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            bordered={false}
                            size="large"
                            className="form-select mb-3"
                            placeholder="Choose shipping"
                            onChange={(value) => setShipping(value)}
                            value={shipping ? "Yes" : "No"}
                        >
                            <Option value="0">No</Option>
                            <Option value="1">Yes</Option>
                        </Select>

                        <input
                            type="number"
                            min="1"
                            className="form-control p-2 mb-3"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />

                        <div className="d-flex justify-content-between">
                            <button onClick={handleSubmit} className="btn btn-primary mb-5">
                                Update
                            </button>
                            <button onClick={handleDelete} className="btn btn-danger mb-5">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductUpdate;