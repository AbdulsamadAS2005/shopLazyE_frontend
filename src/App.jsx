import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Newarrivals from './pages/newarrivals';
import Bestsellers from './pages/bestsellers';
import Summercollection from './pages/summercollection';
import Wintercollection from './pages/wintercollection';
import Allproducts from './pages/allproducts';
import SingleProduct from './pages/singleProduct';
import Cart from './pages/cart';
import Header from './components/header';
import Checkout from './pages/checkout';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/newarrivals' element={<Newarrivals/>}/>
      <Route path='/bestsellers' element={<Bestsellers/>}/>
      <Route path='/summercollection' element={<Summercollection/>}/>
      <Route path='/wintercollection' element={<Wintercollection/>}/>
      <Route path='/allproducts' element={<Allproducts/>}/>
      <Route path='/product/:id' element={<SingleProduct/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/checkout' element={<Checkout/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
