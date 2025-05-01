import { NavLink } from "react-router-dom"
import ProductData from "./api/products.json"
import { ProductList } from "./componets/productList"
import { useContext, useEffect } from "react"
import MyContext from "./context/mycontext"
import Loader from "./componets/loader"
import { useDispatch, useSelector } from "react-redux"
import { addtocart, deletefromcart } from "./redux/cartslice"
export const Products = ()=>{
    const context = useContext(MyContext);
    const {loading , getAllProduct} = context;

    // const cartItems = useSelector((state)=> state.cart.cartitems);

    // const dispatch = useDispatch();

    // const addCart = (item)=>{
    //     console.log(item);
        
    //     dispatch(addtocart(item))
    //     // toast.success("Added to cart")
    // }
    // const deleteCart = (item)=>{
    //     dispatch(deletefromcart(item))
    //     // toast.success("Deleted from cart")
    // }
    // console.log(cartItems);
    
    // useEffect(()=>{
    //     localStorage.setItem('cart',JSON.stringify(cartItems));
    // },[cartItems]);
    

    return (<div className="mt-10">
    <div className="">
        <h1 className=" text-center mb-5 text-2xl font-semibold">Bestselling Products</h1>
    </div>
    <section className="text-gray-600 body-font">
        {loading && <Loader/>}
        <div className="container px-5 py-5 mx-auto">
            <div className="flex flex-wrap -m-4">
                {getAllProduct.map((item, index) => {
                    const { id , image, title, price } = item
                    
                    return (
                        <div key={index} className="p-4 w-full md:w-1/4">
                            <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                    <img
                                        className="lg:h-80  h-96 w-full"
                                        src={image}
                                        alt="blog"
                                    />
                                <div className="p-6">
                                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                    </h2>
                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                        {title.substring(0, 25)}
                                    </h1>
                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                        ₹{price}
                                    </h1>
                                    <div className="flex justify-center ">
                                        {getAllProduct.map((p)=> p.id === item.id)
                                            ?
                                            <button
                                                    onClick={() => deleteCart(item)}
                                                    className=" bg-red-700 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold">
                                                </button>
                                            :
                                        <NavLink to={`/product/${id}`}>
                                        <button className=" bg-pink-500 hover:bg-pink-600 w-3xs text-white py-[4px] rounded-lg font-bold"
                                        onClick={()=> addCart(item)}>
                                            Add to  cart
                                        </button>
                                        </NavLink>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </section>
</div>)
}