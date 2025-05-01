import { useEffect, useState } from "react";
import MyContext from "./mycontext";
import { collection, onSnapshot, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { Firedb } from "../firebase/firebaseConfig";

export const MyState = ({ children })=>{
    const [loading , setLoading] = useState(false);

    const [getAllProduct , setAllProducst] = useState([]);

    const getAllProductFunction = async()=>{
        setLoading(true);
        try {
            const q = query(
                collection(Firedb , 'products'),
                orderBy('time')
            )
            const data = onSnapshot(q , (QuerySnapshot)=>{

                let productsArray = [];

                QuerySnapshot.forEach((doc)=>{
                    productsArray.push({...doc.data(), id : doc.id})
                })
                setAllProducst(productsArray)
                setLoading(false);
            })
            return ()=> data
            
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllProductFunction();
    },[]) 
    return <MyContext.Provider value={
       { 
        loading,
        setLoading,
        getAllProduct
    }
    }>
       {children}
    </MyContext.Provider>
}