import { useContext, useState } from "react";
import MyContext from "./context/mycontext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loader from "./componets/loader";
import { Firedb } from "./firebase/firebaseConfig";

const categoryList = [
    {
        name: 'fashion'
    },
    {
        name: 'shirt'
    },
    {
        name: 'jacket'
    },
    {
        name: 'mobile'
    },
    {
        name: 'laptop'
    },
    {
        name: 'shoes'
    },
    {
        name: 'home'
    },
    {
        name: 'books'
    }
]
export const AddProductPage = () => {
    const context = useContext(MyContext);
    const {loading , setLoading} = context;

    const navigate = useNavigate();
    const [products , setProducts] = useState({
        title : "",
        price : "",
        image : "",
        category : "",
        description : "",
        quantity : 1,
        time : Timestamp.now(),
        date : new Date().toLocaleString(
            "en-US",
            {
                month : "short",
                day : "2-digit",
                year : "numeric"
            }
        )
    })

   const addProductFunction = async ()=>{
    if (products.title == "" || products.price == "" || products.category =="" || products.image == "" ||  products.description == "") {
        return alert("Fill the all fields");
    }
    setLoading(true);

    try {
        const productRef = collection(Firedb , 'products');
        await addDoc(productRef , products);
        alert("Product addes successfully")
        setLoading(false);
        navigate("/admin/:name");
    } catch (error) {
        setLoading(false);
        alert(error);
        navigate("/admin/:name");
    }

   }
    return (
        <div>
            <div className='flex justify-center items-center h-screen'>
              {loading && <Loader/>}
                <div className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                    <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-pink-500 '>
                            Add Product
                        </h2>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="title"
                            placeholder='Product Title'
                            value={products.title}
                            onChange={(e)=>{
                                setProducts({
                                    ...products,
                                    title : e.target.value
                                })
                            }}
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            placeholder='Product Price'
                            value={products.price}
                            onChange={(e)=>{
                                setProducts({
                                    ...products,
                                    price : e.target.value
                                })
                            }}
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder='Product Image Url'
                            value={products.image}
                            onChange={(e)=>{
                                setProducts({
                                    ...products,
                                    image : e.target.value
                                })
                            }}
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder='Product Quantity'
                            value={products.quantity}
                            onChange={(e)=>{
                                setProducts({
                                    ...products,
                                    quantity : e.target.value
                                })
                            }}
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <select className="w-full px-1 py-2 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none 
                         "
                         value={products.category}
                         onChange={(e)=>{
                            setProducts({
                                ...products,
                                category : e.target.value
                            })
                         }}>
                            <option disabled>Select Product Category</option>
                            {categoryList.map((value, index) => {
                                const { name } = value
                                return (
                                    <option className=" first-letter:uppercase" key={index} value={name}>{name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="mb-3">
                        <textarea name="description" placeholder="Product Description" rows="5" className=" w-full px-2 py-1 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none placeholder-pink-300 "
                         value={products.description}
                         onChange={(e)=>{
                             setProducts({
                                 ...products,
                                 description : e.target.value
                             })
                         }}>
                       
                        </textarea>
                    </div>
                    <div className="mb-3">
                        <button
                            type='button'
                            onClick={addProductFunction}
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md '
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}