import './App.css'
import { SingleProduct } from './features/products/singleProduct';
import { Cart } from './features/cart/cart';
import { OrderForm } from './features/orderform/orderform';
import Signup from './features/registration/signup';
import Login from './features/registration/login';
import { MyState } from './features/context/mystate';
import { SearchandUser } from './componets/searchanduser';
import { Userpage } from './features/dasboard/userPage';
import { AdminDashBoard } from './features/dasboard/adminDashborad';
import { UserRoute } from './protectedRoutes/userProtected';
import { AdminRoute } from './protectedRoutes/adminProtected';
import { AddProductPage } from './features/products/addProduct';
import { Home } from './pages/homepage/home';
import { About } from './pages/about/about';

import { Contact } from './pages/contact/contact';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Applayout from './componets/applayout';
import { ProductList } from './features/products/productDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Applayout />,
    children: [
      {
        path:'/',
        element:<Home />,
      },
      {
        path:'/contact',
        element:<Contact />,
      },
      {
        path:'/about',
        element:<About />,
      },
      {
        path:'/products',
        element:<ProductList />,
      },
      {
        path:'/signup',
        element:<Signup />,
      },
      {
        path:'/login',
        element:<Login />,
      },
      {
        path:'/productdetails',
        element:<SingleProduct />,
      },
      {
        path:'/addproduct',
        element:<AddProductPage />,
      },
      {
        path:'/profile/user',
        element:<Userpage />,
      },
      {
        path:'/profile/admin',
        element:<AdminDashBoard />,
      },
      {
        path:'/cart',
        element:<Cart />,
      },
      {
        path:'/placeorder',
        element:<OrderForm />,
      },
    ]

  }
])
function App() {
  return (
    <MyState>
      <RouterProvider router={router}></RouterProvider>
    </MyState>
  )
}

export default App
