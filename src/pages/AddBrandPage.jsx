import axios from "axios";
import { useEffect, useState } from "react";
import loader from "../logo.svg";

/* http://localhost:8000/api/products */ //get product
/* http://localhost:8000/api/products/add,data */ //post product
/* http://localhost:8000/api/products/:id */ //edit product
/* http://localhost:8000/api/products/update/:id,data */ //update product
/* http://localhost:8000/api/products//update/:id/subproduct/:subId */ //update subproduct

function AddbrandPage() {
    const [product, setProduct] = useState({
        id: '',
        h1: '',
        brandimg: '',
        subproducts: []
    });

    const [sub, setSub] = useState({
        id: '',
        ProductName: '',
        subName: '',
        proimg: '',
        description: '',
        image: '',
    });
    const [products, setProducts] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8000/api/brand")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const [loadingMain, setLoadingMain] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const [isEditingMain, setIsEditingMain] = useState(false);
    const [isEditingSub, setIsEditingSub] = useState(false);
    const [editSubIndex, setEditSubIndex] = useState(null);

    const handleProductChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubChange = (e) => {
        setSub({ ...sub, [e.target.name]: e.target.value });
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
        if (!sub.ProductName) return alert('Subproduct name is required');
        setLoadingSub(true);
        try {
            const fileInput = document.getElementById('subImage');
            let imgUrl = sub.proimg;

            if (fileInput?.files[0]) {
                imgUrl = await uploadImageToCloudinary(fileInput.files[0], product.id || 'product');
            }

            const updatedSub = { ...sub, proimg: imgUrl };

            if (isEditingSub && editSubIndex !== null) {
                const newSubs = [...product.subproducts];
                newSubs[editSubIndex] = updatedSub;
                setProduct({ ...product, subproducts: newSubs });
            } else {
                setProduct({ ...product, subproducts: [...product.subproducts, updatedSub] });
            }

            setSub({
                id: '',
                ProductName: '',
                subName: '',
                proimg: '',
                description: '',
                image: '',
            });
            setIsEditingSub(false);
            setEditSubIndex(null);
        } catch (err) {
            console.error("Subproduct upload failed", err);
            alert("Failed to upload subproduct image");
        }
        setLoadingSub(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingMain(true);
        try {
            const fileInput = document.getElementById('mainImage');
            let imgUrl = product.img;

            if (fileInput?.files[0]) {
                imgUrl = await uploadImageToCloudinary(fileInput.files[0], product.id || 'product');
            }

            const payload = { ...product, img: imgUrl };

            if (isEditingMain) {
                await axios.put(`http://localhost:8000/api/brand/update/${product.id}`, payload);
                alert("Product updated!");
            } else {
                await axios.post('http://localhost:8000/api/brand/add', payload);
                alert("Product added!");
            }

            setProduct({
                id: '',
                h1: '',
                brandimg: '',
                subproducts: []
            });
            setIsEditingMain(false);
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        }
        setLoadingMain(false);
    };

    return (
        <div className="container mt-5">
            <h2>{isEditingMain ? 'Edit Product' : 'Add Main Product'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="id" placeholder="Product ID" className="mt-1 mb-2" value={product.id} onChange={handleProductChange} /><br />
                <input type="text" name="h1" placeholder="Product Title (h1)" className="mt-1 mb-2" value={product.h1} onChange={handleProductChange} /><br />
                <input type="text" name="mainLine" placeholder="Main Line" className="mt-1 mb-2" value={product.mainLine} onChange={handleProductChange} /><br />

                <label>Main Image</label><br />
                <input type="file" accept="image/*" className="mt-1 mb-3" id="mainImage" /><br />
                {product.img && <img src={product.img} alt="Preview" className="img-thumbnail mb-2" style={{ maxWidth: '200px' }} />}

                <h4>{isEditingSub ? 'Edit Subproduct' : 'Add Subproduct'}</h4>
                <input type="text" name="id" placeholder="Subproduct ID" className="mt-1 mb-1" value={sub.id} onChange={handleSubChange} /><br />
                <input type="text" name="ProductName" placeholder="Product Name" className="mt-1 mb-1" value={sub.ProductName} onChange={handleSubChange} /><br />
                <input type="text" name="subName" placeholder="Sub Name" className="mt-1 mb-1" value={sub.subName} onChange={handleSubChange} /><br />
                <textarea name="description" placeholder="Description" className="mt-1 mb-1" value={sub.description} onChange={handleSubChange}></textarea><br />

                <label>Subproduct Image</label><br />
                <input type="file" accept="image/*" className="mt-1 mb-2" id="subImage" /><br />
                {sub.proimg && <img src={sub.proimg} alt="Preview" className="img-thumbnail mb-2" style={{ maxWidth: '200px' }} />}

                <button
                    type="button"
                    className="btn btn-secondary mb-3 d-flex align-items-center gap-2"
                    onClick={addSubproduct}
                    disabled={loadingSub}
                >
                    {loadingSub && <img src={loader} alt="Loading" width="20" />}
                    {isEditingSub ? "Update Subproduct" : "Add Subproduct"}
                </button>

                <h6>Added Subproducts:</h6>
                <table className="table table-bordered mb-3">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Subproduct ID</th>
                            <th>Product Name</th>
                            <th>Sub Name</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.subproducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">No subproducts added</td>
                            </tr>
                        ) : (
                            product.subproducts.map((sp, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{sp.id}</td>
                                    <td>{sp.ProductName}</td>
                                    <td>{sp.subName}</td>
                                    <td>{sp.description}</td>
                                    <td>
                                        {sp.proimg && (
                                            <img
                                                src={sp.proimg}
                                                alt="Subproduct"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                className="rounded"
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={loadingMain}>
                    {loadingMain && <img src={loader} alt="Loading" width="20" />}
                    {isEditingMain ? "Update Product" : "Submit Product"}
                </button>
            </form>

            <div className="container mt-5">
                <table className="table table-bordered table-hover">
                    <tr>
                        <th>heading</th>
                        <th>mainline</th>
                        <th>image</th>
                        {/* <th>subproducts</th> */}
                    </tr>
                    {products.map((product) => (
                        <>
                            <tr key={product.id}>
                                <td>{product.h1}</td>
                                <td>{product.mainLine}</td>
                                <td><img src={product.img} alt={product.h1} className="mb-3" style={{ height: '100px', width: '100px' }} /></td>
                                {/* <td className="d-flex">
                                {product.subproducts.map((sub) => (
                                    <div className="col-md-4 mb-3" key={sub.id}>
                                        <div className="h-100">
                                            <img src={sub.proimg} className="w-auto" alt={sub.ProductName} height={70} />
                                            <div className="">
                                                <h5 className="">{sub.ProductName}</h5>
                                                <h6 className="mb-2 text-muted">{sub.subName}</h6>
                                                <p className="">{sub.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </td> */}
                            </tr>
                        </>
                    ))}
                </table >
            </div>
        </div>
    );
}

export default AddbrandPage;