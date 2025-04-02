import { createContext, useState, useEffect } from "react";
export const StoreContext = createContext();
import axios from "axios";

export const ShopContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [list, setList] = useState([]);
    const [listOpen, setListOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false);
    const [user, setUser] = useState("");
    const delivery_fee = 10;
    const token = localStorage.getItem("token");
    const [likedProducts, setLikedProducts] = useState({});

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
        setLikedProducts(storedWishlist);
    }, []);
    
    // WishList
    const addToWishlist = async (product) => {
        if (!token) return console.log("User not authenticated");

        try {
            const response = await axios.post("http://localhost:4000/api/wishlist/addwishlist",
                { productId: product._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setLikedProducts((prev) => {
                    const updatedWishlist = { ...prev, [product._id]: true };
                    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                    return updatedWishlist;
                });
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const removeFromWishlist = async (product) => {
        if (!token) return console.log("User not authenticated");

        try {
            const response = await axios.delete("http://localhost:4000/api/wishlist/removewishlist", {
                data: { productId: product._id },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setLikedProducts((prev) => {
                    const updatedWishlist = { ...prev };
                    delete updatedWishlist[product._id];
                    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                    return updatedWishlist;
                });
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    // Get Wishlist Count
    const getListCount = () =>likedProducts.length;


    // Fetch user data
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const response = await fetch("http://localhost:4000/api/user/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json();
            setUser({
                name: data.LoginUserName || "Unknown User",
                email: data.email || "No Email",
                profilePic: data.profilePic || null,
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser()
    })


    // Keep user data in local storage updated
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);


    // Wishlist Product
    const addToList = (product) => {
        setList((prevList) => {
            const existingItem = prevList.find((item) => item.id === product.id);
            if (existingItem) {
                return prevList.filter((item) => item.id !== product.id);
            }
            return [...prevList, { ...product }];
        });
        setListOpen(false);
    };


    // Check if Product is Liked
    const isLiked = (productId) => {
        return list.some((item) => item.id === productId);
    };


    // Add to Cart
    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
        setCartOpen(false);
        setQuantity(1);
    };


    // Update Cart Quantity
    const updateCartQuantity = (id, newQuantity) => {
        setCart((prevCart) => {
            if (newQuantity === 0) {
                return prevCart.filter(item => item.id !== id);
            }
            return prevCart.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );
        });
    };


    // Handle Quantity Change
    const handleQuantityChange = (event) => {
        const value = Math.max(1, parseInt(event.target.value));
        setQuantity(value);
    };


    // Get Cart Count
    const getCartCount = () => cart.length;


    // Get Cart Amount
    const getCartAmount = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };


    const contextValue = {
        cart,
        setCart,
        cartOpen,
        setCartOpen,
        addToCart,
        handleQuantityChange,
        quantity,
        updateCartQuantity,
        getCartCount,
        addToList,
        list,
        setList,
        listOpen,
        setListOpen,
        isLiked,
        getListCount,
        getCartAmount,
        delivery_fee,
        removeFromWishlist,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        likedProducts, setLikedProducts, addToWishlist
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};
