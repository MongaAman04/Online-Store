import { HeroSection } from "./hero"
import { TrustBar } from "./trustbar"
import { CategorySection } from "./category"
import { Products } from "./products"

export const Home = ()=>{
    return <div>
        <HeroSection/>
        <TrustBar/>
        <CategorySection/>
        <Products/>
    </div>
}