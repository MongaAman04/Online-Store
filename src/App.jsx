import './App.css'
import { Footer } from './componets/footer'
import { Header } from './componets/header'
import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import { Home } from './home';
import { Contact } from './contact';
import { About } from './about';
import { Products } from './products';
import { SingleProduct } from './singleProduct';
import { Cart } from './cart';
import { OrderForm } from './orderform';
import Signup from './registration/signup';
import Login from './registration/login';
import { MyState } from './context/mystate';
import { SearchandUser } from './componets/searchanduser';
import { Userpage } from './userPage';
import { AdminDashBoard } from './adminDashborad';
import { UserRoute } from './protectedRoutes/userProtected';
import { AdminRoute } from './protectedRoutes/adminProtected';
import { AddProductPage } from './addProduct';
function App() {
  return(
    <MyState>
   <Router>
    <SearchandUser/>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/products' element={<Products/>}/>
      <Route path='/product/:id' element={<SingleProduct/>}/>
      <Route path='/cart/:id' element={<Cart/>}/>
      <Route path='/placeOrder/:name/:id' element={<OrderForm/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/addproduct' element={<AddProductPage/>}/>
      <Route path='/userpage/:name' element={
        <UserRoute>
        <Userpage/>
        </UserRoute>
        }/>
      <Route path='/admin/:name' element={
        <AdminRoute>
        <AdminDashBoard/>
        </AdminRoute>
        }/>
        <Route path='/cart' element={<Cart/>}/>
    </Routes>
    <Footer/>
   </Router>
   </MyState>
  )
}

export default App
