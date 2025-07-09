import React, { useState } from "react";
import axios from "axios";

function AddBlogPage() {
    const [blog, setBlog] = useState({
        h1: "",
        type: "",
        heading: "",
        description: "",
        img: ""
    });

    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setBlog({ ...blog, [e.target.name]: e.target.value });
    };

    const uploadImage = async () => {
        if (!imageFile) return "";
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await axios.post("http://localhost:8000/api/upload/product-image", formData);
        return res.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imageUrl = await uploadImage();
            const blogData = { ...blog, img: imageUrl };

            await axios.post("http://localhost:8000/api/blog", blogData);
            alert("Blog added!");
            setBlog({ h1: "", type: "", heading: "", description: "", img: "" });
            setImageFile(null);
        } catch (err) {
            console.error(err);
            alert("Error adding blog");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Main Blog</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" name="h1" placeholder="Blog Title" value={blog.h1} onChange={handleChange} />
                <input className="form-control mb-2" name="type" placeholder="Type" value={blog.type} onChange={handleChange} />
                <input className="form-control mb-2" name="heading" placeholder="Heading" value={blog.heading} onChange={handleChange} />
                <textarea className="form-control mb-2" name="description" placeholder="Description" value={blog.description} onChange={handleChange}></textarea>

                <label className="form-label">Blog Image</label>
                <input type="file" className="form-control mb-3" onChange={(e) => setImageFile(e.target.files[0])} />

                <button className="btn btn-primary">Submit Blog</button>
            </form>
        </div>
    );
}

export default AddBlogPage;
