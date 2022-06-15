const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const Product = require('./Product');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

userSchema.methods.getCart = function () {
    const cartItems = this.cart.items;
    return cartItems.map(cp => {
        Product.findById(cp.productId)
            .then(product => {
                return {
                    ...product,
                    quantity: cp.quantity
                }
            })
    })
}
userSchema.methods.addToCart = function (product) {
    const productIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
    let updatedCartItems = [...this.cart.items];

    if (productIndex >= 0) {
        ++updatedCartItems[productIndex].quantity;
    } else {
        updatedCartItems.push({productId: product._id, quantity: 1});
    }
    this.cart = {items: updatedCartItems};
    this.save();
}
userSchema.methods.deleteCartItem = function (id) {
    const updatedCart = [...this.cart.items];
    this.cart = {
        items: updatedCart.filter(cp => {
            return cp.productId.toString() !== id.toString()
        })
    };
    return this.save();
}
module.exports = mongoose.model('User', userSchema);
