import { useContext } from "react"
import { Products } from "./products"
import MyContext from "./context/mycontext"

export const Home = ()=>{
    return <div>
        <Products/>
    </div>
}