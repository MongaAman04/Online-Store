import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
    name: "cart",
    initialState: {
        cartitems: []
    },
    reducers: {
        addtocart(state, action) {
            state.cartitems.push(action.payload);
        },

        // FIX 1: Assign filtered result back to state.cartitems
        deletefromcart(state, action) {
            state.cartitems = state.cartitems.filter(item => item.id !== action.payload.id);
        },

        // FIX 2: Use forEach to mutate in place (Immer-friendly)
        incrementCart(state, action) {
            state.cartitems.forEach(item => {
                if (item.id === action.payload) {
                    item.quantity++;
                }
            });
        },

        // FIX 2 (same): Use forEach to mutate in place
        decrementCart(state, action) {
            state.cartitems.forEach(item => {
                if (item.id === action.payload && item.quantity > 1) {
                    item.quantity--;
                }
            });
        }
    }
});

export const { addtocart, deletefromcart, incrementCart, decrementCart } = CartSlice.actions;

export default CartSlice.reducer;