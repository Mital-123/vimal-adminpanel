import React, { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdArticle } from 'react-icons/md';

function AddBlog() {

    const [blog, setBlog] = useState({
        h1: "",
        type: "",
        heading: "",
        description: "",
        img: ""
    });
    const [blogList, setBlogList] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/blog");
            setBlogList(res.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };
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

        if (!blog.h1 || !blog.type || !blog.heading || !blog.description || !imageFile) {
            Swal.fire("Error", "Please fill in all blog fields and select an image.", "warning");
            return;
        }

        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while we save the blog.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const imageUrl = await uploadImage();
            const blogData = { ...blog, img: imageUrl };

            await axios.post("http://localhost:8000/api/blog", blogData);
            Swal.fire({
                icon: 'success',
                title: 'Added successfull',
                text: 'Blog added successfully!',
                showConfirmButton: false,
                timer: 1500
            });

            fetchBlogs();

            setBlog({ h1: "", type: "", heading: "", description: "", img: "" });
            setImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Error saving blog", "error");
        }
    };

    return (
        <>
            <div className='container mt-4 mt-lg-0 mt-md-0'>
                <h2 className='fw-bold text-center mb-4 main-tittle'>Bolg</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="rounded-3 shadow overflow-hidden">
                        <div className="bg-dark p-3">
                            <h5 className="fw-bold m-0 text-white"><FaPlus className='me-2' />Add Blog</h5>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <div className='d-lg-flex d-md-flex gap-3'>
                                <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                    <label htmlFor="" className='d-block fw-bold'>Blog Tittle</label>
                                    <input type="text" name="h1" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Tittle' value={blog.h1} onChange={handleChange} />
                                </div>
                                <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                    <label htmlFor="" className='d-block fw-bold'>Blog Type</label>
                                    <input type="text" name="type" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Type' value={blog.type} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='d-lg-flex d-md-flex gap-3'>
                                <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                    <label htmlFor="" className='d-block fw-bold'>Blog Heading</label>
                                    <input type="text" name="heading" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Heading' value={blog.heading} onChange={handleChange} />
                                </div>
                                <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                    <label htmlFor="" className='d-block fw-bold'>Blog Description</label>
                                    <input type="text" name="description" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Description' value={blog.description} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <label className='d-block fw-bold'>Blog Image</label>
                                <input type="file" id="" ref={fileInputRef} className='mt-1 w-100 form-control border border-secondary' onChange={(e) => setImageFile(e.target.files[0])} />
                            </div>
                            <div className='mt-3 text-center'>
                                <button type='submit' className="btncss fw-bold mt-2">Submit</button>
                            </div>
                        </div>
                    </div>

                    <div className='rounded-3 shadow overflow-hidden my-4'>
                        <div className="bg-dark p-3">
                            <h5 className="fw-bold m-0 text-white"><MdArticle className='me-2' />Added Blog</h5>
                        </div>
                        <div className='bg-white p-4 table-responsive'>
                            <table className='table custom-table table-hover text-center'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th style={{ style: "20%" }}>Tittle</th>
                                        <th style={{ style: "10%" }}>Type</th>
                                        <th style={{ style: "20%" }}>Heading</th>
                                        <th style={{ style: "40%" }}>Description</th>
                                        <th style={{ style: "10%" }}>Image</th>
                                    </tr>
                                </thead>
                                <tbody className='pera'>
                                    {blogList.length > 0 ? (
                                        blogList.map((blog) => (
                                            <tr key={blog.id}>
                                                <td style={{ style: "20%" }}>{blog.h1}</td>
                                                <td style={{ style: "10%" }}>{blog.type}</td>
                                                <td style={{ style: "20%" }}>{blog.heading}</td>
                                                <td style={{ style: "40%" }}>{blog.description}</td>
                                                <td style={{ style: "10%" }}>
                                                    {blog.img ? (
                                                        <img
                                                            src={blog.img}
                                                            alt={blog.h1}
                                                            style={{ height: '50px', width: '50px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <span className="text-muted">No image</span>
                                                    )}
                                                </td>

                                            </tr>
                                        ))
                                    )
                                        :
                                        (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">No Blogs Found.</td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}

export default AddBlog