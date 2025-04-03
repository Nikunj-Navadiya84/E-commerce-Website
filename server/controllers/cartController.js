const User = require("../models/User");

exports.addcart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "Missing userId or itemId" });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        if (cartData[itemId]) {
            cartData[itemId].quantity += 1;
        } else {
            cartData[itemId] = { quantity: 1, size };
        }

        await User.findByIdAndUpdate(userId, { cartData }, { new: true });

        res.json({ success: true, message: "Item added to cart", cartData });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Update user cart
exports.updatecart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {}; 

        if (!cartData[itemId]) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        cartData[itemId].quantity = quantity;

        await User.findByIdAndUpdate(userId, { cartData }, { new: true });

        res.json({ success: true, message: "Cart updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user cart data
exports.getUsercart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: userData.cartData || {} });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}; 
