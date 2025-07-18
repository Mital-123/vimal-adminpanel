import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import Swal from 'sweetalert2';

function AddRecipe() {

    const [blogs, setBlogs] = useState([]);

    const [recipe, setRecipe] = useState({
        blogId: "",
        h1: "",
        type: "",
        heading: "",
        description: "",
        ingredients: [""],
        steps: [""],
        sections: []
    });

    const [newSection, setNewSection] = useState({
        title: "",
        extrapoints: [""]
    });

    const [imageFile, setImageFile] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:8000/api/blog")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.blogs || [];
                setBlogs(data);
            })
            .catch(err => {
                console.error("Failed to fetch blogs:", err);
            });
    }, []);

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (e, index, field) => {
        const updated = [...recipe[field]];
        updated[index] = e.target.value;
        setRecipe({ ...recipe, [field]: updated });
    };

    const addIngredient = () => {
        const hasEmpty = recipe.ingredients.some(ing => !ing.trim());
        if (hasEmpty) {
            Swal.fire("Warning", "Please fill this ingredient field before adding a new one.", "warning");
            return;
        }
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    };

    const addStep = () => {
        const hasEmpty = recipe.steps.some(step => !step.trim());
        if (hasEmpty) {
            Swal.fire("Warning", "Please fill this step field before adding a new one.", "warning");
            return;
        }
        setRecipe({ ...recipe, steps: [...recipe.steps, ""] });
    };

    const handleSectionChange = (e, index) => {
        const updated = [...newSection.extrapoints];
        updated[index] = e.target.value;
        setNewSection({ ...newSection, extrapoints: updated });
    };

    const addExtrapoint = () => {
        const hasEmpty = newSection.extrapoints.some(p => !p.trim());
        if (hasEmpty) {
            Swal.fire("Warning", "Please fill this extra point before adding a new one.", "warning");
            return;
        }
        setNewSection({ ...newSection, extrapoints: [...newSection.extrapoints, ""] });
    };

    const addSection = () => {
        if (!newSection.title.trim()) {
            Swal.fire("Warning", "Please enter a section title.", "warning");
            return;
        }
        const hasEmpty = newSection.extrapoints.some(p => !p.trim());
        if (hasEmpty) {
            Swal.fire("Warning", "Please fill this extra point before adding a section.", "warning");
            return;
        }
        setRecipe({ ...recipe, sections: [...recipe.sections, newSection] });
        setNewSection({ title: "", extrapoints: [""] });
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

        const newSectionNotAdded =
            newSection.title.trim() !== "" ||
            newSection.extrapoints.some(p => p.trim() !== "");

        if (newSectionNotAdded) {
            Swal.fire("Warning", "Please click 'Add Section' to add the section before submitting.", "warning");
            return;
        }

        if (
            !recipe.blogId ||
            !recipe.h1.trim() ||
            !recipe.type.trim() ||
            !recipe.heading.trim() ||
            !recipe.description.trim() ||
            recipe.ingredients.some(i => !i.trim()) ||
            recipe.steps.some(s => !s.trim()) ||
            recipe.sections.length === 0 ||
            recipe.sections.some(sec =>
                !sec.title.trim() || sec.extrapoints.some(p => !p.trim())
            )
        ) {
            Swal.fire("Warning", "Please fill in all required fields.", "warning");
            return;
        }

        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while we save the recipe.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const imageUrl = await uploadImage();
            const recipedata = { ...recipe, img: imageUrl };

            await axios.post("http://localhost:8000/recepie/add", recipedata);
            Swal.fire({
                icon: 'success',
                title: 'Updated successfull',
                text: 'Recipe added successfully!',
                showConfirmButton: false,
                timer: 1500
            });

            setRecipe({
                blogId: "",
                h1: "",
                type: "",
                heading: "",
                img: "",
                description: "",
                ingredients: [""],
                steps: [""],
                sections: []
            });
            setImageFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to add recipe.", "error");
        }
    };

    return (
        <>
            <div className='container mt-4 mt-lg-0 mt-md-0'>
                <h2 className='fw-bold text-center mb-4 main-tittle'>Add Recipe Details</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="rounded-3 shadow overflow-hidden">
                        <div className="bg-dark p-3">
                            <h5 className="fw-bold m-0 text-white"><FaPlus className='me-2' />Add Recipe</h5>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <div className='w-100 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Select Blog</label>
                                <select name="blogId" className='mt-1 w-100 form-control border border-secondary' value={recipe.blogId} onChange={handleChange}>
                                    <option value="">Select Blog</option>
                                    {blogs.map(blog => (
                                        <option key={blog._id} value={blog._id}>{blog.h1}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='w-100 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Blog Image</label>
                                <input type="file" name="" ref={fileInputRef} id="" className='mt-1 w-100 form-control border border-secondary' onChange={(e) => setImageFile(e.target.files[0])} />
                            </div>
                            <div className='d-lg-flex d-md-flex gap-3'>
                                <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                    <label htmlFor="" className='d-block fw-bold'>Blog Tittle</label>
                                    <input type="text" name="h1" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Tittle' value={recipe.h1} onChange={handleChange} />
                                </div>
                                <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                    <label htmlFor="" className='d-block fw-bold'>Blog Type</label>
                                    <input type="text" name="type" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Type' value={recipe.type} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Blog Heading</label>
                                <input type="text" name="heading" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Heading' value={recipe.heading} onChange={handleChange} />
                            </div>
                            <div className='w-100 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Description</label>
                                <textarea type="text" name="description" rows={5} id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter description' value={recipe.description} onChange={handleChange} />
                            </div>
                            <div className='w-100 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Ingredients</label>
                                {recipe.ingredients.map((ing, i) => (
                                    <input type="text" key={i} name="" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enetr Ingredients' value={ing} onChange={(e) => handleArrayChange(e, i, "ingredients")} />
                                ))}
                                <div className='mt-3'>
                                    <button type="button" className="btncss fw-bold mt-2 d-flex align-items-center gap-2" onClick={addIngredient}>
                                        <FaPlus />
                                        Add Ingredient
                                    </button>
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Steps</label>
                                {recipe.steps.map((step, i) => (
                                    <input type="text" key={i} name="" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enetr Steps' value={step} onChange={(e) => handleArrayChange(e, i, "steps")} />
                                ))}
                                <div className='mt-3'>
                                    <button type="button" className="btncss fw-bold mt-2 d-flex align-items-center gap-2" onClick={addStep}>
                                        <FaPlus />
                                        Add Step
                                    </button>
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <label htmlFor="" className='d-block fw-bold'>Add Extra Section</label>
                                <input type="text" name="" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Section Tittle' value={newSection.title} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} />

                                {newSection.extrapoints.map((point, i) => (
                                    <input type="text" key={i} name="" id="" className='mt-1 w-100 form-control border border-secondary' placeholder='Enter Extra Point' value={point} onChange={(e) => handleSectionChange(e, i)} />
                                ))}

                                <div className='d-lg-flex gap-2'>
                                    <button type="button" className="btncss fw-bold mt-3 d-flex align-items-center gap-2" onClick={addExtrapoint}>
                                        <FaPlus />
                                        Add Extra Point
                                    </button>
                                    <button type="button" className="btncss fw-bold mt-3 d-flex align-items-center gap-2" onClick={addSection}>
                                        <FaPlus />
                                        Add Section
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='rounded-3 shadow overflow-hidden mt-4'>
                        <div className="bg-dark p-3">
                            <h5 className="fw-bold m-0 text-white">Added Section</h5>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            {recipe.sections.length > 0 ? (
                                recipe.sections.map((sec, idx) => (
                                    <div key={idx} className="mt-3">
                                        <h6 className='fw-bold text-capitalize'>✤ {sec.title}</h6>
                                        <div className='ms-3 text-capitalize pera'>
                                            {sec.extrapoints.map((p, i) => (
                                                <div key={i}>
                                                    <MdKeyboardDoubleArrowRight className='me-1 fs-5' />{p}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted mt-3">No section found.</div>
                            )}
                        </div>
                    </div>

                    <div className='mt-3 text-center'>
                        <button type='submit' className="btncss fw-bold mt-2">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddRecipe