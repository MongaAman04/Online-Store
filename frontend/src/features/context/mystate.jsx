import { useEffect, useState } from "react";
import MyContext from "../context/mycontext";
import { collection, onSnapshot, orderBy, query, doc, getDoc, setDoc } from "firebase/firestore";
import { Firedb } from "../../config/firebaseConfig";
import Cookies from "js-cookie";

export const MyState = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [getAllProduct, setAllProduct] = useState([]);
    const [cart, setCart] = useState([]);

    // ✅ Get logged in user from cookie
    const user = JSON.parse(Cookies.get("users") || "null");

    // ✅ Load cart from Firestore on login
    useEffect(() => {
        const loadCart = async () => {
            if (!user?.uid) return;
            try {
                const cartRef = doc(Firedb, "carts", user.uid);
                const cartSnap = await getDoc(cartRef);
                if (cartSnap.exists()) {
                    setCart(cartSnap.data().items || []);
                }
            } catch (err) {
                console.error("Failed to load cart:", err);
            }
        };
        loadCart();
    }, [user?.uid]);

    // ✅ Save cart to Firestore on every change
    useEffect(() => {
        const saveCart = async () => {
            if (!user?.uid || cart.length === 0) return;
            try {
                const cartRef = doc(Firedb, "carts", user.uid);
                await setDoc(cartRef, { items: cart, updatedAt: new Date() });
            } catch (err) {
                console.error("Failed to save cart:", err);
            }
        };
        saveCart();
    }, [cart]);

    // ✅ Cart functions
    const addToCart = (item) => {
        setCart(prev => {
            if (prev.some(p => p.id === item.id)) return prev; // no duplicates
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const deleteFromCart = (item) => {
        setCart(prev => prev.filter(p => p.id !== item.id));
    };

    const incrementCart = (id) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const decrementCart = (id) => {
        setCart(prev => prev.map(item =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ));
    };

    const clearCart = async () => {
        setCart([]);
        // ✅ Also clear in Firestore on logout
        if (user?.uid) {
            try {
                const cartRef = doc(Firedb, "carts", user.uid);
                await setDoc(cartRef, { items: [], updatedAt: new Date() });
            } catch (err) {
                console.error("Failed to clear cart:", err);
            }
        }
    };

    // ✅ Fixed: orderBy 'createdAt' to match your product schema
    const getAllProductFunction = () => {
        setLoading(true);
        try {
            const q = query(
                collection(Firedb, "products"),
                orderBy("createdAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const productsArray = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setAllProduct(productsArray);
                setLoading(false);
            }, (error) => {
                console.error("Products fetch error:", error);
                setLoading(false);
            });

            return unsubscribe; // ✅ proper cleanup
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = getAllProductFunction();
        return () => unsubscribe && unsubscribe(); // ✅ cleanup on unmount
    }, []);

    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            cart,
            addToCart,
            deleteFromCart,
            incrementCart,
            decrementCart,
            clearCart,
        }}>
            {children}
        </MyContext.Provider>
    );
};