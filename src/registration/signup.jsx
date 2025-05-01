import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../context/mycontext";
import { Auth, Firedb } from "../firebase/firebaseConfig";
import {Timestamp, addDoc , collection } from "firebase/firestore";
import Loader from "../componets/loader";
import { createUserWithEmailAndPassword } from "firebase/auth";
const Signup = () => {
    const context = useContext(MyContext);
    const {loading , setLoading} = context;

    const navigate = useNavigate();

    const [userSignUp , setUserSignUp] = useState({
        name : "",
        email : "",
        password : "",
        role : "user"
    })

    const userSignupFunction = async ()=>{
        if(userSignUp.name === "" || userSignUp.email==="" || userSignUp.password=== ""){
            return alert("All fields are empty")
        }
        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword( Auth , userSignUp.email , userSignUp.password);

            const user = {
                name : userSignUp.name,
                email : users.user.email,
                uid : users.user.uid,
                role : userSignUp.role,
                time : Timestamp.now(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            }

            const UserRef = collection(Firedb , "user");

            addDoc(UserRef , user);

            setUserSignUp({
                name : "",
                email : "",
                password : ""
            });

            alert("SignUp successfully");
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
        }
        return (
        <div className='flex justify-center items-center h-screen'>
              {loading && <Loader/>}
            <div className="login_Form bg-pink-50 px-1 lg:px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500 '>
                    </h2>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder='Full Name'
                        value={userSignUp.name}
                        onChange={(e)=>{
                            setUserSignUp({
                                ...userSignUp,
                                name : e.target.value
                            })
                        }}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        placeholder='Email Address'
                        value={userSignUp.email}
                        onChange={(e)=>{
                            setUserSignUp({
                                ...userSignUp,
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
                        value={userSignUp.password}
                        onChange={(e)=>{
                            setUserSignUp({
                                ...userSignUp,
                                password : e.target.value
                            })
                        }}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>
                <div className="mb-5">
                    <button
                        type='button'
                        onClick={userSignupFunction}
                        className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md '
                    >
                        SignUp
                    </button>
                </div>
                <div>
                    <h2 className='text-black'>Have an account <Link className=' text-pink-500 font-bold' to={'/login'}>Login</Link></h2>
                </div>
            </div>
        </div>
    );
}

export default Signup;