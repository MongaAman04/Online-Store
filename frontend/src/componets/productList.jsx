import { NavLink } from "react-router-dom"

export const ProductList = (currEle)=>{ 
    return <li key={currEle.data.id} className="border-2 border-black w-3xs">
        <h1>{currEle.data.name}</h1>
        <p>{currEle.data.description}</p>
        <h2>{currEle.data.price}</h2>
        <NavLink to={`/product/${currEle.data.id}`}>
            <button>Buy Now</button>
        </NavLink>
    </li>
}