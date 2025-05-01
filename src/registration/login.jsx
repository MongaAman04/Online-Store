import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../context/mycontext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth, Firedb } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Loader from "../componets/loader";

const Login = () => {
    const context = useContext(MyContext);
    const {loading , setLoading} = context;

    const navigate = useNavigate();

    const [userLogin , setUserLogin] = useState({
       email : "",
       password : ""
    })
    
    const userLoginFunction = async ()=>{
        
        if( userLogin.email==="" || userLogin.password=== ""){
            return alert("All fields are empty")
        }
        setLoading(true);
        try {
            const users = await signInWithEmailAndPassword(Auth , userLogin.email , userLogin.password);
            try {
              const q = query(
                collection(Firedb,"user"),
                where("uid","==",users.user.uid)
              )
                const data = onSnapshot(q ,(QuerySnapshot)=>{
                    let user;
                    QuerySnapshot.forEach(doc => user = doc.data());
                    localStorage.setItem("users",JSON.stringify(user));
                    setUserLogin({
                        email: "",
                        password : ""
                    })
                    alert("Login SuccessFully");
                    setLoading(false);
                    if (user.role == "user") {
                        navigate(`/userpage/${user.name}`)
                    }else{
                        navigate(`/admin/${user.name}`)
                    }
                })
                return ()=> data
            } catch (error) {
                console.log(error);;
                setLoading(false)
                
            }
            
        } catch (error) {
            console.log(error);
            setLoading(false);
            alert("Login Failed")
            
        }
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <div className="login_Form bg-pink-50 px-1 lg:px-8 py-6 border border-pink-100 rounded-xl shadow-md">
               
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500 '>
                    </h2>
                </div>
             
                <div className="mb-3">
                    <input
                        type="email"
                        placeholder='Email Address'
                        value={userLogin.email}
                        onChange={(e)=>{
                            setUserLogin({
                                ...userLogin,
                                email : e.target.value
                            })
                        }}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>
                
                <div className="mb-5">
                    <input
                        type="password"
                        placeholder='Password'
                        value={userLogin.password}
                        onChange={(e)=>{
                            setUserLogin({
                                ...userLogin,
                                password : e.target.value
                            })
                        }}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>
              
                <div className="mb-5">
                    <button
                        type='button'
                        onClick={userLoginFunction}
                        className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md '
                    >
                        Login
                    </button>
                </div>
                <div>
                    <h2 className='text-black'>Don't Have an account <Link className=' text-pink-500 font-bold' to={'/signup'}>Signup</Link></h2>
                </div>
            </div>
        </div>
    );
}

export default Login;