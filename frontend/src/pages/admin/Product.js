import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import {Select} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import useCategories from "../../hooks/useCategories";
const {Option} = Select;

const AdminProduct=()=> {
    // context
    const [auth] = useAuth();
    const categories = useCategories();

    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [shipping, setShipping] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');

    const navigate = useNavigate();



    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append('name', name);
            productData.append('description', description);
            productData.append('price', price);
            productData.append('category', category);
            productData.append('quantity', quantity);
            productData.append('shipping', shipping);
            productData.append('photo', photo);

            const {data} = await axios.post('/product', productData);
            toast.success(`"${data.name}" product is created`);
            navigate('/dashboard/admin/products');

        }catch (e){
            console.log(e.response.data);
            toast.error(e.response.data.error)
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
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Create Products</div>

                        {photo && (
                            <div className="text-center">
                                <img
                                    src={URL.createObjectURL(photo)}
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
                            min='1'
                            className="form-control p-2 mb-3"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <Select
                            showSearch
                            bordered={false}
                            size="large"
                            className="form-select mb-3"
                            placeholder="Choose category"
                            onChange={(value) => setCategory(value)}
                        >
                            {categories?.map((category) => (
                                <Option key={category._id} value={category._id}>
                                    {category.name}
                                </Option>
                            ))}

                        </Select>

                        <Select
                            bordered={false}
                            size="large"
                            className="form-select mb-3"
                            placeholder="Choose shipping"
                            onChange={(value) => setShipping(value)}
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

                        <button onClick={handleSubmit} className="btn btn-primary mb-5">
                            Submit
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminProduct;