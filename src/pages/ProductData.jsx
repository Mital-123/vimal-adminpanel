import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function ProductData() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleEdit = (product) => {
        navigate("/", { state: product });
    };

    return (
        <>
            <div className='container mt-4 mt-lg-0 mt-md-0'>
                <h2 className='fw-bold text-center mb-2 main-tittle'>Product Data</h2>
                <div className="table-responsive">
                    <table className="table custom-table table-hover text-center">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: "15%" }}>ID</th>
                                <th style={{ width: "25%" }}>Tittle</th>
                                <th style={{ width: "40%" }}>Description</th>
                                <th style={{ width: "10%" }}>Image</th>
                                <th style={{ width: "10%" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody className='pera'>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td style={{ width: "15%" }}>{product.id}</td>
                                        <td style={{ width: "25%" }}>{product.h1}</td>
                                        <td style={{ width: "40%" }}>{product.mainLine}</td>
                                        <td style={{ width: "10%" }}>
                                            {product.img ? (
                                                <img
                                                    src={product.img}
                                                    alt={product.h1}
                                                    style={{ height: '50px', width: '50px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span className="text-muted">No image</span>
                                            )}
                                        </td>
                                        <td style={{ width: "10%" }}>
                                            <FaEdit className='text-danger fs-5' onClick={() => handleEdit(product)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No Product Data Found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ProductData