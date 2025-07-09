import React, { useEffect, useState } from "react";
import axios from "axios";

function AddRecipePage() {
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
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    };

    const addStep = () => {
        setRecipe({ ...recipe, steps: [...recipe.steps, ""] });
    };

    const handleSectionChange = (e, index) => {
        const updated = [...newSection.extrapoints];
        updated[index] = e.target.value;
        setNewSection({ ...newSection, extrapoints: updated });
    };

    const addExtrapoint = () => {
        setNewSection({ ...newSection, extrapoints: [...newSection.extrapoints, ""] });
    };

    const addSection = () => {
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
        try {
            const imageUrl = await uploadImage();
            const recipedata = { ...recipe, img: imageUrl };

            await axios.post("http://localhost:8000/recepie/add", recipedata);
            alert("Recipe added!");
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
        } catch (err) {
            console.error(err);
            alert("Error adding recipe");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Recipe</h2>
            <form onSubmit={handleSubmit}>
                <select name="blogId" className="form-control mb-2" value={recipe.blogId} onChange={handleChange}>
                    <option value="">Select Blog</option>
                    {blogs.map(blog => (
                        <option key={blog._id} value={blog._id}>{blog.h1}</option>
                    ))}
                </select>

                <label className="form-label">Blog Image</label>
                <input type="file" className="form-control mb-3" onChange={(e) => setImageFile(e.target.files[0])} />

                <input className="form-control mb-2" name="h1" placeholder="Title" value={recipe.h1} onChange={handleChange} />
                <input className="form-control mb-2" name="type" placeholder="Type" value={recipe.type} onChange={handleChange} />
                <input className="form-control mb-2" name="heading" placeholder="Heading" value={recipe.heading} onChange={handleChange} />
                <textarea className="form-control mb-2" name="description" placeholder="Description" value={recipe.description} onChange={handleChange}></textarea>

                <h5>Ingredients</h5>
                {recipe.ingredients.map((ing, i) => (
                    <input key={i} className="form-control mb-1" value={ing} onChange={(e) => handleArrayChange(e, i, "ingredients")} />
                ))}
                <button type="button" className="btn btn-outline-secondary mb-3" onClick={addIngredient}>+ Add Ingredient</button>

                <h5>Steps</h5>
                {recipe.steps.map((step, i) => (
                    <input key={i} className="form-control mb-1" value={step} onChange={(e) => handleArrayChange(e, i, "steps")} />
                ))}
                <button type="button" className="btn btn-outline-secondary mb-3" onClick={addStep}>+ Add Step</button>

                <h5>Add Extra Section</h5>
                <input className="form-control mb-2" placeholder="Section Title" value={newSection.title} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} />

                {newSection.extrapoints.map((point, i) => (
                    <input key={i} className="form-control mb-1" value={point} onChange={(e) => handleSectionChange(e, i)} />
                ))}
                <button type="button" className="btn btn-outline-secondary mb-2" onClick={addExtrapoint}>+ Add Extrapoint</button>
                <button type="button" className="btn btn-info mb-4" onClick={addSection}>Add Section</button>

                <button className="btn btn-primary">Submit Recipe</button>
            </form>

            <hr />
            <h5>Preview Sections</h5>
            {recipe.sections.map((sec, idx) => (
                <div key={idx} className="border p-2 mb-2">
                    <h6>{sec.title}</h6>
                    <ul>{sec.extrapoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
            ))}
        </div>
    );
}

export default AddRecipePage;
