import { createContext, useState, useEffect } from "react";
export const StoreContext = createContext();
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ShopContextProvider = ({ children }) => {

    const [cartOpen, setCartOpen] = useState(false);
    const [cartProducts, setCartProducts] = useState({});
    const [cart, setCart] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [list, setList] = useState([]);
    const [listOpen, setListOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false);
    const [user, setUser] = useState("");
    const delivery_fee = 10;
    const token = localStorage.getItem("token");
    const [likedProducts, setLikedProducts] = useState({});
    const [wishlist, setWishList] = useState([]);





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




    // Add To Cart
    const addToCart = async (product, quantity = 1) => {
        if (!token) {
            toast.error("User is not authenticated!");
            return;
        }

        if (!product || !product._id || quantity <= 0) {
            toast.error("Invalid product data or quantity!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/cart/addcart",
                { productId: product._id, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                let updatedCart = [...cart];
                const existingIndex = updatedCart.findIndex(p => p._id === product._id);

                if (existingIndex !== -1) {
                    updatedCart[existingIndex].quantity += quantity;
                } else {
                    updatedCart.push({ ...product, quantity });
                }

                setCart(updatedCart);

                setCartProducts((prev) => ({
                    ...prev,
                    [product._id]: (prev[product._id] || 0) + quantity,
                }));

                toast.success(`${quantity} items added to cart!`);
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data);
            if (error.response?.data?.message === "Product already in cart") {
                toast.info("Product is already in your cart!");
            } else {
                toast.error("Failed to add to cart");
            }
        }
    };

    // Update Quantity
    const updateCartQuantity = async (product, newQuantity) => {
        if (!token) {
            toast.error("User is not authenticated!");
            return;
        }

        if (!product || !product._id || isNaN(newQuantity) || newQuantity < 0) {
            toast.error("Invalid product or quantity!");
            return;
        }
        // Optimistically update UI
        const newCart = cart.map((p) =>
            p._id === product._id ? { ...p, quantity: newQuantity } : p
        );
        setCart(newCart);


        try {
            const response = await axios.put(
                "http://localhost:4000/api/cart/updatecart",
                {
                    productId: product._id,
                    quantity: Number(newQuantity),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success && response.data.cart?.product) {
                const updatedCart = response.data.cart.product.map((p) => ({
                    ...p.product,
                    quantity: p.quantity,
                }));

                setCart([...updatedCart]);

                const updatedCartProducts = {};
                updatedCart.forEach((p) => {
                    updatedCartProducts[p._id] = p.quantity;
                });

                setCartProducts({ ...updatedCartProducts });

                toast.success("Cart updated!");
            } else {
                toast.info(response.data.message || "Failed to update cart");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update cart");
        }
    };

    // Handle Quantity Change
    const handleQuantityChange = (event) => {
        const value = Math.max(1, parseInt(event.target.value));
        setQuantity(value);
    };

    // Cart List
    const fetchcartlist = async () => {
        try {
            if (!token) {
                console.error("No authentication token found");
                return;
            }

            const res = await axios.get("http://localhost:4000/api/cart/getcart", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (res.data.success && res.data.cart?.products) {
                const productsFromCart = res.data.cart.products.map(p => ({
                    ...p.product,  // because populated
                    quantity: p.quantity || 1, // Default quantity if not available
                }));

                // If a product is already in the cart, update its quantity or add it if not present
                const updatedCart = [...cart]; // Assuming cart is a state variable that holds the current cart items

                productsFromCart.forEach((product) => {
                    const existingIndex = updatedCart.findIndex(p => p._id === product._id);

                    if (existingIndex === -1) {
                        // Product not found in cart, add it with quantity 1
                        updatedCart.push({ ...product, quantity: 1 });
                    } else {
                        // Product found in cart, update quantity if needed
                        updatedCart[existingIndex].quantity = product.quantity;
                    }
                });

                setCart(updatedCart);

                // Update the cart products state as well
                const updatedCartProducts = {};
                updatedCart.forEach((p) => {
                    updatedCartProducts[p._id] = p.quantity;
                });

                setCartProducts(updatedCartProducts);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchcartlist();
        }
    }, [token]);

    // cart Remove
    const handleRemove = async (product) => {
        const token = localStorage.getItem("token");
        const prevCart = [...cart];
        const updatedCart = cart
            .map((item) =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0);

        setCart(updatedCart);

        try {
            const response = await fetch("http://localhost:4000/api/cart/removecart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: product.quantity > 1 ? product.quantity - 1 : 0
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update cart.");
            }

            await response.json();
        } catch (error) {
            console.error("Error removing product:", error.message);
            setCart(prevCart);
        }
    };

    // Get Cart Count
    const getCartCount = () => cart.length;

    // Get Cart Amount
    const getCartAmount = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };




    const contextValue = {
        cart, setCart, cartOpen, setCartOpen, addToCart, quantity, updateCartQuantity, getCartCount, list, setList, listOpen, setListOpen, getListCount, getCartAmount, delivery_fee, removeFromWishlist, isLoggedIn, setIsLoggedIn, user, setUser, likedProducts, setLikedProducts, addToWishlist, fetchWishlist, wishlist, handleRemove, cartProducts, handleQuantityChange
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};
