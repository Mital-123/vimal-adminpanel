import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Component/Login';
import Sidebar from './Component/Sidebar';
import { useEffect, useState } from 'react';
import AddProduct from './pages/AddProduct';
import ProductData from './pages/ProductData';
import AddBlog from './pages/AddBlog';
import AddRecipe from './pages/AddRecipe';
import BrandData from './pages/BrandData';
import AddBrand from './pages/AddBrand';
import Testimonial from './pages/Testimonial';

function App() {

  const [login, setlogin] = useState(false);

  useEffect(() => {
    setlogin((localStorage.getItem("login")))
  }, [login])

  return (
    <>
      <BrowserRouter>
        <div className="main_form d-flex">
          {
            login ?
              <>
                <Sidebar />
                <div className="main-content p-2 p-lg-4 mt-5 mt-lg-0 mt-md-0 flex-grow-1">
                  <Routes>
                    <Route path='/' element={<AddProduct setlogin={setlogin} />} />
                    <Route path='/product' element={<AddProduct setlogin={setlogin} />} />
                    <Route path='/productdata' element={<ProductData />} />
                    <Route path='/blog' element={<AddBlog />} />
                    {/* <Route path='/brand' element={<AddBrand />} /> */}
                    {/* <Route path='/branddata' element={<BrandData />} /> */}
                    <Route path='/recipe' element={<AddRecipe />} />
                    <Route path='/testimonial' element={<Testimonial />} />
                  </Routes>
                </div>
              </>
              :
              <>
                <div className="main_login flex-grow-1">
                  <Routes>
                    <Route path="/" element={<Login setlogin={setlogin} />} />
                    <Route path="*" element={<Login setlogin={setlogin} />} />
                  </Routes>
                </div>
              </>
          }
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;