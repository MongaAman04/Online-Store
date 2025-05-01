import { NavLink, useNavigate } from "react-router-dom"
import { FaUserLarge } from "react-icons/fa6";
import { useContext } from "react";
import MyContext from "../context/mycontext";
export const SearchandUser = ()=>{
    const user = JSON.parse(localStorage.getItem('users'));
    const navigate = useNavigate();

    const logout = ()=>{
        localStorage.clear('user');
        navigate("/login");
    }

    return (
        <div className="flex justify-around bg-blue-500 py-2">
            <input className="w-xs bg-white outline-none border border-black py-1 rounded-md  " placeholder="search" type="text" />
            {!user ?  <div>
               <NavLink to="/signup">
                <button className="w-15 h-8 bg-red-400 mx-6 rounded-md">Signup</button>
               </NavLink>
               <NavLink to="/login">
                <button className="w-15 h-8 bg-red-400 mx-6 rounded-md">login</button>
               </NavLink>
            </div> : <div className="flex gap-4">
           <NavLink to={`/userpage/${user.name}`}> <FaUserLarge className="text-3xl"/></NavLink>
           <button onClick={logout} className="bg-black text-white w-20 rounded-md">Logout</button>
           </div>
            }
           
        </div>
    )
}