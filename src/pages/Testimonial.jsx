import React, { useEffect, useState } from "react";
import axios from "axios";
import loader from "../logo.svg";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

function Testimonial() {

    const [testimonials, setTestimonials] = useState([]);
    const [form, setForm] = useState({ name: "", review: "", image: "", file: null });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTestimonials = async () => {
        const { data } = await axios.get("http://localhost:8000/api/testimonial");
        setTestimonials(data);
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post('http://localhost:8000/api/upload/product-image', formData);
        return res.data.url;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = form.image;
            if (form.file) {
                imageUrl = await uploadImageToCloudinary(form.file);
            }

            const payload = {
                name: form.name,
                review: form.review,
                image: imageUrl
            };

            if (editingId) {
                await axios.put(`http://localhost:8000/api/testimonial/${editingId}`, payload);
            } else {
                await axios.post("http://localhost:8000/api/testimonial", payload);
            }

            setForm({ name: "", review: "", image: "", file: null });
            setEditingId(null);
            fetchTestimonials();
        } catch (error) {
            console.error("Failed to upload testimonial", error);
            alert("Error uploading testimonial");
        }

        setLoading(false);
    };

    const handleEdit = (t) => {
        setForm({ name: t.name, review: t.review, image: t.image, file: null });
        setEditingId(t._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8000/api/testimonial/${id}`);
        fetchTestimonials();
    };

    return (
        <div className='container mt-4 mt-lg-0 mt-md-0'>
            <h2 className='fw-bold text-center mb-4 main-tittle'>Testimonial</h2>
            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="bg-dark p-3">
                        <h5 className="fw-bold m-0 text-white"><FaPlus className='me-2' />Add Testimonial</h5>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className='d-lg-flex d-md-flex gap-3'>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Client Name</label>
                                <input className="mt-1 w-100 form-control border border-secondary" placeholder="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Client Image</label>
                                <input className="mt-1 w-100 form-control border border-secondary" type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
                            </div>
                        </div>
                        <div className='w-100 mt-2'>
                            <label htmlFor="" className='d-block fw-bold'>Client Review</label>
                            <textarea type="text" name="description" rows={5} id="" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required placeholder="Customer Review" className='mt-1 w-100 form-control border border-secondary' />
                        </div>
                        <div className='mt-3 text-center'>
                            <button type='submit' className="btncss fw-bold mt-2" disabled={loading}>Submit</button>
                        </div>
                    </div>
                </div>

                <div className='rounded-3 shadow overflow-hidden my-4'>
                    <div className="bg-dark p-3">
                        <h5 className="fw-bold m-0 text-white"><MdArticle className='me-2' />Testimonials List</h5>
                    </div>
                    <div className='bg-white p-4 table-responsive'>
                        <table className='table custom-table table-hover text-center'>
                            <thead className='table-dark'>
                                <tr>
                                    <th>Client Image</th>
                                    <th>Client Name</th>
                                    <th>Client Review</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {testimonials.length > 0 ? (
                                    testimonials.map((t) => (
                                        <tr key={t._id}>
                                            <td>
                                                {t.image ? (
                                                    <img
                                                        src={t.image}
                                                        alt={t.name}
                                                        style={{ height: '50px', width: '50px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <span className="text-muted">No image</span>
                                                )}
                                            </td>
                                            <td>{t.name}</td>
                                            <td>{t.review}</td>
                                            <td style={{ width: "10%" }}>
                                                <FaEdit className='text-danger fs-5' onClick={() => handleEdit(t)} />
                                                <RiDeleteBin6Line className='text-warning fs-5 ms-2' onClick={() => handleDelete(t._id)} />
                                            </td>
                                        </tr>
                                    ))
                                )
                                    :
                                    (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">Testimonials Not Found.</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {form.image && !form.file && (
                    <img src={form.image} alt="Preview" className="mb-2" style={{ width: '100px' }} />
                )}
                {loading && <img src={loader} alt="Loading" width="20" />}

            </form>
        </div>
    );
}

export default Testimonial