import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
    name : "cart",
    initialState: {
        cartitems : []
    },
    reducers: {
        addtocart(state , action){
            state.cartitems.push(action.payload)
        },
        deletefromcart(state ,action){
            return state.cartitems.filter(item => item.id !== action.payload.id);
        },
        incrementCart(state,action){
            state.cartitems.map(item =>{
                if (item.id === action.payload) {
                    item.quantity++;
                }
                return item
            })
        },
        decrementCart(state,action){
            state.cartitems.map(item =>{
                if (item.quantity !== 1) {
                   if (item.id === action.payload) {
                        item.quantity--;
                   }
                }
                return item
            })
        }

    }
})

export const {addtocart , deletefromcart , incrementCart , decrementCart} = CartSlice.actions

export default CartSlice.reducer