import { useParams } from "react-router-dom"

export const OrderForm = ()=>{
    const { id , title} = useParams();
    // console.log(name ,id);
    const handleSubmit = ()=>{
        Notification.requestPermission().then(prem=>{
            if(prem=== "granted"){
                  Notification("Thanks for ordering",{
                    body:"Yourt order eill be placed",
                })
            }
            
        })
    }
    return <form>
           <span className="">
            <input type="text" value={id} disabled />
            <input type="text" value={title} disabled/>
            <input type="text" id="name" name="Username"/>
            </span>
        <button onClick={handleSubmit}>Place Order</button>
        </form>

}