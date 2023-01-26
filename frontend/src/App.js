import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Menu from "./components/nav/Menu";
import {Toaster} from "react-hot-toast";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/user/Dashboard";
import UserOrder from "./pages/user/Order";
import UserProfile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategory from "./pages/admin/Category";
import AdminProduct from "./pages/admin/Product";
import PrivateRoute from "./components/routs/PrivateRoute";
import AdminRoute from "./components/routs/AdminRoute";
import Secret from "./pages/Secret";
import Products from "./pages/admin/Products";
import ProductUpdate from "./pages/admin/ProductUpdate";
import OrdersManage from "./pages/admin/OrdersManage";
import SearchPage from "./pages/SearchPage";
import ShopPage from "./pages/ShopPage";
import CategoriesList from "./pages/CategoriesList";
import ProductsByCategory from "./pages/ProductsByCategory";
import ProductView from "./pages/ProductView";
import Cart from "./pages/Cart";

const PageNotFound = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <h1 className="text-danger">404 | Page not found</h1>
        </div>
    );
};

function App() {
  return (
    <BrowserRouter>
        <Menu />
        <Toaster />
        <Routes>
            <Route path="/" element={<Home />} />

            {/*<Route element={<RedirectRoute/>}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>*/}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/category/:slug" element={<ProductsByCategory />} />
            <Route path="/product/:slug" element={<ProductView />} />
            <Route path="/cart" element={<Cart />} />

            <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="user" element={<Dashboard />} />
                <Route path="user/profile" element={<UserProfile />} />
                <Route path="user/orders" element={<UserOrder />} />
                <Route path="secret" element={<Secret/>}/>
            </Route>

            {/*Admin Route*/}
            <Route path="/dashboard" element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/category" element={<AdminCategory />} />
                <Route path="admin/product/update/:slug" element={<ProductUpdate />} />
                <Route path="admin/product" element={<AdminProduct />} />
                <Route path="admin/products" element={<Products />} />
                <Route path="admin/orders" element={<OrdersManage />} />

            </Route>

            <Route path="*" element={<PageNotFound />} replace />

        </Routes>
    </BrowserRouter>
  );
}

export default App;
