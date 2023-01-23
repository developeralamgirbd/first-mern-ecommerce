import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import CategoryForm from "../../components/forms/CategoryForm";
import {Modal} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import login from "../auth/Login";

const AdminCategory=()=> {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updatingName, setUpdatingName] = useState('');

    // context
    const [auth] = useAuth();
    const hideModal = () => {
        setOpen(false)
    }

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

    // Create new category handler
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.post('/category', {name});

            /*if (data?.error){
                toast.error(data.error);
            }else {
                setName('');
                loadCategories().catch(e => console.log(e));
                toast.success(`"${data.name}" Successfully Created`)
            }*/
            setName('');
            toast.success(`"${data.name}" Successfully Created`)
            await loadCategories();


        }catch (e) {
            console.log(e.response.data)
            toast.error(e.response.data.error);
        }
    }
    // Category update handler
    const updateHandler = async (e)=>{
        e.preventDefault();
        try {
            if (!updatingName.trim()){
                toast.error('Category is required');
            }else {
                const {data} = await axios.put('/category/'+selected._id, {name: updatingName});
             /*   if (data?.error){
                    toast.error(data.error);
                }else {
                    setUpdatingName('');
                    setSelected(null);
                    loadCategories().catch(e => console.log(e));
                    toast.success(`"${data.name}" Successfully Updated`);
                    hideModal();
                }*/

                setUpdatingName('');
                setSelected(null);
                loadCategories().catch(e => console.log(e));
                toast.success(`"${data.name}" Successfully Updated`);
                hideModal();
            }

        }catch (e) {
            console.log(e.response.data)
            toast.error(e.response.data.error);
        }
    }

    // Category delete handler
    const deleteHandler = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.delete('/category/'+selected._id);
            setSelected(null);
            toast.success(`"${data.name}" is Deleted`);
            hideModal();
            await loadCategories();

        }catch (e) {
            console.log(e.response.data)
            toast.error(e.response.data.error);
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
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>

                        <CategoryForm
                            value={name}
                            setValue={setName}
                            handleSubmit={handleSubmit}
                        />

                        <hr />

                        <div className="col">
                            {categories?.map(category => (
                                <button
                                    key={category.id}
                                    className="btn btn-outline-primary m-3"
                                    onClick={()=> {
                                        setOpen(true);
                                        setSelected(category);
                                        setUpdatingName(category.name)
                                    }}
                                >{category.name}</button>
                            ))}
                        </div>
                        <Modal
                            title="Category Update "
                            open={open}
                            onOk={hideModal}
                            onCancel={hideModal}
                            footer={false}
                        >
                            <CategoryForm
                                value={updatingName}
                                setValue={setUpdatingName}
                                buttonText='Update'
                                handleSubmit={updateHandler}
                                handleDelete={deleteHandler}
                            />
                        </Modal>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminCategory;