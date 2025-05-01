import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
export const Header = ()=>{
    return <header>
        <nav className="flex justify-around bg-amber-400 text-black p-3">
            <h1>PKS</h1>
            <ul className="flex gap-7">
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                <NavLink to="/about">About</NavLink>
                </li>
                <li>
                <NavLink to="/contact">Contact</NavLink>
                </li>
                <li>
                <NavLink to="/products">Products</NavLink>
                </li>
                <li className="text-2xl flex">
                   <NavLink to="/cart"><FaShoppingCart/></NavLink> 
                </li>
            </ul>
        </nav>
    </header>
}