import { configureStore } from "@reduxjs/toolkit";
import { CartSlice } from "./cartslice";

export const Store = configureStore({
    reducer : {
        cart : CartSlice,
    },
})