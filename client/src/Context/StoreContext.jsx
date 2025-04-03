import { createContext, useState, useEffect } from "react";
export const StoreContext = createContext();
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [wishlist, setWishList] = useState([]);



    // Add to Wishlist
    const addToWishlist = async (product) => {
        if (!token) {
            toast.error("User is not authenticated!");
            return;
        }

        if (!product?._id) {
            toast.error("Invalid product data!");
            return;
        }

        // Prevent duplicate wishlist entries
        if (likedProducts[product._id]) {
            toast.info("Product is already in your wishlist!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/wishlist/addwishlist",
                { productId: product._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setLikedProducts((prev) => ({
                    ...prev,
                    [product._id]: true,
                }));
                setWishList((prev) => [...prev, product]); // Update wishlist state
                localStorage.setItem("wishlist", JSON.stringify([...wishlist, product])); // Store updated list in localStorage
                toast.success("Added to wishlist!");
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error.response?.data);
            if (error.response?.data?.message === "Product already in wishlist") {
                toast.info("Product is already in your wishlist!");
            } else {
                toast.error("Failed to add to wishlist");
            }
        }
    };

    // Remove from Wishlist
    const removeFromWishlist = async (product) => {
        if (!token) {
            toast.error("User not authenticated");
            return;
        }

        try {
            const response = await axios.delete(
                "http://localhost:4000/api/wishlist/removewishlist",
                {
                    data: { productId: product._id },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setLikedProducts((prev) => {
                    const updatedWishlist = { ...prev };
                    delete updatedWishlist[product._id];
                    return updatedWishlist;
                });

                const updatedWishlist = wishlist.filter((item) => item._id !== product._id);
                setWishList(updatedWishlist);
                localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                toast.warn("Removed from wishlist");
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    // Fetch Wishlist from API
    const fetchWishlist = async () => {
        try {
            if (!token) {
                console.error("No authentication token found");
                return;
            }

            const res = await axios.get("http://localhost:4000/api/wishlist/getwishlist", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (res.data.success && res.data.wishlist?.products) {
                setWishList(res.data.wishlist.products);
                localStorage.setItem("wishlist", JSON.stringify(res.data.wishlist.products));
                setLikedProducts(() =>
                    res.data.wishlist.products.reduce((acc, product) => {
                        acc[product._id] = true;
                        return acc;
                    }, {})
                );
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishList(savedWishlist);
        setLikedProducts(() =>
            savedWishlist.reduce((acc, product) => {
                acc[product._id] = true;
                return acc;
            }, {})
        );
    }, []);

    useEffect(() => {
        if (token) {
            fetchWishlist();
        }
    }, [token]);

    // Get Wishlist Count
    const getListCount = () => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        return savedWishlist.length;
    };






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
                UserId: data.userId,
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
    });

    // Keep user data in local storage updated
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("UserId", user.UserId);
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("UserId");
        }
    }, [user]);







    const addToCart = async (products, quantity = 1) => {
        const userId = localStorage.getItem("UserId"); 
        const token = localStorage.getItem("token");
    
        if (!token || !userId) {
            alert("Please log in to add items to the cart.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:4000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId, 
                    productId: products._id, 
                    quantity,
                }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to add product to cart");
    
            console.log("API Response:", data);
    
            if (typeof setCart === "function") {
                setCart(data.cartData);
            }
    
        } catch (error) {
            console.error("Error adding to cart:", error.message);
        }
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
        cart, setCart, cartOpen, setCartOpen, addToCart, handleQuantityChange, quantity, updateCartQuantity, getCartCount, list, setList, listOpen, setListOpen, getListCount, getCartAmount, delivery_fee, removeFromWishlist, isLoggedIn, setIsLoggedIn, user, setUser, likedProducts, setLikedProducts, addToWishlist, fetchWishlist, wishlist
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};
