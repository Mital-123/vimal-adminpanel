import React, { useEffect, useState } from 'react'
import ButtonCom from '../Component/ButtonCom'
import { BsFillBoxSeamFill } from 'react-icons/bs'
import { FaBox, FaEdit, FaPlus } from 'react-icons/fa'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AddProduct() {

    const navigate = useNavigate();

    const location = useLocation();
    const editingProduct = location.state || null;

    const [product, setProduct] = useState(editingProduct || {
        id: '',
        h1: '',
        mainLine: '',
        img: '',
        subproducts: []
    });

    const [sub, setSub] = useState({
        id: '',
        ProductName: '',
        subName: '',
        proimg: '',
        description: ''
    });

    const [loadingMain, setLoadingMain] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const [isEditingMain, setIsEditingMain] = useState(false);
    const [isEditingSub, setIsEditingSub] = useState(false);
    const [editSubIndex, setEditSubIndex] = useState(null);

    useEffect(() => {
        if (editingProduct) {
            setProduct(editingProduct);
            setIsEditingMain(true);
        }
    }, [editingProduct]);


    const handleProductChange = (e) => {
        const { name, value } = e.target;

        if (name === "id") {
            // Allow only alphanumeric characters
            const alphanumeric = /^[a-zA-Z0-9]*$/;
            if (!alphanumeric.test(value)) return;
        }

        setProduct({ ...product, [name]: value });
    };

    const handleSubChange = (e) => {
        const { name, value } = e.target;

        if (name === "id") {
            // Allow only alphanumeric characters
            const alphanumeric = /^[a-zA-Z0-9]*$/;
            if (!alphanumeric.test(value)) return;
        }

        setSub({ ...sub, [name]: value });
    };

    const uploadImageToCloudinary = async (file, folderName) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folderName);
        const res = await axios.post('http://localhost:8000/api/upload/product-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.url;
    };

    const addSubproduct = async () => {
        const fileInput = document.getElementById('subImage');
        if (
            !sub.ProductName ||
            !sub.id ||
            !sub.subName ||
            !sub.description ||
            (!sub.proimg && !(fileInput?.files.length > 0))
        ) {
            Swal.fire("Error", "Please fill in all subproduct fields.", "warning");
            return;
        }

        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while we save the subproduct.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setLoadingSub(true);

        try {
            const fileInput = document.getElementById('subImage');
            let imgUrl = sub.proimg;

            if (fileInput?.files[0]) {
                imgUrl = await uploadImageToCloudinary(fileInput.files[0], product.id || 'product');
            }

            const updatedSub = { ...sub, proimg: imgUrl };

            // ✅ Subproduct update mode
            if (isEditingSub && editSubIndex !== null) {
                // 🔁 SubProduct API Call
                await axios.put(`http://localhost:8000/api/products/update/${product.id}/subproduct/${sub.id}`, updatedSub);

                const newSubs = [...product.subproducts];
                newSubs[editSubIndex] = updatedSub;
                setProduct({ ...product, subproducts: newSubs });
                Swal.fire({
                    icon: 'success',
                    title: 'Updated successfull',
                    text: 'Subproduct updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                setProduct({ ...product, subproducts: [...product.subproducts, updatedSub] });
                Swal.fire({
                    icon: 'success',
                    title: 'Added successfull',
                    text: 'Subproduct added successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            setSub({ id: '', ProductName: '', subName: '', proimg: '', description: '' });
            setIsEditingSub(false);
            setEditSubIndex(null);

            const subFileInput = document.getElementById('subImage');
            if (subFileInput) subFileInput.value = "";

        } catch (err) {
            console.error("Subproduct upload failed", err);
            Swal.fire("Error", "Failed to upload subproduct image", "error");
        }

        setLoadingSub(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingMain(true);
        const fileInput = document.getElementById('mainImage');
        let imgUrl = product.img;

        if (!product.id || !product.h1 || !product.mainLine || (!product.img && !(fileInput?.files.length > 0))) {
            Swal.fire("Error", "Please fill in all product fields.", "warning");
            setLoadingMain(false);
            return;
        }

        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while we save the product.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const fileInput = document.getElementById('mainImage');
            let imgUrl = product.img;

            if (fileInput?.files[0]) {
                imgUrl = await uploadImageToCloudinary(fileInput.files[0], product.id || 'product');
            }

            const payload = { ...product, img: imgUrl };
            console.log("Final Payload:", payload);

            if (isEditingMain) {
                await axios.put(`http://localhost:8000/api/products/update/${product.id}`, payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated successfull',
                    text: 'Product updated successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                    willClose: () => {
                        navigate("/productdata");
                    }
                });
            } else {
                const res = await axios.post('http://localhost:8000/api/products/add', payload);
                console.log("Response from API:", res.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Added successfull',
                    text: 'Product added successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                    willClose: () => {
                        navigate("/productdata");
                    }
                });

            }

            setProduct({ id: '', h1: '', mainLine: '', img: '', subproducts: [] });
            setIsEditingMain(false);

            if (fileInput) fileInput.value = "";

        } catch (err) {
            console.error("Error submitting product:", err.response ? err.response.data : err);
            Swal.fire("Error", "Error saving product", "error");
        }

        setLoadingMain(false);
    };

    return (
        <div className='container mt-4 mt-lg-0 mt-md-0'>
            <h2 className='fw-bold text-center mb-4 main-tittle'>Add Product Details</h2>
            <form onSubmit={handleSubmit}>
                {/* Main Product */}
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="bg-dark p-3">
                        <h5 className="fw-bold m-0 text-white"><BsFillBoxSeamFill className='me-2' />Add Product</h5>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className='d-lg-flex d-md-flex gap-3'>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>Product ID</label>
                                <input type="text" name="id" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Product Id' value={product.id} onChange={handleProductChange} disabled={isEditingMain} onKeyDown={(e) => e.key === ' ' && e.preventDefault()} />
                            </div>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>Product Title</label>
                                <input type="text" name="h1" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Product Tittle' value={product.h1} onChange={handleProductChange} />
                            </div>
                        </div>
                        <div className='d-lg-flex d-md-flex gap-3'>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>Description</label>
                                <input type="text" name="mainLine" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Product Description' value={product.mainLine} onChange={handleProductChange} />
                            </div>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>Product Image</label>
                                <input type="file" accept="image/*" id="mainImage" className='mt-1 w-100 form-control border border-secondary' />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SubProduct */}
                <div className='rounded-3 shadow overflow-hidden my-4'>
                    <div className="bg-dark p-3">
                        <h5 className="fw-bold m-0 text-white"><FaPlus className='me-2' />Add SubProduct</h5>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className='d-lg-flex d-md-flex gap-3'>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>SubProduct ID</label>
                                <input type="text" name="id" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter SubProduct Id' value={sub.id} onChange={handleSubChange} disabled={isEditingSub} onKeyDown={(e) => e.key === ' ' && e.preventDefault()} />
                            </div>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>SubProduct Title</label>
                                <input type="text" name="ProductName" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter SubProduct Tittle' value={sub.ProductName} onChange={handleSubChange} />
                            </div>
                        </div>
                        <div className='d-lg-flex d-md-flex gap-3'>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>SubProduct Name</label>
                                <input type="text" name="subName" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter SubProduct Name' value={sub.subName} onChange={handleSubChange} />
                            </div>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>Description</label>
                                <input type="text" name="description" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter SubProduct Description' value={sub.description} onChange={handleSubChange} />
                            </div>
                        </div>
                        <div className='w-100 mt-2'>
                            <label className='d-block fw-bold'>SubProduct Image</label>
                            <input type="file" accept="image/*" id="subImage" className='mt-1 w-100 form-control border border-secondary' />
                        </div>
                        <div className='mt-3 text-center'>
                            <ButtonCom btn="Add SubProduct" onClick={addSubproduct} disabled={loadingSub} />
                        </div>
                    </div>
                </div>

                {/* Display SubProducts */}
                <div className='rounded-3 shadow overflow-hidden'>
                    <div className="bg-dark p-3">
                        <h5 className="fw-bold m-0 text-white"><FaBox className='me-2' />Added SubProduct</h5>
                    </div>
                    <div className='bg-white p-4'>
                        {product.h1 && (
                            <div className="fw-bold fs-5 text-center mb-2">
                                {product.h1}
                            </div>
                        )}
                        <div className='table-responsive'>
                            <table className='table custom-table table-hover text-center'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th style={{ width: "10%" }}>ID</th>
                                        <th style={{ width: "20%" }}>Title</th>
                                        <th style={{ width: "20%" }}>Name</th>
                                        <th style={{ width: "30%" }}>Description</th>
                                        <th style={{ width: "10%" }}>Image</th>
                                        <th style={{ width: "10%" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='pera'>
                                    {product.subproducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center">No SubProducts Added.</td>
                                        </tr>
                                    ) : (
                                        product.subproducts.map((sp, i) => (
                                            <tr key={i}>
                                                <td style={{ width: "10%" }}>{sp.id}</td>
                                                <td style={{ width: "20%" }}>{sp.ProductName}</td>
                                                <td style={{ width: "20%" }}>{sp.subName}</td>
                                                <td style={{ width: "30%" }}>{sp.description}</td>
                                                <td style={{ width: "10%" }}>
                                                    {sp.proimg && (
                                                        <img
                                                            src={sp.proimg}
                                                            alt="Subproduct"
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </td>
                                                <td style={{ width: "10%" }}><FaEdit className='text-danger fs-5' onClick={() => {
                                                    setSub(sp);
                                                    setIsEditingSub(true);
                                                    setEditSubIndex(i);
                                                }} /></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='mt-3 text-center'>
                    <button type='submit' className="btncss fw-bold mt-2" disabled={loadingMain}>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;