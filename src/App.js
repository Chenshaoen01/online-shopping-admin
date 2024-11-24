import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Product from './pages/Product';
import ProductCategory from './pages/ProductCategory';
import Order from './pages/Order';
import Question from './pages/Question';
import Banner from './pages/Banner';
import NotifyModal from './components/NotifyModal';
import {AdminProvider} from './components/AdminContext';

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='/admin/product' element={<Product />}></Route>
            <Route path='/admin/productCategory' element={<ProductCategory />}></Route>
            <Route path='/admin/question' element={<Question />}></Route>
            <Route path='/admin/order' element={<Order />}></Route>
            <Route path='/admin/banner' element={<Banner />}></Route>
          </Route>
        </Routes>
        <NotifyModal />
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
