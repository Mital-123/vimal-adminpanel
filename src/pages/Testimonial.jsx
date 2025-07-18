import React, { useEffect, useState } from "react";
import axios from "axios";
import loader from "../logo.svg";

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
        <div className="container py-5">
            <h2>Testimonial Admin Panel</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <textarea className="form-control mb-2" placeholder="Customer Review" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required />
                <input className="form-control mb-2" type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />

                {form.image && !form.file && (
                    <img src={form.image} alt="Preview" className="mb-2" style={{ width: '100px' }} />
                )}

                <button className="btn btn-primary d-flex align-items-center gap-2" type="submit" disabled={loading}>
                    {loading && <img src={loader} alt="Loading" width="20" />}
                    {editingId ? "Update Testimonial" : "Add Testimonial"}
                </button>
            </form>

            <div className="mt-5">
                <h4>Testimonials List</h4>
                {testimonials.map(t => (
                    <div key={t._id} className="border p-3 mb-2">
                        <h5>{t.name}</h5>
                        <p>{t.review}</p>
                        <img src={t.image} alt="customer" style={{ width: "100px" }} />
                        <div className="mt-2">
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(t)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Testimonial