import React, { useState } from 'react'
import { Nav, Offcanvas } from 'react-bootstrap';
import { TiThMenu } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import ButtonCom from './ButtonCom';
import { BsAwardFill, BsFillBoxSeamFill } from 'react-icons/bs';
import { IoDocument } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { MdArticle } from 'react-icons/md';

function Sidebar() {

    const [showSidebar, setShowSidebar] = useState(false);

    const handleLinkClick = () => {
        setShowSidebar(false);
    };

    const logout = () => {
        localStorage.removeItem("login");
        window.location.reload();
    };

    return (
        <>
            <div className="sidebar fixed-sidebar d-flex flex-column p-4 d-none d-md-block">
                <div className='d-flex align-items-center justify-content-center'>
                    <div className="sidebar_logo p-2 shadow">
                        <img
                            src={require("../assets/Image/logo_vimal_agro.png")}
                            alt=""
                            className="img-fluid w-100 h-100"
                        />
                    </div>
                    <div className='text-white fw-bold fs-3 ms-3'>Admin <div>Panel</div></div>
                </div>
                <Nav className="flex-column p-2 pt-0">
                    <Nav.Item className="my-3">
                        <Link
                            to="/product"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <FaPlus className="me-2" />
                            <span className="sidebar_menu fw-medium">Add Product</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            to="/productdata"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <BsFillBoxSeamFill className="me-2" />
                            <span className="sidebar_menu fw-medium">Product Data</span>
                        </Link>
                    </Nav.Item>
                    {/* <Nav.Item className='my-3'>
                        <Link
                            to="/brand"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <FaPlus className="me-2" />
                            <span className="sidebar_menu fw-medium">Add Brand</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            to="/branddata"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <BsAwardFill className="me-2" />
                            <span className="sidebar_menu fw-medium">Brand Data</span>
                        </Link>
                    </Nav.Item> */}
                    <Nav.Item className='my-3'>
                        <Link
                            to="/blog"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdArticle className="me-2" />
                            <span className="sidebar_menu fw-medium">Blog</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            to="/recipe"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <FaPlus className="me-2" />
                            <span className="sidebar_menu fw-medium">Add Recipe</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className='my-3'>
                        <Link
                            to="/testimonial"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <FaPlus className="me-2" />
                            <span className="sidebar_menu fw-medium">Testimonial</span>
                        </Link>
                    </Nav.Item>
                </Nav>
                <div className="logout-btn">
                    <ButtonCom btn="Log Out" onClick={logout} />
                </div>
            </div>

            {/* Offcanvas for smaller screens */}
            <Offcanvas
                show={showSidebar}
                onHide={() => setShowSidebar(false)}
                className="sidebar fixed-sidebar"
            >
                <Offcanvas.Header closeButton className="mt-3 mx-2"></Offcanvas.Header>
                <Offcanvas.Body className="mx-2">
                    <div className='d-flex align-items-center'>
                        <div className="sidebar_logo p-2 shadow">
                            <img
                                src={require("../assets/Image/logo_vimal_agro.png")}
                                alt=""
                                className="img-fluid w-100 h-100"
                            />
                        </div>
                        <div className='text-white fw-bold fs-3 ms-3'>Admin <div>Panel</div></div>
                    </div>
                    <Nav className="flex-column p-2">
                        <Nav.Item className="my-3">
                            <Link
                                to="/product"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <FaPlus className="me-2" />
                                <span className="sidebar_menu fw-medium">Add Product</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link
                                to="/productdata"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <BsFillBoxSeamFill className="me-2" />
                                <span className="sidebar_menu fw-medium">Product Data</span>
                            </Link>
                        </Nav.Item>
                        {/* <Nav.Item className='my-3'>
                            <Link
                                to="/brand"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <FaPlus className="me-2" />
                                <span className="sidebar_menu fw-medium">Add Brand</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link
                                to="/branddata"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <BsAwardFill className="me-2" />
                                <span className="sidebar_menu fw-medium">Brand Data</span>
                            </Link>
                        </Nav.Item> */}
                        <Nav.Item className='my-3'>
                            <Link
                                to="/blog"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdArticle className="me-2" />
                                <span className="sidebar_menu fw-medium">Blog</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link
                                to="/recipe"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <FaPlus className="me-2" />
                                <span className="sidebar_menu fw-medium">Add Recipe</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className='my-3'>
                            <Link
                                to="/testimonial"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <FaPlus className="me-2" />
                                <span className="sidebar_menu fw-medium">Testimonial</span>
                            </Link>
                        </Nav.Item>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Hamburger icon for smaller screens */}
            <div className="d-md-none position-fixed top-0 start-50 translate-middle-x p-2 z-index-999 w-100 bg-dark d-flex justify-content-between align-items-center">
                <TiThMenu
                    className="text-white fs-1 p-1 rounded-2"
                    style={{ width: "40px", height: "40px", background: "var(--red)" }}
                    onClick={() => setShowSidebar(true)}
                />
                <ButtonCom btn="Log Out" onClick={logout} />
            </div>
        </>
    )
}

export default Sidebar